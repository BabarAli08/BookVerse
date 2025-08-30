import { useState } from "react";
import { CreditCard, Crown, Plus, Loader2, Download } from "lucide-react";
import supabase from "../../supabase-client";
import { toast } from "sonner";
import { setBoughtPremium } from "../../Store/PremiumBookSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, stagger } from "framer-motion";
import LoadingSkeleton from "./LoadingSkeleton";
import type { RootState } from "../../Store/store";
import { 
  updateCurrentPlan, 
  updatePaymentMethod, 
  updateBillingHistory, 
  updateAutoRenewal, 
  updateBillingNotifications 
} from "../../Store/UserSettingsSlice";
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
  
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState<boolean>(false);
  
  const { reading } = useSelector((state: RootState) => state.userSettings);
  const dispatch = useDispatch();
  
  const currentPlan = {
    name: reading?.billing?.currentPlan?.name || "free",
    price: `$${reading?.billing?.currentPlan?.price || 0}/${reading?.billing?.currentPlan?.billingCycle || "monthly"}`,
    nextBilling: reading?.billing?.currentPlan?.nextBillingDate || "N/A",
    status: reading?.billing?.currentPlan?.status || "active",
    nextBillingDate: reading?.billing?.currentPlan?.nextBillingDate || "N/A",
    billingCycle: reading?.billing?.currentPlan?.billingCycle || "monthly",
    isYearly: reading?.billing?.currentPlan?.billingCycle === "yearly"
  };
  
  const paymentMethod = {
    type: reading?.billing?.paymentMethod?.type || "visa",
    lastFour: reading?.billing?.paymentMethod?.cardNumber?.slice(-4) || "0000",
    expires: reading?.billing?.paymentMethod?.expiryDate || "N/A",
  };
  
  const billingHistory = reading?.billing?.billingHistory?.map(item => ({
    
    plan: item.name,
    date: item.endDate,
    amount: item.price,
  })) || [];
  
  const autoRenewal = reading?.billing?.subscriptionManagement?.autoRenewal ?? true;
  const billingNotifications = reading?.billing?.subscriptionManagement?.billingNotifications ?? false;
  
  const [changePlanModal, setChangePlanModal] = useState<boolean>(false);

  const allPlans = [
    {
      id: "free",
      title: "Free Plan",
      desc: "Basic features, limited access",
      price: "$0/month",
      border: "border-gray-200",
      accent: "text-blue-600",
    },
    {
      id: "premium",
      title: "Premium Plan",
      desc: "50,000+ books, ad-free, offline downloads",
      price: "$9.99/month",
      border: "border-purple-200 bg-purple-50",
      accent: "text-purple-600",
      badge:
        currentPlan.name === "premium" && currentPlan.status === "active"
          ? "Current"
          : "Favorite",
      badgeColor:
        currentPlan.name === "premium" && currentPlan.status === "active"
          ? "bg-purple-600"
          : "bg-green-600",
    },
    {
      id: "ultimate",
      title: "Ultimate Plan",
      desc: "Everything + unlimited audiobooks, family sharing",
      price: "$19.99/month",
      border: "border-yellow-300 bg-yellow-50",
      accent: "text-yellow-600",
      badge:
        currentPlan.name === "ultimate" && currentPlan.status === "active"
          ? "Current"
          : "Popular",
      badgeColor:
        currentPlan.name === "ultimate" && currentPlan.status === "active"
          ? "bg-purple-600"
          : "bg-yellow-600",
      extra: "Save with yearly billing",
    },
  ];

  const [updatedPaymentMethod, setUpdatedPaymentMethod] = useState({
    type: "visa",
    lastFour: "",
    expires: "",
    cvc: "",
    cardHolderName: "",
  });

  const [showUpdatePaymentMethodModal, setShowUpdatePaymentMethodModal] =
    useState<boolean>(false);

  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan.name);

  const toggleAutoRenewal = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Error getting user information");
        return;
      }

      const newValue = !autoRenewal;

      const { data: existingPrefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        auto_renewal: newValue,
        billing_notifications: existingPrefs?.billing_notifications ?? true,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to update auto-renewal setting: " + error.message);
        return;
      }

      dispatch(updateAutoRenewal(newValue));
      toast.success(`Auto-renewal ${newValue ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error toggling auto-renewal:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const toggleBillingNotifications = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Error getting user information");
        return;
      }

      const newValue = !billingNotifications;

      const { data: existingPrefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        billing_notifications: newValue,
        auto_renewal: existingPrefs?.auto_renewal ?? true,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to update notification settings: " + error.message);
        return;
      }

      dispatch(updateBillingNotifications(newValue));
      toast.success(
        `Billing notifications ${newValue ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error toggling billing notifications:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const checkPremiumStatus = (planName: string, status: string) => {
    return status === "active" && planName !== "free";
  };

  const handleCancelSubscription = async () => {
    if (currentPlan.status === "canceled") {
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
          .maybeSingle();

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

      dispatch(updateCurrentPlan({
        ...reading.billing.currentPlan,
        status: "canceled"
      }));

      const newHistoryItem = {
        name: reading.billing.currentPlan.name,
        endDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        price: `$${reading.billing.currentPlan.price}`,
      };
      
      const updatedHistory = [newHistoryItem, ...reading.billing.billingHistory];
      dispatch(updateBillingHistory(updatedHistory));

      dispatch(setBoughtPremium(false));

      toast.success("Subscription cancelled successfully");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unable to cancel subscription, please try again");
    } finally {
      setIsCanceling(false);
      setShowCancelSubscriptionModal(false);
    }
  };



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
        .maybeSingle();

      if (currentPlanError) {
        toast.error("Error fetching current plan");
        return;
      }

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
        billing_cycle: "monthly",
        status: "active",
        updated_at: new Date().toISOString(),
        amount: planPrice,
        next_billing_date: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString(),
      };

      const plan = checkPremiumStatus(selectedPlan, "active");
      dispatch(setBoughtPremium(plan));

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("user_id", user.id);

      if (updateError) {
        toast.error(`Error updating plan: ${updateError.message}`);
        return;
      }

      const nextBillingDate = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      dispatch(updateCurrentPlan({
        id: reading.billing.currentPlan.id,
        name: selectedPlan,
        price: planPrice,
        billingCycle: "monthly",
        nextBillingDate: nextBillingDate,
        status: "active"
      }));

      if (reading.billing.currentPlan.name !== "free") {
        const previousPlanHistoryItem = {
          name: reading.billing.currentPlan.name,
          endDate: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          price: `$${reading.billing.currentPlan.price}`,
        };
        
        const updatedHistory = [previousPlanHistoryItem, ...reading.billing.billingHistory];
        dispatch(updateBillingHistory(updatedHistory));
      }

      if (selectedPlan !== "free") {
        const newPlanHistoryItem = {
          name: selectedPlan,
          endDate: nextBillingDate,
          price: `$${planPrice}`,
        };
        
        const currentHistory = reading.billing.billingHistory;
        const updatedHistoryWithNew = [newPlanHistoryItem, ...currentHistory];
        dispatch(updateBillingHistory(updatedHistoryWithNew));
      }

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
      const { error: currentPlanError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

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
      const { error } = await supabase
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
      setShowUpdatePaymentMethodModal(false);
    }
  };

  const backdropVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants: any = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 200 },
    },
    exit: { opacity: 0, scale: 0.9, y: 30 },
  };

  const childrenStagger: any = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
    }),
  };

  const containerVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 flex w-full flex-col">
      {showCancelSubscriptionModal && (
        <AnimatePresence>
          <motion.div
            key="cancel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              key="cancel-modal"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <Crown className="w-6 h-6 text-red-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Cancel Subscription
                  </h2>
                  <p className="text-gray-600">
                    You'll lose access to these features:
                  </p>
                </div>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
                  className="bg-gray-50 rounded-lg p-4 mb-6"
                >
                  {[
                    "Access to 1,000+ free books",
                    "Basic reading features",
                    "Mobile app access",
                    "Community discussions",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">{item}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCancelSubscriptionModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isCanceling}
                  >
                    Keep Subscription
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelSubscription}
                    disabled={isCanceling}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    {isCanceling ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Canceling...
                      </>
                    ) : (
                      "Cancel Subscription"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      {changePlanModal && (
        <AnimatePresence>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Change Your Plan
                </h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setChangePlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                </motion.button>
              </div>

              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
                }}
                className="p-6 space-y-3"
              >
                {allPlans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${plan.border}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={selectedPlan === plan.id}
                        readOnly
                        className={`w-4 h-4 ${plan.accent} border-gray-300 focus:ring-2`}
                        whileTap={{ scale: 1.3 }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {plan.title}
                          </h3>
                          {plan.badge && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium text-white ${plan.badgeColor}`}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{plan.desc}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.extra && (
                        <p className="text-xs text-gray-500">{plan.extra}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setChangePlanModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlanChange}
                  disabled={isUpdatingPlan}
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors disabled:opacity-70"
                >
                  {selectedPlan === currentPlan.name &&
                  currentPlan.status === "active"
                    ? "Keep Current Plan"
                    : "Change Plan"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {showUpdatePaymentMethodModal && (
        <AnimatePresence>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  <motion.h2
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-xl font-bold text-gray-900"
                  >
                    Update Payment Method
                  </motion.h2>
                </motion.div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setShowUpdatePaymentMethodModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                {[
                  {
                    id: "card",
                    label: "Card Number",
                    placeholder: "1234 5678 9012 3456",
                  },
                  { id: "expiry", label: "Expiry Date", placeholder: "MM/YY" },
                  { id: "cvc", label: "CVC", placeholder: "123" },
                  {
                    id: "name",
                    label: "Cardholder Name",
                    placeholder: "John Doe",
                  },
                ].map((field, i) => (
                  <motion.div
                    key={field.id}
                    custom={i}
                    variants={childrenStagger}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ))}

                <motion.div
                  custom={4}
                  variants={childrenStagger}
                  initial="hidden"
                  animate="visible"
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
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
                </motion.div>
              </div>

              <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUpdatePaymentMethodModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdatePaymentMethod}
                  disabled={isUpdatingPayment}
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {isUpdatingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Payment Method"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CreditCard className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Billing</h2>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="flex items-center gap-3 mb-4"
          variants={itemVariants}
        >
          <Crown className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </motion.div>

        <motion.div
          className="flex items-center justify-between mb-4"
          variants={itemVariants}
        >
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-gray-900">
                {currentPlan.name}
              </h4>

              <motion.span
                key={currentPlan.status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`${
                  currentPlan.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-300 text-red-600"
                } text-xs font-medium px-2.5 py-0.5 rounded-full`}
              >
                {currentPlan.status}
              </motion.span>
            </div>
            <p className="text-gray-600 mt-1">
              {currentPlan.price}
            </p>
            <motion.p
              className="text-sm text-gray-500 mt-2"
              variants={itemVariants}
            >
              Next billing date: {currentPlan.nextBillingDate}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentPlan.status === "canceled") {
                toast.warning("Plan Already Canceled");
                return;
              } else {
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
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="flex items-center gap-3 mb-4"
          variants={itemVariants}
        >
          <CreditCard className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h3>
        </motion.div>

        <motion.div
          className="flex items-center justify-between mb-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <span className="text-white text-xs font-bold">VISA</span>
            </motion.div>

            <div>
              <p className="font-medium text-gray-900">
                •••• •••• •••• {paymentMethod.lastFour}
              </p>
              <p className="text-sm text-gray-500">
                Expires {paymentMethod.expires}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUpdatingPayment}
            onClick={() => setShowUpdatePaymentMethodModal(true)}
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
          </motion.button>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          variants={itemVariants}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          <Plus size={16} />
          Add Payment Method
        </motion.button>
      </motion.div>

      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h3
          className="text-lg font-semibold text-gray-900 mb-4"
          variants={itemVariants}
        >
          Billing History
        </motion.h3>

        <motion.div className="space-y-4" variants={itemVariants}>
          {billingHistory.length > 0 ? (
            <div
              className={`border border-gray-100 rounded-lg ${
                billingHistory.length > 3 ? "max-h-48 overflow-y-auto" : ""
              }`}
            >
              <div className="space-y-0">
                {billingHistory.map((invoice, index) => (
                  <motion.div
                    key={Date.now()+index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className={`flex items-center justify-between py-3 px-4 cursor-default ${
                      index !== billingHistory.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {invoice.plan} Plan
                      </p>
                      <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">
                        {invoice.amount}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Download size={14} />
                        Download
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No billing history available</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="bg-white border border-gray-200 rounded-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h3
          className="text-lg font-semibold text-gray-900 mb-6"
          variants={itemVariants}
        >
          Subscription Management
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          <motion.div
            className="p-4 border border-gray-200 rounded-lg"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Auto-Renewal</h4>
              <motion.button
                onClick={toggleAutoRenewal}
                whileTap={{ scale: 0.9 }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  autoRenewal ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    autoRenewal ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>
            <p className="text-sm text-gray-600">
              {autoRenewal
                ? `Your subscription will automatically renew on ${currentPlan.nextBilling}`
                : "Your subscription will not automatically renew"}
            </p>
          </motion.div>

          <motion.div
            className="p-4 border border-gray-200 rounded-lg"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                Billing Notifications
              </h4>
              <motion.button
                onClick={toggleBillingNotifications}
                whileTap={{ scale: 0.9 }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  billingNotifications ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    billingNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </motion.button>
            </div>
            <p className="text-sm text-gray-600">
              {billingNotifications
                ? "Get notified 3 days before your next billing date"
                : "You will not receive billing notifications"}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          variants={itemVariants}
        >
          <h4 className="font-medium text-yellow-800 mb-2">Need Help?</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Having issues with billing or need to make changes? Our support team
            is here to help.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-blue-50 rounded-lg p-4 mt-4"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
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
      </motion.div>
    </div>
  );
}
