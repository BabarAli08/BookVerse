import Pricing from "./Pricing";
import WhyChooseUs from "./WhyChooseUs";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

const Offers = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });


  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
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

  const dividerVariants = {
    hidden: { 
      scaleX: 0,
      opacity: 0
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [0, 1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
    >
      
      <div className="absolute inset-0 pointer-events-none">
  
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 0 }}
        />
        <motion.div
          className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-8 h-8 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-14 h-14 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg opacity-20 rotate-45"
          variants={floatingVariants}
          animate="float"
          transition={{ delay: 1.5 }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"
          style={{ y, opacity }}
        />
      </div>

      <motion.div
        variants={sectionVariants}
        className="relative z-10"
        whileHover={{
          scale: 1.001,
          transition: { duration: 0.3 }
        }}
      >
        <Pricing />
      </motion.div>

      <motion.div 
        className="flex items-center justify-center py-12 relative"
        variants={sectionVariants}
      >
        <div className="relative w-full max-w-md">
         
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
            variants={dividerVariants}
            style={{ originX: 0.5 }}
          />
          
          
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.6,
              type: "spring",
              damping: 15 
            }}
            whileHover={{
              scale: 1.2,
              rotate: 90,
              borderColor: "#3b82f6",
              transition: { duration: 0.3 }
            }}
          >
            <motion.div
              className="w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

     
          {[-60, -30, 30, 60].map((offset, index) => (
            <motion.div
              key={offset}
              className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"
              style={{ left: `calc(50% + ${offset}px)` }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.7 + index * 0.1,
                duration: 0.4 
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="relative z-10"
        whileHover={{
          scale: 1.001,
          transition: { duration: 0.3 }
        }}
      >
        <WhyChooseUs />
      </motion.div>

      
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`bottom-particle-${i}`}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
          style={{
            bottom: `${Math.random() * 100}px`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
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
        className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -100]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.3, 0]),
        }}
      />
    </motion.div>
  );
};

export default Offers;