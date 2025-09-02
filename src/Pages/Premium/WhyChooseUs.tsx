import FeatureCard from "../../Component/FeatureCard";
import {
  Download,
  Phone,
  Cloud,
  User2,
  type LucideIcon,
  Headphones,
  BookAIcon,
} from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface offer {
  title: string;
  description: string;
  logo: LucideIcon;
}

const Offers = [
  {
    title: "Vast Library",
    description: "Access to over 50,000 books across all genres",
    logo: BookAIcon,
  },
  {
    title: "Offline Reading",
    description: "Download books and read anywhere, anytime",
    logo: Download,
  },
  {
    title: "Audiobooks",
    description: "Professional narrations for immersive listening",
    logo: Headphones,
  },
  {
    title: "Multi-Platform",
    description: "Read on any device with seamless sync",
    logo: Phone,
  },
  {
    title: "Cloud Sync",
    description: "Your library and progress synced across devices",
    logo: Cloud,
  },
  {
    title: "Community",
    description: "Connect with fellow readers and book clubs",
    logo: User2,
  },
];

const WhyChooseUs = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const isTitleInView = useInView(titleRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
      rotateY: -10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
        duration: 0.7,
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -12, 0],
      rotate: [0, 3, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 150,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-indigo-50/40"
          style={{ 
            y: backgroundY,
            opacity: backgroundOpacity 
          }}
        />

        {/* Floating icons as decorations */}
        <motion.div
          className="absolute top-20 left-10 text-blue-200 opacity-30"
          variants={iconVariants}
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <BookAIcon size={40} />
        </motion.div>

        <motion.div
          className="absolute top-32 right-20 text-purple-200 opacity-30"
          variants={iconVariants}
          transition={{ delay: 0.5 }}
          animate={{
            rotate: [0, -15, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Headphones size={35} />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-16 text-green-200 opacity-30"
          variants={iconVariants}
          transition={{ delay: 1 }}
          animate={{
            rotate: [0, 8, -8, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Cloud size={30} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-32 text-yellow-200 opacity-30"
          variants={iconVariants}
          transition={{ delay: 1.5 }}
          animate={{
            rotate: [0, -5, 5, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <Phone size={32} />
        </motion.div>

        {/* Geometric shapes */}
        <motion.div
          className="absolute top-60 right-10 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 0 }}
        />

        <motion.div
          className="absolute bottom-60 left-32 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg opacity-20 rotate-45"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1 }}
        />

        {/* Particle effects */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center mt-8 w-full h-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Animated Header Section */}
        <motion.div 
          ref={titleRef}
          className="flex flex-col items-center text-center gap-3 sm:gap-4 max-w-2xl relative"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          {/* Title glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-xl opacity-0 blur-sm"
            animate={{
              opacity: [0, 0.4, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug relative z-10"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            {"Why Choose BookVerse Premium?".split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.5,
                  type: "spring",
                  damping: 12,
                }}
                whileHover={{
                  color: word === "BookVerse" ? "#8b5cf6" : word === "Premium?" ? "#3b82f6" : "#1f2937",
                  y: -2,
                  transition: { duration: 0.2 }
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2 relative z-10"
            variants={descriptionVariants}
            whileHover={{
              color: "#4b5563",
              scale: 1.01,
              transition: { duration: 0.3 }
            }}
          >
            {"Unlock the full potential of your reading experience with our premium features".split(" ").map((word, index) => (
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

          {/* Decorative underline */}
          <motion.div
            className="mt-2 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isTitleInView ? "80px" : 0, 
              opacity: isTitleInView ? 1 : 0 
            }}
            transition={{ 
              duration: 0.8, 
              delay: 1.8,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Animated Cards Grid */}
        <motion.div
          className="grid w-full max-w-6xl mt-10 gap-6 
               grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 
               justify-items-center"
          variants={gridVariants}
        >
          {Offers.map((offer: offer, i: number) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -8,
                rotateY: 5,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  damping: 20 
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 } 
              }}
              className="w-full relative"
            >
              {/* Card floating animation */}
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
                className="relative"
              >
                {/* Card glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-xl opacity-0 blur-md"
                  whileHover={{
                    opacity: 0.4,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                />
                
                <FeatureCard {...offer} />

                {/* Icon enhancement overlay */}
                <motion.div
                  className="absolute top-4 left-4 pointer-events-none"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-16 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 3,
            duration: 0.6,
            type: "spring",
            damping: 15 
          }}
        >
          {[BookAIcon, Headphones, Cloud, Phone].map((Icon, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-600"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.2,
                backgroundColor: "#ddd6fe",
                transition: { duration: 0.2 }
              }}
            >
              <Icon size={16} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WhyChooseUs;