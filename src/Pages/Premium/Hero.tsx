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
      rotate: -15,
      scale: 0.3
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
  };

  const titleVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.8
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
        delay: 0.3,
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

        .word-animation {
          display: inline-block;
          opacity: 0;
          animation: wordReveal 0.8s ease-out forwards;
        }

        @keyframes wordReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .letter-glow {
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
        }
      `}</style>

      <motion.div 
        ref={ref}
        className="w-full sm:h-[50vh] md:h-[60vh] pt-2 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 relative flex items-center justify-center overflow-hidden"
        initial="hidden"
        animate={mainControls}
        variants={containerVariants}
      >
       
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-indigo-900/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 200%',
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
                className="w-8 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-lg relative"
                whileHover={{
                  scale: 1.3,
                  rotate: 10,
                  transition: { duration: 0.2 }
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                
                {/* Book glow effect */}
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-sm opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
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
              transition={{ delay: i * 0.3 + 0.5 }}
            >
              <motion.div 
                className="w-8 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm shadow-lg relative"
                whileHover={{
                  scale: 1.3,
                  rotate: -10,
                  transition: { duration: 0.2 }
                }}
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                
               
                <motion.div
                  className="absolute inset-0 bg-purple-400 rounded-sm opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.9,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

       
        <motion.div 
          className="z-10 text-center px-4 max-w-3xl flex items-center justify-center flex-col flex-wrap"
          variants={containerVariants}
        >
         
          <motion.div
            variants={crownVariants}
            whileHover={{
              rotate: [0, -10, 10, 0],
              scale: 1.2,
              transition: { duration: 0.6 }
            }}
            animate={{
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="cursor-pointer relative"
          >
            <Crown className="text-yellow-400 mb-[20px] drop-shadow-lg" size={50}/>
         
            <motion.div
              className="absolute inset-0 text-yellow-400"
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Crown className="blur-sm" size={50}/>
            </motion.div>


            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  top: `${20 + Math.cos(i * 90 * Math.PI / 180) * 30}px`,
                  left: `${25 + Math.sin(i * 90 * Math.PI / 180) * 30}px`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

         
          <motion.h1 
            className="text-5xl md:text-5xl sm:text-md font-bold text-white mb-[20px] drop-shadow-lg"
            variants={titleVariants}
          >
            {["Unlock", "Your", "Reading", "Potential"].map((word, index) => (
              <motion.span
                key={word}
                className="inline-block mr-3"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15 + 1,
                  type: "spring",
                  damping: 12,
                }}
                whileHover={{
                  scale: 1.1,
                  color: "#fbbf24",
                  textShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
                  transition: { duration: 0.3 }
                }}
              >
                {word === "Potential" ? (
                  <motion.span
                    className="letter-glow"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(251, 191, 36, 0.3)",
                        "0 0 20px rgba(251, 191, 36, 0.6)",
                        "0 0 10px rgba(251, 191, 36, 0.3)"
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
            className="text-gray-300 text-lg sm:text-md md:text-xl mb-6 drop-shadow-md"
            variants={descriptionVariants}
            whileHover={{
              scale: 1.02,
              color: "#e5e7eb",
              transition: { duration: 0.3 }
            }}
          >
            {"Choose the perfect plan to enhance your reading journey with premium features, unlimited access, and exclusive content.".split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05 + 2,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

         
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.6 }}
          >
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
            <motion.div
              className="w-1 h-1 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </motion.div>
        </motion.div>

        
        {[...Array(8)].map((_, i) => (
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