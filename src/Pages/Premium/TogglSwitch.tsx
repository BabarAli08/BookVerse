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


  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const switchContainerVariants = {
    hidden: { scale: 0.95, opacity: 0 },
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
      scale: 1.02,
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

  const badgeVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      x: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 400,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: -10,
      transition: {
        duration: 0.2,
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
        className="flex bg-gray-50 rounded-full justify-center px-4 h-[7vh] shadow-md items-center gap-4 relative"
        variants={switchContainerVariants}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        }}
        style={{
          
          minWidth: isYearly ? '280px' : '200px',
        }}
        transition={{ 
          minWidth: { 
            duration: 0.3, 
            ease: "easeInOut" 
          } 
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 rounded-full opacity-0"
          animate={{
            opacity: isYearly ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.span
          className={`text-sm font-medium transition-colors duration-200 cursor-pointer select-none relative z-10 ${
            !isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}
          onClick={handleToggle}
          variants={labelVariants}
          animate={!isYearly ? "active" : "inactive"}
          whileHover={{
            scale: 1.05,
            color: !isYearly ? "#1f2937" : "#6b7280",
          }}
          whileTap={{ scale: 0.98 }}
        >
          Monthly
        </motion.span>

        <motion.button
          onClick={handleToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            backgroundColor: isYearly ? "#1f2937" : "#d1d5db",
          }}
          transition={{
            backgroundColor: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          {/* Switch background glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isYearly
                ? "0 0 15px rgba(34, 197, 94, 0.3)"
                : "0 0 8px rgba(156, 163, 175, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          />

          <motion.span
            className="inline-block h-4 w-4 rounded-full bg-white shadow-sm relative z-10"
            animate={{
              x: isYearly ? 24 : 4,
              scale: isYearly ? 1.1 : 1,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
          >
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

        <motion.span
          className={`text-sm font-medium transition-colors duration-200 cursor-pointer select-none relative z-10 ${
            isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}
          onClick={handleToggle}
          variants={labelVariants}
          animate={isYearly ? "active" : "inactive"}
          whileHover={{
            scale: 1.05,
            color: isYearly ? "#1f2937" : "#6b7280",
          }}
          whileTap={{ scale: 0.98 }}
        >
          Yearly
        </motion.span>

        <div className="relative" style={{ width: '80px' }}>
          <AnimatePresence mode="wait">
            {isYearly && (
              <motion.div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100"
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#dcfce7",
                }}
                style={{
                  // Prevent any layout shift
                  position: 'absolute',
                  whiteSpace: 'nowrap',
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-400 rounded-full"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${10 + i * 30}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                <motion.p
                  className="text-xs font-medium text-green-700 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Save 20%
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isYearly && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1.5 h-1.5 bg-green-400 rounded-full pointer-events-none"
                  style={{
                    top: `${30 + Math.random() * 40}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: -20,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
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