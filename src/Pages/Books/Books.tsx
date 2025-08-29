import FilterComponent from "./Filter";
import Header from "./Header";
import BookCarousel from "./BookCarousal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../Store/store";
import UpgradeToSee from "../../Component/UpgradeToSee";
import { useEffect, useRef } from "react";
import supabase from "../../supabase-client";
import { setBoughtPremium } from "../../Store/PremiumBookSlice";
import { motion, AnimatePresence } from "framer-motion";

const Books = () => {
  const { filters } = useSelector((state: RootState) => state.filteredBooks);
  const { clicked } = useSelector((state: RootState) => state.PremiumBookCLick);
  const dispatch = useDispatch();

  const hasCheckedSubscription = useRef(false);

  useEffect(() => {
    if (hasCheckedSubscription.current) return;

    const getUserSubscriptions = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) return;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching subscription:", error);
        return;
      }
      const value =
        data && data.status === "active" && data.plan_type !== "free";

      dispatch(setBoughtPremium(value));
      hasCheckedSubscription.current = true;
    };

    getUserSubscriptions();
  }, [dispatch]);

  const pageVariant:any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
  };

  const sectionVariant:any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const modalVariant:any = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <>
     
      <motion.div
        className="w-full min-h-screen bg-gray-50 flex flex-col relative z-0"
        variants={pageVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Header />

        <motion.div variants={sectionVariant} initial="hidden" animate="visible">
          <FilterComponent />
        </motion.div>


        {filters.tier === "Free" && (
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <BookCarousel
              title="Free Books"
              subtitle="Free Books"
              isPremium={false}
            />
          </motion.div>
        )}

        {filters.tier === "Premium" && (
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <BookCarousel
              title="Premium Books"
              subtitle="Subscription Required:"
              isPremium={true}
            />
          </motion.div>
        )}

        {filters.tier === "All" && (
          <>
            <motion.div
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <BookCarousel
                title="Free Books"
                subtitle="Free Books"
                isPremium={false}
              />
            </motion.div>

            <motion.div
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <BookCarousel
                title="Premium Books"
                subtitle="Subscription Required:"
                isPremium={true}
              />
            </motion.div>
          </>
        )}
      </motion.div>

     
      <AnimatePresence>
        {clicked && (
          <>
         
            <motion.div
              className="fixed inset-0 bg-gradient-to-b from-black/80 to-black/60 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="fixed inset-0 flex items-center justify-center z-20"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UpgradeToSee />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Books;
