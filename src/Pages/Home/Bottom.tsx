import { LuSparkles } from "react-icons/lu";
import { FiDownload, FiUsers } from "react-icons/fi";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IoBookOutline } from "react-icons/io5";
import { useRef, useEffect } from "react";

const AnimatedCounter = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const displayValue = useTransform(springValue, (latest) => {
    if (value.includes("+")) {
      const num = parseInt(value.replace(/[+,]/g, ""));
      return Math.floor(latest).toLocaleString() + "+";
    }
    return value === "Unlimited" ? (latest > 50 ? "Unlimited" : "") : Math.floor(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      const num = value === "Unlimited" ? 100 : parseInt(value.replace(/[+,]/g, "")) || 0;
      motionValue.set(num);
    }
  }, [isInView, motionValue, value]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const Bottom = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const stats = [
    {
      icon: <IoBookOutline size={32} />,
      value: "50,000+",
      label: "Books Available",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100"
    },
    {
      icon: <FiUsers size={32} />,
      value: "100,000+",
      label: "Active Readers",
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100"
    },
    {
      icon: <FiDownload size={32} />,
      value: "1,000,000+",
      label: "Downloads",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100"
    },
    {
      icon: <LuSparkles size={32} />,
      value: "Unlimited",
      label: "Premium Features",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      hoverColor: "hover:bg-amber-100"
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Trusted by Millions
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join our growing community of book lovers from around the world
        </motion.p>
      </motion.div>

      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className={`
              relative group p-8 rounded-2xl ${stat.bgColor} ${stat.hoverColor} 
              border border-gray-100 shadow-sm transition-all duration-300 cursor-pointer
              hover:shadow-lg hover:-translate-y-1
            `}
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`
                ${stat.color} mb-4 inline-flex p-3 rounded-xl bg-white shadow-sm
                group-hover:scale-110 transition-transform duration-300
              `}
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {stat.icon}
            </motion.div>

            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
              transition={{ 
                delay: 0.5 + (i * 0.1), 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
            >
              <AnimatedCounter value={stat.value} duration={1.5 + (i * 0.2)} />
            </motion.h3>

            <motion.p 
              className="text-gray-700 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.7 + (i * 0.1), duration: 0.5 }}
            >
              {stat.label}
            </motion.p>

            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ width: '100%' }}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-center mt-16"
      >
        <p className="text-gray-500 text-sm">
          Numbers updated in real-time • Last updated today
        </p>
      </motion.div>
    </div>
  );
};

export default Bottom;