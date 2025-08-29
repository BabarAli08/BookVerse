import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Component/Navbar/Layout";
import Home from "./Pages/Home/Home";
import Books from "./Pages/Books/Books";
import Premium from "./Pages/Premium/Premium";
import About from "./Pages/About/About";
import NotFound from "./Component/NotFound";
import BookDetails from "./Pages/BookDetails/BookDetails";
import { Toaster, toast } from "sonner";
import Profile from "./Pages/Profile/Profile";
import MyLibrary from "./Pages/My Library/MyLibrary";
import WishList from "./Pages/Wishlist/WishList";
import Settings from "./Pages/Settings/Settings";
import BookReader from "./Pages/BookReader/BookReader";
import SignIn from "./Pages/SignIn";
import supabase from "./supabase-client";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import SignUp from "./Pages/SignIn";
import Checkout from "./Pages/CheckOut/Checkout";
import PaymentSuccess from "./Pages/CheckOut/PaymentSuccess";
import { updateAutoRenewal, updateBackgroundPattern, updateBillingHistory, updateCurrentPlan, updatePaymentMethod, updateProfile, updateReadingTheme, updateTypographySettings } from "./Store/UserSettingsSlice";
import { useDispatch } from "react-redux";

const AppRouter = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();
 
  useEffect(()=>{
    const getUser=async()=>{
      const {data:{user},error}=await supabase.auth.getUser()
      if(user){
        setUser(user)
      }
    }
    getUser()
  },[])
  useEffect(() => {
    
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);


  

  useEffect(() => {
    const getSubscription = async () => {
      if (!user) return;

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

  useEffect(() => {
    const getUserInfo = async () => {
      if (!user) {
        console.log("no user found");
        return;
      }

      const { data: userDetails, error: userDetailsError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userDetailsError) {
        console.warn(
          "could not find the user details",
          userDetailsError.message
        );
      }

      if (userDetails) {
        const userDetail = {
          name: userDetails?.name || "",
          email: userDetails?.email || "",
          location: userDetails.location || "",
          website: userDetails.website || "",
          bio: userDetails.bio || "",
        };

        dispatch(updateProfile(userDetail));
      }
    };

    const getUserReadingPreferances = async () => {
      if (!user) return;
      const { data: readingPreferances, error: readingPreferancesError } =
        await supabase
          .from("reading_preferances")
          .select("*")
          .eq("user_id", user?.id)
          .single();
      if (readingPreferancesError) return;

      if (readingPreferances) {
        const theme = {
          name: readingPreferances.theme || "",
          id: "",
          bg: "",
          text: "",
        };
        const background = {
          name: readingPreferances.background || "",
          id: "",
          pattern: "",
          preview: "",
        };

        const typoPreferances = {
          fontSize: readingPreferances.font_size || "",
          fontFamily: readingPreferances.font_family || "",
          lineSpacing: readingPreferances.line_spacing || "",
        };
        dispatch(updateTypographySettings(typoPreferances));
        dispatch(updateReadingTheme(theme));
        dispatch(updateBackgroundPattern(background));
      }
    };

    const getUserBillingHistory = async () => {
      if (!user) return;

      const { data: billingHistory, error: billingHistoryError } =
        await supabase
          .from("subscription_history")
          .select("*")
          .eq("user_id", user?.id);
      if (billingHistoryError) {
        console.warn(
          "Could not find billing history",
          billingHistoryError.message
        );
        return;
      }
      if (billingHistory && billingHistory.length > 0) {
        const billings = billingHistory.map((historyItem: any) => ({
          name: historyItem.plan_type,
          endDate: historyItem.end_date,
          price: `$${historyItem.amount.toFixed(2)}`,
        }));
        dispatch(updateBillingHistory(billings));
      }
    };

    const getSubscriptionManagement = async () => {
      if(!user) return 
      const {
        data: subscriptionManagement,
        error: subscriptionManagementError,
      } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (subscriptionManagementError) {
        console.warn(
          "error getting the subscription management data",
          subscriptionManagementError.message
        );
      }
      if (subscriptionManagement) {
        dispatch(updateAutoRenewal(subscriptionManagement.auto_renewal));
        dispatch(updateBillingHistory(subscriptionManagement.billing_history));
      }
    };
    const getCurrentSubscription=async()=>{
      if (!user) return;

      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user?.id)
          .single();

      if (subscriptionError) {
        return;
      }
      const todaysDate = new Date();

      const subscription = {
        id: subscriptionData.plan_type,
        name: subscriptionData.plan_type,
        price: `$${subscriptionData.amount}`,
        nextBillingDate: subscriptionData.next_billing_date || "N/A",
        status:
          subscriptionData.next_billing_date > todaysDate
            ? "active"
            : "expired",
        billingCycle: subscriptionData.billing_cycle || "monthly",
      };
      const paymentMethod = {
        type: "visa",
        expiryDate: subscriptionData.expiry_date || "N/A",
        cardNumber: subscriptionData.card_number || "N/A",
        cvc: subscriptionData.cvc || null,
        cardHolderName: subscriptionData.card_holder_name || "N/A",
      };

      dispatch(updatePaymentMethod(paymentMethod));
      dispatch(updateCurrentPlan(subscription));
    }
    getCurrentSubscription()
    getSubscriptionManagement();
    getUserBillingHistory();
    getUserInfo();
    getUserReadingPreferances();
  }, [dispatch, user]);
  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  if (!user.email_confirmed_at) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          background: "white",
        }}
      >
        <div style={{ textAlign: "center", color: "#6A0DAD" }}>
          <h1>Please Verify Your Email</h1>
          <p>
            We've sent you a verification link. Please verify your email to
            access the site.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-left" theme="dark" />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/library" element={<MyLibrary />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<PaymentSuccess />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/books/:id/read" element={<BookReader />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
