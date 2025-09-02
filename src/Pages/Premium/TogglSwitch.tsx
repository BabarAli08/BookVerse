import { useDispatch, useSelector } from "react-redux";
import { toggleYearly } from "../../Store/PricesSlices";
import type { RootState } from "../../Store/store";
import { motion, AnimatePresence } from "framer-motion";

const ToggleSwitch = () => {
  const isYearly = useSelector((state: RootState) => state.prices.Yearly);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleYearly(!isYearly));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const switchContainerVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const labelVariants = {
    active: {
      scale: 1.05,
      fontWeight: 600,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
    inactive: {
      scale: 1,
      fontWeight: 500,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
  };

  const switchVariants = {
    monthly: {
      backgroundColor: "#d1d5db",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    yearly: {
      backgroundColor: "#1f2937",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const switchThumbVariants = {
    monthly: {
      x: 4,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    yearly: {
      x: 24,
      scale: 1.1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const badgeVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 400,
        delay: 0.1,
      },
    },
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        repeat: isYearly ? Infinity : 0,
        repeatDelay: 2,
      },
    },
  };

  return (
    <motion.div
      className="flex w-full items-center justify-center p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex bg-gray-50 rounded-full justify-center px-4 h-[7vh] shadow-md items-center gap-4 relative overflow-hidden"
        variants={switchContainerVariants}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100 rounded-full"
          animate={{
            opacity: isYearly ? 0.3 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Monthly Label */}
        <motion.span
          className={`text-sm font-medium transition-colors duration-200 cursor-pointer select-none relative z-10 ${
            !isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}
          onClick={handleToggle}
          variants={labelVariants}
          animate={!isYearly ? "active" : "inactive"}
          whileHover={{
            scale: 1.1,
            color: !isYearly ? "#1f2937" : "#6b7280",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Monthly
        </motion.span>

        {/* Toggle Switch */}
        <motion.button
          onClick={handleToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
          variants={switchVariants}
          animate={isYearly ? "yearly" : "monthly"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Switch background glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isYearly
                ? "0 0 20px rgba(34, 197, 94, 0.3)"
                : "0 0 10px rgba(156, 163, 175, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Switch Thumb */}
          <motion.span
            className="inline-block h-4 w-4 rounded-full bg-white shadow-sm relative z-10"
            variants={switchThumbVariants}
            animate={isYearly ? "yearly" : "monthly"}
          >
            {/* Thumb glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-white"
              animate={{
                boxShadow: isYearly
                  ? "0 0 10px rgba(34, 197, 94, 0.4)"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.span>
        </motion.button>

        {/* Yearly Label */}
        <motion.span
          className={`text-sm font-medium transition-colors duration-200 cursor-pointer select-none relative z-10 ${
            isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}
          onClick={handleToggle}
          variants={labelVariants}
          animate={isYearly ? "active" : "inactive"}
          whileHover={{
            scale: 1.1,
            color: isYearly ? "#1f2937" : "#6b7280",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Yearly
        </motion.span>

        {/* Save 20% Badge */}
        <AnimatePresence mode="wait">
          {isYearly && (
            <motion.div
              className="ml-2 px-2 py-1 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 relative overflow-hidden"
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#dcfce7",
              }}
            >
              {/* Badge sparkle effects */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${10 + i * 30}%`,
                  }}
                  variants={sparkleVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.2 }}
                />
              ))}

              <motion.p
                className="text-xs font-medium text-green-700 whitespace-nowrap relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Save 20%
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success celebration particles */}
        <AnimatePresence>
          {isYearly && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: -30,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ToggleSwitch;