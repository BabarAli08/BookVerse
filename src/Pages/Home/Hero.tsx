import { motion } from "framer-motion";
import TransparentButton from "../../Component/TransparentButton";
import WhiteButton from "../../Component/WhiteButton";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();

  const text =
    "Your gateway to infinite stories. Read, discover, and immerse yourself in worlds beyond imagination.";

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.03,
      },
    },
  };

  const buttonsVariant={
    hidden:{
      opacity:0,
      y:20
    },
    visible:{
      opacity:1,
      y:0,
      transition:{
        delay:0.3,
        staggerChildren:0.03,
      },
    }
  }

  const buttonVar={
    hidden:{
      opacity:0,
      y:20
    },
    visible:{
      opacity:1,
      y:0,
    }
  }

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <style>{`
        @keyframes slideAcross {
          0% {
            transform: translateX(-200px) translateY(0px) rotate(-15deg);
            opacity: 0;
          }
          20% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(calc(100vw + 200px)) translateY(-20px) rotate(15deg);
            opacity: 0;
          }
        }
        
        @keyframes slideAcrossReverse {
          0% {
            transform: translateX(calc(100vw + 200px)) translateY(0px) rotate(15deg);
            opacity: 0;
          }
          20% {
            opacity: 0.2;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateX(-200px) translateY(-30px) rotate(-15deg);
            opacity: 0;
          }
        }
        
        .animate-slide {
          animation: slideAcross 12s linear infinite;
        }
        
        .animate-slide-reverse {
          animation: slideAcrossReverse 15s linear infinite;
        }
      `}</style>

      <div className="w-full h-[50vh] bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={`book-lr-${i}`}
              className="absolute animate-slide"
              style={{
                top: `${20 + i * 25}%`,
                left: "-200px",
                animationDelay: `${i * 4}s`,
              }}
            >
              <div className="w-8 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-lg relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
              </div>
            </div>
          ))}

          {[...Array(2)].map((_, i) => (
            <div
              key={`book-rl-${i}`}
              className="absolute animate-slide-reverse"
              style={{
                top: `${40 + i * 30}%`,
                right: "-200px",
                animationDelay: `${i * 6 + 2}s`,
              }}
            >
              <div className="w-8 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm shadow-lg relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="z-10 text-center px-4 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            BookVerse
          </motion.h1>
          <motion.p
            variants={sentence}
            initial="hidden"
            animate="visible"
            className="text-gray-300 text-lg md:text-xl mb-6 drop-shadow-md min-h-[4rem] sm:min-h-[3rem]"
          >
            {text.split("").map((char, index) => (
              <motion.span key={index} variants={letter}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.p>

          <motion.div variants={buttonsVariant} initial="hidden" animate="visible" className="flex items-center flex-col sm:flex-row gap-4 justify-center">
            <WhiteButton
              title="Explore Books"
              onClick={() => navigate("/books")}
            />
            <TransparentButton
              title="Get Premium"
              onClick={() => navigate("/premium")}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default Hero;
