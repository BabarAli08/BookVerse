import { useNavigate } from "react-router";
import WhiteButton from "../../Component/WhiteButton";
import TransparentButton from "../../Component/TransparentButton";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.4, 0.4, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const descriptionVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
        duration: 0.4,
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
        damping: 10,
        stiffness: 100,
        duration: 0.6,
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
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
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
          20% { opacity: 0.2; }
          80% { opacity: 0.2; }
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
      `}</style>

      <motion.div 
        ref={containerRef}
        className="w-full min-h-[30vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[35vh] xl:min-h-[20vh] bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 relative flex items-center justify-center overflow-hidden"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
       
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-indigo-900/20 to-slate-900/20"
          style={{ 
            y: backgroundY,
            opacity: backgroundOpacity 
          }}
        />

        
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
              transition={{ delay: i * 0.2 }}
            >
              <motion.div 
                className="w-6 sm:w-8 md:w-10 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-lg relative"
                whileHover={{
                  scale: 1.2,
                  rotate: 8,
                  transition: { duration: 0.2 }
                }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                
                {/* Book glow effect */}
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-sm opacity-0"
                  animate={{
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
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
              transition={{ delay: i * 0.3 + 0.4 }}
            >
              <motion.div 
                className="w-6 sm:w-8 md:w-10 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm shadow-lg relative"
                whileHover={{
                  scale: 1.2,
                  rotate: -8,
                  transition: { duration: 0.2 }
                }}
                animate={{
                  y: [0, 8, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  duration: 5 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.6,
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                
                {/* Book glow effect */}
                <motion.div
                  className="absolute inset-0 bg-purple-400 rounded-sm opacity-0"
                  animate={{
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        
        <motion.div 
          className="z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
          variants={containerVariants}
        >
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 drop-shadow-lg leading-tight"
            variants={titleVariants}
          >
            {"About BookVerse".split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15 + 0.8,
                  type: "spring",
                  damping: 12,
                }}
                whileHover={{
                  scale: 1.05,
                  color: "#a855f7",
                  textShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                  transition: { duration: 0.3 }
                }}
              >
                {word === "BookVerse" ? (
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(168, 85, 247, 0.3)",
                        "0 0 20px rgba(168, 85, 247, 0.6)",
                        "0 0 10px rgba(168, 85, 247, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {word}
                  </motion.span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          
          <motion.p 
            className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 lg:mb-12 drop-shadow-md max-w-3xl mx-auto leading-relaxed"
            variants={descriptionVariants}
            whileHover={{
              scale: 1.01,
              color: "#e5e7eb",
              transition: { duration: 0.3 }
            }}
          >
            {"We're on a mission to make reading more accessible, enjoyable, and connected than ever before.".split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03 + 1.2,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center"
            variants={buttonContainerVariants}
          >
            <motion.div 
              className="w-full sm:w-auto"
              variants={buttonVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <WhiteButton
                title="Explore Our Library"
                onClick={() => navigate("/books")}
              />
            </motion.div>
            
            <motion.div 
              className="w-full sm:w-auto"
              variants={buttonVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <TransparentButton
                title="Get Premium"
                onClick={() => navigate("/premium")}
              />
            </motion.div>
          </motion.div>
        </motion.div>

       
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40"
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

  
        <motion.div
          className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          animate={{
            borderColor: ["rgba(168, 85, 247, 0.3)", "rgba(168, 85, 247, 0.6)", "rgba(168, 85, 247, 0.3)"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          animate={{
            borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.6)", "rgba(59, 130, 246, 0.3)"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </>
  );
};

export default Hero;