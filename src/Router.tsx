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
import Checkout from "./Pages/CheckOut/Checkout";
import PaymentSuccess from "./Pages/CheckOut/PaymentSuccess";
import {
  updateAutoBookmark,
  updateAutoRenewal,
  updateBackgroundPattern,
  updateBillingHistory,
  updateCurrentPlan,
  updateOfflineDownloads,
  updatePaymentMethod,
  updateProfile,
  updateReadingTheme,
  updateTypographySettings,
} from "./Store/UserSettingsSlice";
import { useDispatch } from "react-redux";

const AppRouter = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getUser();
  }, []);
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
          .maybeSingle();

      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        console.error("Error fetching subscription data:", subscriptionError);
        return;
      }

      // If no subscription data exists, user doesn't have an active subscription
      if (!subscriptionData) {
        console.log("No subscription found for user");
        return;
      }

      console.log("subscription Data is ", subscriptionData);
      const { data: user_preferances, error: user_preferances_error } =
        await supabase
          .from("user_preferances")
          .select("*")
          .eq("user_id", user?.id)
          .maybeSingle();

      if (
        user_preferances_error &&
        user_preferances_error.code !== "PGRST116"
      ) {
        console.error(
          "Error fetching user preferences:",
          user_preferances_error
        );
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
        .maybeSingle();

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
          .maybeSingle();
      if (readingPreferancesError) return;

      if (readingPreferances) {
        // Define the complete option arrays (same as in ReadingPreferences component)
        const themeOptions = [
          { id: "light", name: "Light", bg: "bg-white", text: "text-gray-900" },
          {
            id: "sepia",
            name: "Sepia",
            bg: "bg-amber-50",
            text: "text-amber-900",
          },
          { id: "dark", name: "Dark", bg: "bg-slate-800", text: "text-white" },
          {
            id: "forest",
            name: "Forest",
            bg: "bg-green-50",
            text: "text-green-800",
          },
          {
            id: "ocean",
            name: "Ocean",
            bg: "bg-blue-50",
            text: "text-blue-800",
          },
          {
            id: "lavender",
            name: "Lavender",
            bg: "bg-purple-50",
            text: "text-purple-800",
          },
        ];

        const backgroundOptions = [
          { id: "none", name: "None", pattern: "", preview: "bg-transparent" },
          {
            id: "notebook-paper",
            name: "Notebook Paper",
            pattern:
              "repeating-linear-gradient(transparent, transparent 23px, #3b82f6 24px, #3b82f6 25px), linear-gradient(90deg, #ef4444 0px, #ef4444 1px, transparent 1px, transparent 80px)",
            preview: "bg-white",
          },
          {
            id: "graph-paper",
            name: "Graph Paper",
            pattern:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            preview: "bg-blue-50",
          },
          {
            id: "parchment",
            name: "Parchment",
            pattern:
              "radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(160, 82, 45, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(205, 133, 63, 0.04) 0%, transparent 50%)",
            preview: "bg-amber-100",
          },
          {
            id: "aged-paper",
            name: "Aged Paper",
            pattern:
              "radial-gradient(circle at 10% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 30%), radial-gradient(circle at 90% 20%, rgba(160, 82, 45, 0.08) 0%, transparent 40%), radial-gradient(circle at 30% 90%, rgba(205, 133, 63, 0.09) 0%, transparent 35%), radial-gradient(circle at 80% 80%, rgba(222, 184, 135, 0.06) 0%, transparent 45%)",
            preview: "bg-yellow-100",
          },
          {
            id: "watermark",
            name: "Watermark",
            pattern:
              "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)",
            preview: "bg-gray-50",
          },
          {
            id: "rice-paper",
            name: "Rice Paper",
            pattern:
              "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(circle at 6px 14px, rgba(0,0,0,0.06) 1px, transparent 1px), radial-gradient(circle at 14px 6px, rgba(0,0,0,0.07) 1px, transparent 1px)",
            preview: "bg-stone-50",
          },
          {
            id: "canvas",
            name: "Canvas",
            pattern:
              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
            preview: "bg-neutral-50",
          },
          {
            id: "linen",
            name: "Linen",
            pattern:
              "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px), repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            preview: "bg-slate-50",
          },
          {
            id: "fabric",
            name: "Fabric",
            pattern:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
            preview: "bg-gray-100",
          },
          {
            id: "vintage-dots",
            name: "Vintage Dots",
            pattern:
              "radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.15) 1px, transparent 1px), radial-gradient(circle at 12px 12px, rgba(160, 82, 45, 0.12) 1px, transparent 1px)",
            preview: "bg-amber-50",
          },
          {
            id: "crosshatch",
            name: "Crosshatch",
            pattern:
              "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 10px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 10px)",
            preview: "bg-slate-100",
          },
          {
            id: "manuscript",
            name: "Manuscript",
            pattern:
              "linear-gradient(90deg, rgba(139, 69, 19, 0.15) 0px, rgba(139, 69, 19, 0.15) 2px, transparent 2px, transparent 100%), repeating-linear-gradient(transparent, transparent 19px, rgba(139, 69, 19, 0.3) 20px, rgba(139, 69, 19, 0.3) 21px)",
            preview: "bg-orange-50",
          },
          {
            id: "stipple",
            name: "Stipple",
            pattern:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 0.5px, transparent 0.5px), radial-gradient(circle at 5px 3px, rgba(0,0,0,0.08) 0.5px, transparent 0.5px), radial-gradient(circle at 3px 7px, rgba(0,0,0,0.09) 0.5px, transparent 0.5px), radial-gradient(circle at 8px 6px, rgba(0,0,0,0.07) 0.5px, transparent 0.5px)",
            preview: "bg-stone-100",
          },
          {
            id: "zen-waves",
            name: "Zen Waves",
            pattern:
              "repeating-radial-gradient(ellipse at 50% 0%, transparent 0%, transparent 40%, rgba(0,0,0,0.04) 41%, rgba(0,0,0,0.04) 43%, transparent 44%)",
            preview: "bg-blue-50",
          },
          {
            id: "organic",
            name: "Organic",
            pattern:
              "radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(16, 185, 129, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, rgba(52, 211, 153, 0.04) 0%, transparent 40%)",
            preview: "bg-emerald-50",
          },
          {
            id: "minimalist-lines",
            name: "Minimalist Lines",
            pattern:
              "repeating-linear-gradient(180deg, transparent, transparent 40px, rgba(0,0,0,0.04) 40px, rgba(0,0,0,0.04) 42px)",
            preview: "bg-neutral-50",
          },
          {
            id: "dots",
            name: "Simple Dots",
            pattern:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
            preview: "bg-white",
          },
          {
            id: "diagonal-stripes",
            name: "Diagonal Stripes",
            pattern:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",
            preview: "bg-gray-50",
          },
        ];
        const theme =
          themeOptions.find((t) => t.id === readingPreferances.theme) ||
          themeOptions[0];
        const background =
          backgroundOptions.find(
            (b) => b.id === readingPreferances.background
          ) || backgroundOptions[0];

        const typoPreferances = {
          fontSize: readingPreferances.font_size || "Medium",
          fontFamily: readingPreferances.font_family || "Serif",
          lineSpacing: readingPreferances.line_spacing || "Normal",
        };

        dispatch(updateTypographySettings(typoPreferances));
        dispatch(updateReadingTheme(theme));
        dispatch(updateBackgroundPattern(background));
        dispatch(updateAutoBookmark(readingPreferances.auto_bookmark || true));
        dispatch(
          updateOfflineDownloads(readingPreferances.offline_downloads || true)
        );
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
      if (!user) return;
      const {
        data: subscriptionManagement,
        error: subscriptionManagementError,
      } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
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
    const getCurrentSubscription = async () => {
      if (!user) return;

      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user?.id)
          .maybeSingle();

      if (subscriptionError && subscriptionError.code !== "PGRST116") {
        console.error(
          "Error fetching current subscription:",
          subscriptionError
        );
        return;
      }

      if (!subscriptionData) {
        console.log("No current subscription found");
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
    };
    getCurrentSubscription();
    getSubscriptionManagement();
    getUserBillingHistory();
    getUserInfo();
    getUserReadingPreferances();
  }, [dispatch, user]);
  return (
    <>
      <Toaster richColors position="top-left" theme="dark" />
      <Router>
        {loading ? (
          <div
            style={{ display: "grid", placeItems: "center", height: "100vh" }}
          >
            <h2>Loading...</h2>
          </div>
        ) : !user ? (
          <Routes>
            <Route path="/signup" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<SignIn />} />
          </Routes>
        ) : !user.email_confirmed_at ? (
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
        ) : (
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
            <Route path="/signup" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/books/:id/read" element={<BookReader />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default AppRouter;
