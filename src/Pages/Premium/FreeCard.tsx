import { Check } from "lucide-react";
import { FcCancel } from "react-icons/fc";
import { useState } from "react";
import PurchaseButton from "../../Component/PurchaseButton";
import { motion, AnimatePresence } from "framer-motion";

interface Card {
  yes: string[];
  no: string[];
  title: string;
  price: string;
  onClick: () => void;
  yearly?: boolean;
  name?: string;
  color: "gray" | "purple" | "yellow" | "default";
  heading: string;
  priceTitle: string;
}

const getColorClasses = (color: string, selected: boolean) => {
  if (!selected) {
    return {
      border: "border-gray-300", 
      background: "bg-white",     
    };
  }

  switch (color) {
    case "purple":
      return {
        border: "border-[#9333ea]",
        background: "bg-purple-50",
      };
    case "yellow":
      return {
        border: "border-[#ca8a04]",
        background: "bg-yellow-50",
      };
    case "gray":
      return {
        border: "border-[#4b5563]",
        background: "bg-gray-50",
      };
    default:
      return {
        border: "border-black",
        background: "bg-gray-100",
      };
  }
};

const FreeCard = ({
  yes,
  no,
  title,
  price,
  onClick,
  color,
  heading,
  priceTitle,
}: Card) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected); 
    onClick();
  };

  const { border, background } = getColorClasses(color, selected);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
        delay: 0.2,
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const checkIconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  const cancelIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
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
      onClick={handleClick}
      className={`flex items-start justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border ${background} ${border} cursor-pointer transition-colors duration-200 relative overflow-hidden`}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
    
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              borderRadius: "50%",
              transformOrigin: "center",
            }}
          />
        )}
      </AnimatePresence>

     
      <motion.div 
        className="flex items-center w-full h-[30%] justify-center flex-col gap-4 relative z-10"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-2xl font-bold"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          {priceTitle}
        </motion.h1>

        <motion.p 
          className="text-md text-gray-600 text-center"
          variants={itemVariants}
        >
          {heading}
        </motion.p>

        <motion.h2 
          className="text-4xl font-bold text-black relative"
          variants={priceVariants}
          whileHover={{
            scale: 1.1,
            color: color === "purple" ? "#9333ea" : color === "yellow" ? "#ca8a04" : "#4b5563",
            transition: { duration: 0.2 }
          }}
        >
          {price}
        
          <motion.div
            className="absolute inset-0 text-4xl font-bold opacity-0 blur-sm"
            style={{
              color: color === "purple" ? "#9333ea" : color === "yellow" ? "#ca8a04" : "#4b5563"
            }}
            whileHover={{
              opacity: 0.3,
              transition: { duration: 0.2 }
            }}
          >
            {price}
          </motion.div>
        </motion.h2>
      </motion.div>

     
      <motion.div 
        className="flex items-start pl-3.5 justify-center gap-4 flex-col relative z-10"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        
        {yes.map((item, i) => (
          <motion.div 
            key={`yes-${i}`} 
            className="flex items-center gap-2"
            variants={itemVariants}
            whileHover={{
              x: 5,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              variants={checkIconVariants}
              whileHover={{
                rotate: 360,
                scale: 1.2,
                transition: { duration: 0.3 }
              }}
            >
              <Check className="text-green-400" />
            </motion.div>
            <motion.h2
              whileHover={{
                color: "#059669",
                transition: { duration: 0.2 }
              }}
            >
              {item}
            </motion.h2>
          </motion.div>
        ))}

        
        {no.map((item, i) => (
          <motion.div 
            key={`no-${i}`} 
            className="flex items-center gap-2"
            variants={itemVariants}
            whileHover={{
              x: 2,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              variants={cancelIconVariants}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              <FcCancel />
            </motion.div>
            <motion.h2 
              className="text-gray-500"
              whileHover={{
                color: "#6b7280",
                transition: { duration: 0.2 }
              }}
            >
              {item}
            </motion.h2>
          </motion.div>
        ))}
      </motion.div>

     
      <motion.div 
        className="w-full flex items-center justify-center mt-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <motion.div
        className="w-full flex items-center justify-center mt-4 relative z-10"
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
        >
          <PurchaseButton title={title} color={color} onClick={onClick} />
        </motion.div>
      </motion.div>

     
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: `2px solid transparent`,
          background: `linear-gradient(45deg, ${
            color === "purple" ? "#9333ea20" : 
            color === "yellow" ? "#ca8a0420" : 
            color === "gray" ? "#4b556320" : "#00000020"
          }, transparent) border-box`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "subtract",
        }}
        initial={{ opacity: 0 }}
        whileHover={{ 
          opacity: selected ? 0.8 : 0.4,
          transition: { duration: 0.2 }
        }}
      />

     
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${
            color === "purple" ? "#9333ea" : 
            color === "yellow" ? "#ca8a04" : 
            color === "gray" ? "#4b5563" : "#000000"
          } 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${
            color === "purple" ? "#9333ea" : 
            color === "yellow" ? "#ca8a04" : 
            color === "gray" ? "#4b5563" : "#000000"
          } 0%, transparent 50%)`,
        }}
      />
    </motion.div>
  );
};

export default FreeCard;