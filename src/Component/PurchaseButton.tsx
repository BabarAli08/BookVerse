import { motion } from "framer-motion";

interface Button {
  title: string;
  color: string;
  onClick: () => void;
}

const PurchaseButton = ({ title, color, onClick }: Button) => {
  let bgColor = '';
  let hoverBg = '';
  let shadowColor = '';

  if (color === 'gray') {
    bgColor = 'bg-[#4b5563]';
    hoverBg = '#374151';
    shadowColor = 'rgba(75, 85, 99, 0.3)';
  } else if (color === 'purple') {
    bgColor = 'bg-[#9333ea]';
    hoverBg = '#7c3aed';
    shadowColor = 'rgba(147, 51, 234, 0.4)';
  } else if (color === 'yellow') {
    bgColor = 'bg-[#ca8a04]';
    hoverBg = '#a16207';
    shadowColor = 'rgba(202, 138, 4, 0.4)';
  } else {
    bgColor = 'bg-white text-black border border-gray-300';
    hoverBg = '#f9fafb';
    shadowColor = 'rgba(0, 0, 0, 0.1)';
  }

  const buttonVariants = {
    initial: {
      scale: 1,
      backgroundColor: color === 'gray' ? '#4b5563' : 
                     color === 'purple' ? '#9333ea' : 
                     color === 'yellow' ? '#ca8a04' : '#ffffff',
    },
    hover: {
      scale: 1.02,
      backgroundColor: hoverBg,
      boxShadow: `0 8px 25px ${shadowColor}`,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  const textVariants = {
    initial: { opacity: 1 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 4,
      opacity: [0, 0.3, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className={`relative flex items-center justify-center w-[90%] h-[3rem] rounded-md ${bgColor} text-white cursor-pointer overflow-hidden font-medium`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{
          x: '100%',
          opacity: 1,
          transition: {
            duration: 0.6,
            ease: "easeInOut"
          }
        }}
      />

      {/* Click ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white rounded-md"
        variants={rippleVariants}
        initial="initial"
        whileTap="animate"
        style={{
          opacity: 0.2,
        }}
      />

      {/* Button text */}
      <motion.span
        className="relative z-10"
        variants={textVariants}
        whileHover={{
          scale: 1.05,
          fontWeight: 600,
          transition: { duration: 0.2 }
        }}
      >
        {title}
      </motion.span>

      {/* Subtle pulse effect for emphasis */}
      <motion.div
        className="absolute inset-0 rounded-md"
        animate={{
          boxShadow: [
            `0 0 0 0 ${shadowColor}`,
            `0 0 0 4px ${shadowColor}`,
            `0 0 0 0 ${shadowColor}`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Premium shimmer effect */}
      {color === 'purple' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      )}

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-4 h-4 opacity-20"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${
            color === 'purple' ? '#c084fc' : 
            color === 'yellow' ? '#fbbf24' : 
            color === 'gray' ? '#9ca3af' : '#d1d5db'
          } 50%)`
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default PurchaseButton;