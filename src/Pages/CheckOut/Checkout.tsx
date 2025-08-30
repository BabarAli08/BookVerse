import React, { useState } from "react";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import supabase from "../../supabase-client";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { updateCurrentPlan, updateBillingHistory, updatePaymentMethod } from "../../Store/UserSettingsSlice";
import { setBoughtPremium } from "../../Store/PremiumBookSlice";

const Checkout = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
    email: "",
    promoCode: "",
    country: "United States",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { plan } = useSelector((state: RootState) => state.payment);
  const { reading } = useSelector((state: RootState) => state.userSettings);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4);
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace("/", "").length <= 4) {
      handleInputChange("expiryDate", formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      handleInputChange("cvc", value);
    }
  };

  const validateForm = () => {
    const required = [
      "cardNumber",
      "expiryDate",
      "cvc",
      "cardholderName",
      "email",
      "address_line_1",
      "city",
      "state",
      "zip",
    ];

    for (let field of required) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        alert(`Please fill in ${field.replace("_", " ")}`);
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      alert("Please enter a valid card number");
      return false;
    }

    if (formData.cvc.length < 3) {
      alert("Please enter a valid CVC");
      return false;
    }

    return true;
  };

  const getNextBillingDate = (isYearly: boolean) => {
    const today = new Date();
    const nextBilling = new Date(today);

    if (isYearly) {
      nextBilling.setFullYear(today.getFullYear() + 1);
    } else {
      nextBilling.setMonth(today.getMonth() + 1);
    }

    return nextBilling.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const dispatch=useDispatch()

  const handlePurchase = async () => {
     if (!validateForm()) return;

    setLoading(true);
    console.log("proceeding with payment...");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Please sign in to continue");
        return;
      }

      const { data: existingSub, error: checkError } = await supabase
        .from("subscriptions")
        .select("*") 
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing subscription:", checkError);
        alert("Error checking subscription status");
        return;
      }

      const subscriptionData = {
        user_id: user.id,
        plan_type: plan?.name || "premium",
        billing_cycle: plan?.yearly ? "yearly" : "monthly",
        status: "active",
        card_number: `****${formData.cardNumber.slice(-4)}`,
        card_holder_name: formData.cardholderName,
        expiry_date: formData.expiryDate,
        cvc: formData.cvc,
        email: formData.email,
        country: formData.country,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        city: formData.city,
        next_billing_date: getNextBillingDate(plan?.yearly || false),
        state: formData.state,
        postal_code: formData.zip,
        amount: parseFloat(plan?.price?.replace("$", "") || "9.99"), 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingSub) {
        
        const historyResult = await supabase
          .from("subscription_history")
          .insert([
            {
              user_id: existingSub.user_id,
              plan_type: existingSub.plan_type,
              billing_cycle: existingSub.billing_cycle,
              status: "cancelled",
              start_date: existingSub.created_at,
              end_date: new Date().toISOString(),
              amount: parseFloat(existingSub.amount || "0"),
              card_number: existingSub.card_number,
              card_holder_name: existingSub.card_holder_name,
              created_at: existingSub.created_at,
            },
          ]);

        if (historyResult.error) {
          console.error("Error archiving subscription:", historyResult.error);
          alert("Error processing subscription history");
          return;
        }

        const updateResult = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("user_id", user.id);

        if (updateResult.error) {
          console.error("Database error:", updateResult.error);
          alert(
            "There was a problem processing payment: " +
              updateResult.error.message
          );
          return;
        }
      } else {
 
        const insertResult = await supabase
          .from("subscriptions")
          .insert([subscriptionData]);

        if (insertResult.error) {
          console.error("Database error:", insertResult.error);
          alert(
            "There was a problem processing payment: " +
              insertResult.error.message
          );
          return;
        }
      }

      toast.success("Payment successful!");
      dispatch(updateCurrentPlan({
        name: plan?.name || "premium",
        price: plan?.price || "9.99",
        nextBillingDate: getNextBillingDate(plan?.yearly || false),
        status: "active",
        billingCycle: plan?.yearly ? "yearly" : "monthly",
        isYearly: plan?.yearly || false,
        }));
      dispatch(updateBillingHistory({
        name: existingSub?.plan_type || plan?.name || "premium",
        price: existingSub?.amount || plan?.price || "9.99",
        endDate:existingSub.end_date || new Date().toISOString(),
       
      }))
      dispatch(updatePaymentMethod({
        type: "visa",
        cardNumber: formData.cardNumber,
        cardHolderName: formData.cardholderName,
        expiryDate: formData.expiryDate,
        cvc: formData.cvc,
        
      }));
      navigate("/success");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again."+ error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Secure checkout for your BookVerse subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-3 border-2 border-blue-500 rounded-lg cursor-pointer bg-blue-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span className="font-medium">Credit or Debit Card</span>
                  <div className="ml-auto flex space-x-1">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                      VISA
                    </div>
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      MC
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                    disabled
                  />
                  <div className="w-5 h-5 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-400">PayPal</span>
                  <span className="ml-auto text-sm text-gray-400">
                    Coming Soon
                  </span>
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Card Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC *
                      </label>
                      <input
                        type="text"
                        value={formData.cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={formData.cardholderName}
                      onChange={(e) =>
                        handleInputChange("cardholderName", e.target.value)
                      }
                      placeholder="Babar ALi"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Billing Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="babaralidev08@gmail.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Pakistan</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>India</option>
                    <option>China</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.address_line_1}
                      onChange={(e) =>
                        handleInputChange("address_line_1", e.target.value)
                      }
                      placeholder="123 Main Street"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.address_line_2}
                      onChange={(e) =>
                        handleInputChange("address_line_2", e.target.value)
                      }
                      placeholder="Apartment, suite, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="New York"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="NY"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      placeholder="10001"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {plan?.name || "Premium Plan"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Billed {plan?.yearly ? "Yearly" : "Monthly"}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  {plan?.yes?.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center text-green-600">
                      <span className="mr-2">✓</span>
                      {feature}
                    </div>
                  ))}

                  <p className="text-gray-500 text-xs">+3 more features</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.promoCode}
                      onChange={(e) =>
                        handleInputChange("promoCode", e.target.value)
                      }
                      placeholder="Enter code"
                      className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${Number(plan?.price).toFixed(2) || "9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      $
                      {(
                        (parseFloat(plan?.price?.replace("$", "") || "9.99") /
                          10) *
                        0.8
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        parseFloat(plan?.price?.replace("$", "") || "9.99") +
                        (parseFloat(plan?.price?.replace("$", "") || "9.99") /
                          10) *
                          0.8
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mt-6 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  } text-white`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  {loading ? "Processing..." : "Complete Purchase"}
                </button>

                <div className="flex items-center justify-center text-xs text-gray-500 mt-3">
                  <Lock className="w-3 h-3 mr-1" />
                  Secure checkout with 256-bit SSL encryption
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By completing this purchase, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
