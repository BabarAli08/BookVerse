import { motion, useScroll, useTransform } from "framer-motion";
import TransparentButton from "../../Component/TransparentButton";
import WhiteButton from "../../Component/WhiteButton";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const text =
    "Your gateway to infinite stories. Read, discover, and immerse yourself in worlds beyond imagination.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const titleVariants = {
    hidden: { 
      opacity: 0,
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.2
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.02,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      rotateX: -90
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const buttonsContainerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  };

  const buttonVariants = {
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
        stiffness: 150,
        damping: 12
      }
    },
    hover: {
      y: -5,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const floatingBookVariants = {
    initial: { 
      opacity: 0,
      x: -100,
      y: 50,
      rotate: -20
    },
    animate: (index) => ({
      opacity: [0, 0.6, 0.6, 0],
      x: [
        -100,
        window.innerWidth * 0.2,
        window.innerWidth * 0.8,
        window.innerWidth + 100
      ],
      y: [
        50 + (index * 30),
        30 + (index * 25),
        10 + (index * 20),
        -10 + (index * 15)
      ],
      rotate: [-20, -10, 10, 25],
      transition: {
        duration: 8 + (index * 2),
        repeat: Infinity,
        repeatDelay: 2 + (index * 1.5),
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1]
      }
    })
  };

  const reverseFloatingBookVariants = {
    initial: { 
      opacity: 0,
      x: window.innerWidth + 100,
      y: 80,
      rotate: 20
    },
    animate: (index) => ({
      opacity: [0, 0.4, 0.4, 0],
      x: [
        window.innerWidth + 100,
        window.innerWidth * 0.7,
        window.innerWidth * 0.3,
        -100
      ],
      y: [
        80 + (index * 40),
        60 + (index * 35),
        40 + (index * 30),
        20 + (index * 25)
      ],
      rotate: [20, 10, -10, -25],
      transition: {
        duration: 10 + (index * 1.5),
        repeat: Infinity,
        repeatDelay: 3 + (index * 2),
        ease: "easeInOut",
        times: [0, 0.2, 0.8, 1]
      }
    })
  };

  const backgroundVariants = {
    initial: { 
      background: "linear-gradient(135deg, #0f172a, #1e293b, #312e81)"
    },
    animate: {
      background: [
        "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
        "linear-gradient(135deg, #1e293b, #312e81, #4c1d95)",
        "linear-gradient(135deg, #312e81, #4c1d95, #1e293b)",
        "linear-gradient(135deg, #0f172a, #1e293b, #312e81)"
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="w-full h-[50vh] relative flex items-center justify-center overflow-hidden"
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`floating-book-${i}`}
            className="absolute"
            variants={floatingBookVariants}
            initial="initial"
            animate="animate"
            custom={i}
            style={{ y: y1 }}
          >
            <motion.div 
              className="w-8 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-xl relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 rounded-l-sm"></div>
              <motion.div 
                className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              ></motion.div>
            </motion.div>
          </motion.div>
        ))}

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`reverse-floating-book-${i}`}
            className="absolute"
            variants={reverseFloatingBookVariants}
            initial="initial"
            animate="animate"
            custom={i}
            style={{ y: y2 }}
          >
            <motion.div 
              className="w-8 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm shadow-xl relative"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-300 rounded-l-sm"></div>
              <motion.div 
                className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              ></motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [Math.random() * window.innerHeight, -50],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth + (Math.random() - 0.5) * 100
              ]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="z-10 text-center px-4 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={titleVariants}
          className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl"
          whileHover={{ 
            scale: 1.05,
            textShadow: "0 0 20px rgba(96, 165, 250, 0.8)",
            transition: { duration: 0.3 }
          }}
          animate={{
            textShadow: [
              "0 4px 8px rgba(0,0,0,0.3)",
              "0 4px 20px rgba(96, 165, 250, 0.4)",
              "0 4px 20px rgba(192, 132, 252, 0.4)",
              "0 4px 8px rgba(0,0,0,0.3)"
            ]
          }}
          transition={{
            textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          BookVerse
        </motion.h1>

        <motion.div 
          className="w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-5"
          variants={subtitleVariants}
        >
          <motion.p
            className="text-gray-300 text-sm xs:text-base sm:text-xl md:text-xl lg:text-2xl mb-3 xs:mb-4 sm:mb-6 drop-shadow-md py-2 xs:py-3 sm:py-4 md:py-5 leading-loose xs:leading-relaxed sm:leading-normal md:leading-relaxed text-center break-words"
          >
            {text.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
                whileHover={{ 
                  scale: 1.2, 
                  color: "#60a5fa",
                  transition: { duration: 0.2 }
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        <motion.div
          variants={buttonsContainerVariants}
          className="flex items-center flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <WhiteButton
              title="Explore Books"
              onClick={() => navigate("/books")}
            />
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <TransparentButton
              title="Get Premium"
              onClick={() => navigate("/premium")}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;