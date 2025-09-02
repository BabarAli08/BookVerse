import { Crown } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const crownVariants = {
    hidden: { 
      y: -50, 
      opacity: 0,
      rotate: -10,
      scale: 0.5
    },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 1.2,
      },
    },
    hover: {
      rotate: [0, -5, 5, 0],
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const titleVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 80,
        duration: 0.8,
      },
    },
  };

  const descriptionVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const bookVariants = {
    hidden: { 
      scale: 0,
      rotate: 45,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <style>{`
        @keyframes slideAcross {
          0% {
            transform: translateX(-200px) translateY(0px) rotate(-15deg);
            opacity: 0;
          }
          20% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(calc(100vw + 200px)) translateY(-20px) rotate(15deg);
            opacity: 0;
          }
        }
        
        @keyframes slideAcrossReverse {
          0% {
            transform: translateX(calc(100vw + 200px)) translateY(0px) rotate(15deg);
            opacity: 0;
          }
          20% {
            opacity: 0.2;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(-200px) translateY(-30px) rotate(-15deg);
            opacity: 0;
          }
        }
        
        .animate-slide {
          animation: slideAcross 12s linear infinite;
        }
        
        .animate-slide-reverse {
          animation: slideAcrossReverse 15s linear infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <motion.div 
        ref={ref}
        className="w-full sm:h-[50vh] md:h-[60vh] pt-2 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 relative flex items-center justify-center overflow-hidden"
        initial="hidden"
        animate={mainControls}
        variants={containerVariants}
      >
        {/* Animated background gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-indigo-900/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* Floating books */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`book-lr-${i}`}
              className="absolute animate-slide"
              style={{
                top: `${20 + i * 25}%`,
                left: "-200px", 
                animationDelay: `${i * 4}s`,
              }}
              variants={bookVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.3 }}
            >
              <motion.div 
                className="w-8 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-lg relative"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: i * 0.5 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
              </motion.div>
            </motion.div>
          ))}

          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`book-rl-${i}`}
              className="absolute animate-slide-reverse"
              style={{
                top: `${40 + i * 30}%`,
                right: "-200px", 
                animationDelay: `${i * 6 + 2}s`,
              }}
              variants={bookVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.4 + 0.5 }}
            >
              <motion.div 
                className="w-8 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm shadow-lg relative"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: i * 0.7 + 1 }}
                whileHover={{
                  scale: 1.2,
                  rotate: -10,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div 
          className="z-10 text-center px-4 max-w-3xl flex items-center justify-center flex-col flex-wrap"
          variants={containerVariants}
        >
          <motion.div
            variants={crownVariants}
            whileHover="hover"
            className="cursor-pointer"
          >
            <Crown className="text-yellow-400 mb-[20px] drop-shadow-lg" size={50}/>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-5xl sm:text-md font-bold text-white mb-[20px] drop-shadow-lg"
            variants={titleVariants}
          >
            <motion.span
              className="inline-block"
              whileHover={{
                scale: 1.05,
                color: "#fbbf24",
                transition: { duration: 0.3 }
              }}
            >
              Unlock Your Reading
            </motion.span>
            <br />
            <motion.span
              className="inline-block gradient-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Potential
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-gray-300 text-lg sm:text-md md:text-xl mb-6 drop-shadow-md"
            variants={descriptionVariants}
            whileHover={{
              scale: 1.02,
              color: "#e5e7eb",
              transition: { duration: 0.3 }
            }}
          >
            Choose the perfect plan to enhance your reading journey with premium
            features, unlimited access, and exclusive content.
          </motion.p>

          {/* Subtle call-to-action pulse effect */}
          <motion.div
            className="w-2 h-2 bg-yellow-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

export default Hero;