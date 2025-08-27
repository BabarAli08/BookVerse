import TransparentButton from "../../Component/TransparentButton";
import WhiteButton from "../../Component/WhiteButton";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes slideAcross {
          0% {
            transform: translateX(-200px) translateY(0px) rotate(-15deg);
            opacity: 0;
          }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
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
          20% { opacity: 0.2; }
          80% { opacity: 0.2; }
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

      <div className="w-full h-[50vh] sm:h-[50vh] md:h-[50vh] lg:h-[40vh] bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 relative flex items-center justify-center overflow-hidden px-4">
       
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
              <div className="w-6 sm:w-8 h-8 sm:h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm shadow-lg relative">
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
              <div className="w-6 sm:w-8 h-8 sm:h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-sm shadow-lg relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-300 rounded-l-sm"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white opacity-30"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white opacity-30"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="z-10 text-center max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            About BookVerse
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-6 drop-shadow-md">
            We're on a mission to make reading more accessible, enjoyable, and
            connected than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
            <WhiteButton
              title="Explore Our Library"
              onClick={() => navigate("/books")}
            />
            <TransparentButton
              title="Get Premium"
              onClick={() => navigate("/premium")}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Hero;
