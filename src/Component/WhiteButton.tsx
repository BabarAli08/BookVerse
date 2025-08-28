import { motion } from "framer-motion";

interface buttonType {
  title: string;
  onClick: () => void;
  isBlack?: boolean;
}

const WhiteButton = ({ title = "button", onClick, isBlack = false }: buttonType) => {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{
        scale: 1.08,
        boxShadow: isBlack
          ? "0px 8px 20px rgba(0,0,0,0.35)"
          : "0px 8px 20px rgba(0,0,0,0.15)",
        transition: { duration: 0.25 },
      }}
      whileTap={{
        scale: 0.92,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        transition: { duration: 0.1 },
      }}
      onClick={onClick}
      className={`
        font-medium 
        py-2 
        px-6 
        border 
        rounded-xl
        transition-colors
        duration-300
        ease-in-out 
        focus:outline-none 
        focus:ring-2 
        focus:ring-opacity-50
        ${isBlack
          ? "bg-black text-white border-gray-600 hover:bg-gray-900 focus:ring-gray-700"
          : "bg-white text-black border-gray-200 hover:bg-gray-100 hover:border-gray-400 focus:ring-gray-300"
        }
      `}
    >
      {title}
    </motion.button>
  );
};

export default WhiteButton;
