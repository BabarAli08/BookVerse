import { useNavigate } from "react-router";
import Bottom from "./Bottom";
import Featured from "./Featured";
import Hero from "./Hero";
import JoinSection from "./JoinSection";
import { useEffect } from "react";
import supabase from "../../supabase-client";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const getSubscription = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) return;

      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user?.id)
          .single();

      if (subscriptionError) {
        return;
      }

      const { data: user_preferances, error: user_preferances_error } =
        await supabase
          .from("user_preferances")
          .select("*")
          .eq("user_id", user?.id)
          .single();

      if (user_preferances_error) {
        
        return;
      }

      const currentDate = new Date();
      const nextBillingDate = new Date(subscriptionData.next_billing_date);

      if (
        currentDate > nextBillingDate &&
        subscriptionData.status === "active"
      ) {
        if (user_preferances.auto_renewal === false) {
          try {
            const { error: historyError } = await supabase
              .from("subscriptions_history")
              .insert([
                {
                  ...subscriptionData,
                  ended_at: currentDate.toISOString(),
                  reason: "expired_no_renewal",
                },
              ]);

            if (historyError) {
              console.error(
                "Error adding to subscription history:",
                historyError
              );
            }

            const { error: updateError } = await supabase
              .from("subscriptions")
              .update({
                status: "expired",
                expired_at: currentDate.toISOString(),
                updated_at: currentDate.toISOString(),
              })
              .eq("user_id", user?.id);

            if (updateError) {
              console.error("Error updating subscription status:", updateError);
              toast.error("Failed to update subscription status");
              return;
            }

            toast.info(
              "Your subscription has expired. Please renew to continue using our services."
            );
          } catch (error) {
            console.error("Unexpected error updating subscription:", error);
            toast.error("An unexpected error occurred");
          }
        } else if (user_preferances.auto_renewal === true) {
          try {
            const { error: historyError } = await supabase
              .from("subscriptions_history")
              .insert([
                {
                  ...subscriptionData,
                  ended_at: currentDate.toISOString(),
                  reason: "auto_renewed",
                },
              ]);

            if (historyError) {
              console.error(
                "Error adding to subscription history:",
                historyError
              );
            }

            const newNextBillingDate = new Date(nextBillingDate);

            if (
              subscriptionData.plan.includes("monthly") ||
              subscriptionData.billing_cycle === "monthly"
            ) {
              newNextBillingDate.setMonth(newNextBillingDate.getMonth() + 1);
            } else if (
              subscriptionData.plan.includes("yearly") ||
              subscriptionData.billing_cycle === "yearly"
            ) {
              newNextBillingDate.setFullYear(
                newNextBillingDate.getFullYear() + 1
              );
            } else {
              newNextBillingDate.setMonth(newNextBillingDate.getMonth() + 1);
            }

            const { error: renewalError } = await supabase
              .from("subscriptions")
              .update({
                next_billing_date: newNextBillingDate
                  .toISOString()
                  .split("T")[0], 
                last_payment_date: currentDate.toISOString(),
                updated_at: currentDate.toISOString(),
                status: "active", 
              })
              .eq("user_id", user?.id);

            if (renewalError) {
              console.error("Error renewing subscription:", renewalError);
              toast.error("Failed to renew subscription automatically");
              return;
            }

            const { error: billingError } = await supabase
              .from("billing_history")
              .insert([
                {
                  user_id: user?.id,
                  plan: subscriptionData.plan,
                  amount: subscriptionData.price, 
                  date: currentDate.toISOString(),
                  type: "auto_renewal",
                  status: "completed",
                },
              ]);

            if (billingError) {
              console.error("Error adding to billing history:", billingError);
            }

            toast.success(
              `Your ${
                subscriptionData.plan
              } subscription has been automatically renewed until ${newNextBillingDate.toLocaleDateString()}`
            );
          } catch (error) {
            console.error("Unexpected error during auto-renewal:", error);
            toast.error("Auto-renewal failed. Please renew manually.");

            await supabase
              .from("subscriptions")
              .update({
                status: "payment_failed", 
                expired_at: currentDate.toISOString(),
                updated_at: currentDate.toISOString(),
              })
              .eq("user_id", user?.id);
          }
        }
      } else if (
        currentDate > nextBillingDate &&
        subscriptionData.status === "expired"
      ) {
        
        toast.info("Your subscription has expired. Please renew to continue.");
      } else if (subscriptionData.status === "active") {
        
        const daysUntilExpiry = Math.ceil(
          (nextBillingDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        console.log(`Subscription expires in ${daysUntilExpiry} days`);

        if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
          if (user_preferances.auto_renewal) {
            toast.info(
              `Your subscription will auto-renew in ${daysUntilExpiry} day(s).`
            );
          } else {
            toast.warning(
              `Your subscription expires in ${daysUntilExpiry} day(s). Consider renewing soon.`
            );
          }
        }
      }
    };

    getSubscription();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Hero />
      <Bottom />
      <Featured />
      <div className="w-full h-40  flex items-center justify-center">
        <button
          onClick={() => navigate("/books")}
          className=" px-5 py-2 rounded-md border  border-gray-500 bg-gray-50 hover:bg-gray-200"
        >
          View All Books
        </button>
      </div>
      <JoinSection />
    </div>
  );
};

export default Home;
