import type {button} from '../Types'
import {motion} from 'framer-motion'

const TransparentButton = ({ title="button", onClick,isBlack=false }:button) => {
  return (
    <motion.button
      onClick={onClick}
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
      className=
       {` 
        ${isBlack?'text-black':'text-white'}
        bg-transparent 
        font-medium 
        py-2 
        px-6 
       
        
        ${isBlack?"border-gray-500":"border-gray-200"}
        border-1 
        rounded-lg 
        hover:bg-gray-100 
        hover:text-black
        hover:border-gray-800 
        transition 
        duration-300 
        ease-in-out 
        focus:outline-none 
        focus:ring-2 
        focus:ring-gray-300 
        focus:ring-opacity-50
      `}
    >
      {title}
    </motion.button>
  )
}

export default TransparentButton
