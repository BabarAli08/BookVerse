
import { Crown } from "lucide-react";

const Hero = () => {
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

 
      <div className="w-full sm:h-[50vh] md:h-[60vh] pt-2  bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 relative flex items-center justify-center overflow-hidden">
       
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

        <div className="z-10 text-center px-4 max-w-3xl flex items-center justify-center flex-col flex-wrap">
            <Crown className="text-yellow-400 mb-[20px]" size={50}/>
          <h1 className="text-5xl md:text-5xl sm:text-md font-bold  text-white mb-[20px] drop-shadow-lg">
            Unlock Your Reading Potential
          </h1>
          <p className="text-gray-300 text-lg sm:text-md md:text-xl mb-6 drop-shadow-md">
            Choose the perfect plan to enhance your reading journey with premium
            features, unlimited access, and exclusive content.
          </p>
        </div>
      </div>
    </>
  );
};
export default Hero;
