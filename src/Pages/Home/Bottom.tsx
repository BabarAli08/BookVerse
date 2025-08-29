import { LuSparkles } from "react-icons/lu";
import { FiDownload, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { IoBookOutline } from "react-icons/io5";

const Bottom = () => {
  const parentStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // 👈 delay between children
      },
    },
  };

  const staggerChild = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stats = [
    {
      icon: <IoBookOutline size={40} />,
      value: "50,000+",
      label: "Books Available",
    },
    {
      icon: <FiUsers size={40} />,
      value: "100,000+",
      label: "Active Readers",
    },
    { icon: <FiDownload size={40} />, value: "1M+", label: "Downloads" },
    {
      icon: <LuSparkles size={40} />,
      value: "Unlimited",
      label: "Premium Features",
    },
  ];

  return (
    <div className="w-full bg-white py-16 px-6">
      <motion.div
        variants={parentStagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-6xl mx-auto text-center"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={staggerChild} 
            className="flex flex-col items-center p-6 rounded-2xl drop-shadow-md transition-transform duration-500"
          >
            <div className="bg-gray-300 text-pink-500 p-5 rounded-full text-6xl mb-4">
              {stat.icon}
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-1">
              {stat.value}
            </h3>
            <p className="text-lg text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Bottom;
