import { useEffect, useState } from "react";
import { CreditCard, Crown, Plus, Loader2 } from "lucide-react";
import supabase from "../../supabase-client";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { current } from "@reduxjs/toolkit";

interface planState {
  id: string;
  user_id: string;
  plan_type: string;
  billing_cycle: string;
  status: string;
  card_number: string;
  card_holder_name: string;
  expiry_date: string;
  cvc: string;
  email: string;
  country: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  next_billing_date: string;
  state: string;
  postal_code: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export default function Billing() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState<boolean>(false);

  const [currentPlan, setCurrentPlan] = useState({
    name: "free",
    price: "$0.00/month",
    nextBilling: "lifetime",
    status: "active",
    isYearly: false,
  });
  const [changePlanModal, setChangePlanModal] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState({
    type: "visa",
    lastFour: "4242",
    expires: "12/25",
  });

  const [updatedPaymentMethod, setUpdatedPaymentMethod] = useState({
    type: "visa",
    lastFour: "",
    expires: "",
    cvc: "",
    cardHolderName: "",
  });

  const [showUpdatePaymentMethodModal, setShowUpdatePaymentModal] =
    useState<boolean>(false);

  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan.name);

  const [billingHistory, setBillingHistory] = useState<
    Array<{
      id: string;
      plan: string;
      date: string;
      amount: string;
    }>
  >([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getCurrentPlan = async () => {
      try {
        setIsLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          toast.error("Error getting user information");
          return;
        }

        if (user) {
          const { data, error: currentPlanError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (currentPlanError && currentPlanError.code !== "PGRST116") {
            toast.error("Error fetching current plan");
            console.error("Current plan error:", currentPlanError);
          }

          if (data) {
            setCurrentPlan({
              name: data.plan_type,
              price: `$${data.amount}`,
              nextBilling: new Date(data.next_billing_date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              ),
              status: data.status,
              isYearly: data.billing_cycle === "yearly",
            });

            setPaymentMethod({
              type: "visa",
              lastFour: data.card_number.slice(-4),
              expires: data.expiry_date,
            });
          }

          const { data: previousPlans, error: previousPlansError } =
            await supabase
              .from("subscription_history")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });

          if (previousPlansError) {
            toast.error("Error fetching previous plans");
            console.error("Previous plans error:", previousPlansError);
          }

          if (previousPlans && previousPlans.length > 0) {
            setBillingHistory(
              (previousPlans as planState[]).map((plan: planState) => ({
                id: plan.id, // Keep as string, don't parse as int
                plan: plan.plan_type,
                date: new Date(plan.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                amount: `$${plan.amount}`,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentPlan();
  }, [isCanceling, isUpdatingPlan, isUpdatingPayment]);

  const handleCancelSubscription = async () => {
    if(currentPlan.status==="canceled"){
      toast.warning("Already canceled");
      setShowCancelSubscriptionModal(false);
      return;
    }
    try {
      setIsCanceling(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.warning("Unable to get user information");
        return;
      }

      const { data: userSubscription, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (subscriptionError) {
        toast.error("Error fetching subscription details");
        return;
      }

      if (!userSubscription) {
        toast.warning("No active subscription found");
        return;
      }

      const { id, ...subscriptionData } = userSubscription;

      const cancelledSubscription = {
        ...subscriptionData,
        status: "canceled",
        end_date: new Date().toISOString(),
      };
      console.log("Cancelled Subscription:", cancelledSubscription);

      const { error: historyError } = await supabase
        .from("subscription_history")
        .insert([cancelledSubscription]);

      if (historyError) {
        toast.error(
          `Error saving subscription history: ${
            historyError.message || JSON.stringify(historyError)
          }`
        );
        console.error("History error:", historyError);
        return;
      }

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        toast.error(
          `Unable to cancel subscription, please try again: ${updateError.message}`
        );
        console.error("Update error:", updateError);
        return;
      }

      setCurrentPlan((prev) => ({
        ...prev,
        status: "canceled",
      }));

      toast.success("Subscription cancelled successfully");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unable to cancel subscription, please try again");
    } finally {
      setIsCanceling(false);
    
      setShowCancelSubscriptionModal(false);
    }
  };

  useEffect(() => {
    const getCurrentPlan = async () => {
      try {
        setIsLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          toast.error("Error getting user information");
          return;
        }

        if (user) {
          const { data, error: currentPlanError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (currentPlanError) {
            if (currentPlanError.code === "PGRST116") {
              setCurrentPlan({
                name: "Free",
                price: "$0.00",
                nextBilling: "No billing",
                status: "free",
                isYearly: false,
              });
            } else {
              toast.error("Error fetching current plan");
              console.error("Current plan error:", currentPlanError);
            }
          }

          if (data) {
            setCurrentPlan({
              name: data.plan_type,
              price: `$${data.amount}`,
              nextBilling:
                data.status === "cancelled"
                  ? "Cancelled"
                  : new Date(data.next_billing_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    ),
              status: data.status,
              isYearly: data.billing_cycle === "yearly",
            });

            if (data.status === "active") {
              setPaymentMethod({
                type: "visa",
                lastFour: data.card_number.slice(-4),
                expires: data.expiry_date,
              });
            }
          }

          const { data: previousPlans, error: previousPlansError } =
            await supabase
              .from("subscription_history")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });

          if (previousPlansError) {
            toast.error("Error fetching previous plans");
            console.error("Previous plans error:", previousPlansError);
          }

          if (previousPlans && previousPlans.length > 0) {
            setBillingHistory(
              (previousPlans as planState[]).map((plan: planState) => ({
                id: plan.id,
                plan: plan.plan_type,
                date: new Date(plan.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                amount: `$${plan.amount}`,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
        setShowCancelSubscriptionModal(false);
      }
    };

    getCurrentPlan();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handlePlanChange = async () => {
    if (currentPlan.name === selectedPlan) {
      toast.warning("Already on this plan");
      setChangePlanModal(false);
      return;
    }

    try {
      setIsUpdatingPlan(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        toast.warning("Unable to get user information");
        return;
      }

      const { data: currentPlanData, error: currentPlanError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (currentPlanError) {
        toast.error("Error fetching current plan");
        return;
      }

      // Remove the id field to avoid duplicate key constraint
      const { id, ...planDataWithoutId } = currentPlanData;

      const previousPlan = {
        ...planDataWithoutId,
        status: "canceled",
        end_date: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("subscription_history")
        .insert([previousPlan]);

      if (error) {
        toast.error(`Error saving previous plan: ${error.message}`);
        return;
      }

      const planPrice =
        selectedPlan === "free" ? 0 : selectedPlan === "premium" ? 9.99 : 19.99;

      const updateData = {
        plan_type: selectedPlan,
        billing_cycle: selectedPlan === "free" ? "monthly" : "yearly",
        status: "active",
        updated_at: new Date().toISOString(),
        amount: planPrice,
        next_billing_date: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString(),
      };

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("user_id", user.id);

      if (updateError) {
        toast.error(`Error updating plan: ${updateError.message}`);
        return;
      }

      // Fix: Update the currentPlan state with correct structure
      setCurrentPlan({
        name: selectedPlan,
        price: `$${planPrice}/month`,
        nextBilling: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "active",
        isYearly: selectedPlan !== "free",
      });

      toast.success("Plan changed successfully");
      setChangePlanModal(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        toast.error("Error getting user information");
        return;
      }
      const { data: currentPlan, error: currentPlanError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (currentPlanError) {
        toast.error("Error fetching current plan");
        return;
      }

      const updateData = {
        card_number: `****${updatedPaymentMethod.lastFour.slice(-4)}`,
        expiry_date: updatedPaymentMethod.expires,
        cvc: updatedPaymentMethod.cvc,
        card_holder_name: updatedPaymentMethod.cardHolderName,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("user_id", user?.id);

      if (error) {
        toast.error("Error updating payment method");
        return;
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
      return;
    } finally {
      setIsUpdatingPayment(false);
      toast.success("Payment method updated successfully");
      setShowUpdatePaymentModal(false);
    }
  };

  return (
    <div className="space-y-8 flex w-full flex-col">
      {showCancelSubscriptionModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Cancel Subscription
                </h2>
                <p className="text-gray-600">
                  You'll lose access to these features:
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  {currentPlan.name === "free" &&
                    [
                      "Access to 1,000+ free books",
                      "Basic reading features",
                      "Mobile app access",
                      "Community discussions",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <p className="text-sm text-gray-700">{item}</p>
                      </div>
                    ))}

                  {currentPlan.name === "pro" &&
                    [
                      "Everything in Free",
                      "Unlimited book library access",
                      "Offline reading",
                      "Priority support",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <p className="text-sm text-gray-700">{item}</p>
                      </div>
                    ))}

                  {currentPlan.name === "ultimate" &&
                    [
                      "Everything in Pro",
                      "Exclusive early access to new books",
                      "Audiobook support",
                      "Family sharing (up to 5 members)",
                      "Premium community features",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <p className="text-sm text-gray-700">{item}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Your subscription will remain active
                  until {currentPlan.nextBilling}. After that, you'll be moved
                  to the free plan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowCancelSubscriptionModal(false)}
                  disabled={isCanceling}
                >
                  Keep Subscription
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {changePlanModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Change Your Plan
              </h2>
              <button
                onClick={() => setChangePlanModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                <div
                  onClick={() => setSelectedPlan("free")}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="plan"
                    value="free"
                    checked={selectedPlan === "free"}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Plan</h3>
                    <p className="text-sm text-gray-500">
                      Basic features, limited access
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">$0/month</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-purple-200 bg-purple-50 rounded-lg hover:border-purple-300 transition-colors cursor-pointer relative">
                <div
                  onClick={() => setSelectedPlan("premium")}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="plan"
                    value="premium"
                    checked={selectedPlan === "premium"}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        Premium Plan
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          currentPlan.name === "premium" && currentPlan.status === "active"
                            ? "bg-purple-600"
                            : "bg-green-600"
                        } text-white`}
                      >
                        {currentPlan.name === "premium" && currentPlan.status === "active"
                          ? "Current"
                          : "Favorite"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      50,000+ books, ad-free, offline downloads
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    $9.99/month
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-yellow-300 bg-yellow-50 rounded-lg hover:border-yellow-400 transition-colors cursor-pointer relative">
                <div
                  onClick={() => setSelectedPlan("ultimate")}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="radio"
                    name="plan"
                    value="ultimate"
                    checked={selectedPlan === "ultimate"}
                    className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        Ultimate Plan
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          currentPlan.name === "ultimate" && currentPlan.status === "active"
                            ? "bg-purple-600"
                            : "bg-yellow-600"
                        } text-white`}
                      >
                        {currentPlan.name === "ultimate" && currentPlan.status === "active"
                          ? "Current"
                          : "Popular"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 max-w-xs">
                      <span className=" text-gray-600 px-1 rounded text-xs">
                        Everything + unlimited audiobooks, family sharing
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">
                    $19.99/month
                  </span>
                  <p className="text-xs text-gray-500">
                    Save with yearly billing
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setChangePlanModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePlanChange}
                disabled={isUpdatingPlan}
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {selectedPlan === currentPlan.name && currentPlan.status === "active"
                  ? "Keep Current Plan"
                  : "Change Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdatePaymentMethodModal && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">
                  Update Payment Method
                </h2>
              </div>
              <button
                onClick={() => setShowUpdatePaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={updatedPaymentMethod.lastFour}
                  onChange={(e) => {
                    // Remove all non-digit characters
                    let value = e.target.value.replace(/\D/g, "");

                    // Limit to 16 digits
                    if (value.length > 16) {
                      value = value.slice(0, 16);
                    }

                    // Add spaces every 4 digits
                    value = value.replace(/(.{4})/g, "$1 ").trim();

                    setUpdatedPaymentMethod({
                      ...updatedPaymentMethod,
                      lastFour: value,
                    });
                  }}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    updatedPaymentMethod.lastFour.replace(/\s/g, "").length >
                      0 &&
                    updatedPaymentMethod.lastFour.replace(/\s/g, "").length < 16
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  maxLength={19} // 16 digits + 3 spaces
                />
                {updatedPaymentMethod.lastFour.replace(/\s/g, "").length > 0 &&
                  updatedPaymentMethod.lastFour.replace(/\s/g, "").length <
                    16 && (
                    <p className="mt-1 text-sm text-red-600">
                      Card number must be 16 digits
                    </p>
                  )}
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={updatedPaymentMethod.expires}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

                      // Limit to 4 digits (MMYY)
                      if (value.length > 4) {
                        value = value.slice(0, 4);
                      }

                      // Add slash after MM
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2);
                      }

                      setUpdatedPaymentMethod({
                        ...updatedPaymentMethod,
                        expires: value,
                      });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      updatedPaymentMethod.expires.length > 0 &&
                      updatedPaymentMethod.expires.length < 5
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    maxLength={5} // MM/YY format
                  />
                  {updatedPaymentMethod.expires.length > 0 &&
                    updatedPaymentMethod.expires.length < 5 && (
                      <p className="mt-1 text-sm text-red-600">
                        Enter valid expiry date (MM/YY)
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={updatedPaymentMethod.cvc}
                    onChange={(e) => {
                      // Only allow digits and limit to 3 characters
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 3);
                      setUpdatedPaymentMethod({
                        ...updatedPaymentMethod,
                        cvc: value,
                      });
                    }}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                      updatedPaymentMethod.cvc.length > 0 &&
                      updatedPaymentMethod.cvc.length < 3
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    maxLength={3}
                  />
                  {updatedPaymentMethod.cvc.length > 0 &&
                    updatedPaymentMethod.cvc.length < 3 && (
                      <p className="mt-1 text-sm text-red-600">
                        CVC must be 3 digits
                      </p>
                    )}
                </div>
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="babar ali"
                  value={updatedPaymentMethod.cardHolderName}
                  onChange={(e) =>
                    setUpdatedPaymentMethod({
                      ...updatedPaymentMethod,
                      cardHolderName: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    updatedPaymentMethod.cardHolderName.trim() === ""
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {updatedPaymentMethod.cardHolderName.trim() === "" &&
                  updatedPaymentMethod.cardHolderName.length === 0 && (
                    <p className="mt-1 text-sm text-red-600 hidden">
                      Cardholder name is required
                    </p>
                  )}
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowUpdatePaymentModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                disabled={isUpdatingPayment}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePaymentMethod}
                disabled={
                  isUpdatingPayment ||
                  updatedPaymentMethod.lastFour.replace(/\s/g, "").length !==
                    16 ||
                  updatedPaymentMethod.expires.length !== 5 ||
                  updatedPaymentMethod.cvc.length !== 3 ||
                  updatedPaymentMethod.cardHolderName.trim() === ""
                }
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUpdatingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Payment Method"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Billing</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-gray-900">
                {currentPlan.name}
              </h4>
              <span
                className={`${
                  currentPlan.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-300 text-red-600"
                }  text-xs font-medium px-2.5 py-0.5 rounded-full`}
              >
                {currentPlan.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              {currentPlan.price.slice(0, 7)}/
              {currentPlan.isYearly ? "Yearly" : "Monthly"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Next billing date: {currentPlan.nextBilling}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setChangePlanModal(true)}
            disabled={isUpdatingPlan}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUpdatingPlan ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Plan"
            )}
          </button>
          <button
            onClick={() => {
              if(currentPlan.status==="canceled"){
                toast.warning("plan Already Canceled")
                return 
              }else{
                setShowCancelSubscriptionModal(true);
              }
            }}
            disabled={isCanceling}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isCanceling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                •••• •••• •••• {paymentMethod.lastFour}
              </p>
              <p className="text-sm text-gray-500">
                Expires {paymentMethod.expires}
              </p>
            </div>
          </div>
          <button
            disabled={isUpdatingPayment}
            onClick={() => setShowUpdatePaymentModal(true)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isUpdatingPayment ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
          <Plus size={16} />
          Add Payment Method
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Billing History
        </h3>

        <div className="space-y-4">
          {billingHistory.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{invoice.plan}</p>
                <p className="text-sm text-gray-500">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">
                  {invoice.amount}
                </span>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {billingHistory.length === 0 && (
          <div className="text-center py-8">
            <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No billing history available</p>
          </div>
        )}
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCard className="text-blue-500 mt-0.5" size={16} />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              Billing Information
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Your subscription will automatically renew on the next billing
              date. You can change or cancel your plan at any time. Invoices are
              sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
