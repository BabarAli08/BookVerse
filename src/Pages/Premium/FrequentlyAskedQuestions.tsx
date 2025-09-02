import QuestionsCard from "../../Component/QuestionsCard";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Questions = [
  {
    title: "Can I cancel my subscription anytime?",
    description:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.",
  },
  {
    title: "Do you offer a free trial?",
    description:
      "Yes! New users get a 14-day free trial of our Premium plan. No credit card required to start your trial.",
  },
  {
    title: "Can I switch between plans?",
    description:
      "You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
];

const FrequentlyAskedQuestions = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });
  const isContainerInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95,
      rotateX: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
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
      y: [0, -15, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const questionMarkVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -45
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 150,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden"
      initial="hidden"
      animate={isContainerInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30"
          style={{ 
            y: backgroundY,
            opacity: backgroundOpacity 
          }}
        />

        <motion.div
          className="absolute top-20 left-10 text-6xl text-blue-200 font-bold select-none"
          variants={questionMarkVariants}
          initial="hidden"
          animate={isContainerInView ? "visible" : "hidden"}
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ?
        </motion.div>

        <motion.div
          className="absolute top-32 right-16 text-4xl text-purple-200 font-bold select-none"
          variants={questionMarkVariants}
          initial="hidden"
          animate={isContainerInView ? "visible" : "hidden"}
          transition={{ delay: 0.7 }}
          animate={{
            rotate: [0, -8, 8, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          ?
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 text-5xl text-green-200 font-bold select-none"
          variants={questionMarkVariants}
          initial="hidden"
          animate={isContainerInView ? "visible" : "hidden"}
          transition={{ delay: 1 }}
          animate={{
            rotate: [0, 3, -3, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          ?
        </motion.div>

        <motion.div
          className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 0 }}
        />
        
        <motion.div
          className="absolute bottom-32 right-20 w-8 h-8 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg opacity-20 rotate-45"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1.5 }}
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
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
      </div>

      <div className="flex items-center justify-center flex-col w-full px-4 py-12 relative z-10">
        <motion.div 
          ref={titleRef}
          className="max-w-2xl text-center mb-10 relative"
          variants={titleVariants}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-lg opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold relative z-10"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            {"Frequently Asked Questions".split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.8,
                  type: "spring",
                  damping: 12,
                }}
                whileHover={{
                  color: "#3b82f6",
                  y: -2,
                  transition: { duration: 0.2 }
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            className="mt-4 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full mx-auto"
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isTitleInView ? "60px" : 0, 
              opacity: isTitleInView ? 1 : 0 
            }}
            transition={{ 
              duration: 0.8, 
              delay: 1.5,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
          variants={containerVariants}
        >
          {Questions.map((ques, i) => (
            <motion.div 
              key={i} 
              className="w-full"
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                y: -5,
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
            >
              <motion.div
                className="relative"
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg opacity-0 blur-sm"
                  whileHover={{
                    opacity: 0.3,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                />
                
                <QuestionsCard {...ques} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 2,
            duration: 0.6,
            type: "spring",
            damping: 15 
          }}
        >
          <motion.div
            className="flex space-x-2"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FrequentlyAskedQuestions;