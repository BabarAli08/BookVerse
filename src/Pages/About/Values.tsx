import { useState, useEffect } from 'react';
import {
  Download,
  Phone,
  Cloud,
  User2,
  Headphones,
  BookOpen,
  type LucideIcon,
} from "lucide-react";



const FeatureCard = ({ title, description, Logo, index }:{title:string; description:string ;Logo:LucideIcon; index:number} ) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200 + 800); 

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`
        relative group p-6 bg-white rounded-2xl shadow-lg border border-gray-100
        transition-all duration-700 ease-out cursor-pointer overflow-hidden
        hover:shadow-2xl hover:border-blue-200 hover:-translate-y-3 hover:scale-105
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100 rotate-0' 
          : 'translate-y-12 opacity-0 scale-90'
        }
      `}
      style={{ 
        transform: isVisible 
          ? 'translateY(0) scale(1) rotate(0deg)' 
          : `translateY(48px) scale(0.9) rotate(${index % 2 ? '2deg' : '-2deg'})`,
        transitionDelay: `${index * 50}ms` 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
     
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
       
        <div className={`
          p-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100
          transition-all duration-500 ease-out
          ${isHovered ? 'scale-110 rotate-6 shadow-lg' : 'scale-100 rotate-0'}
        `}
        >
          <Logo 
            size={32} 
            className={`
              transition-all duration-500 ease-out
              ${isHovered 
                ? 'text-purple-600' 
                : 'text-blue-600'
              }
            `}
          />
        </div>

        
        <h3 className={`
          text-xl font-bold transition-all duration-500 ease-out
          ${isHovered ? 'text-purple-700 scale-105' : 'text-gray-800'}
          ${isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-2 opacity-0'
          }
        `}
        style={{ 
          transitionDelay: `${index * 200 + 1000}ms`
        }}
        >
          {title}
        </h3>

       
        <p className={`
          text-gray-600 leading-relaxed transition-all duration-500 ease-out
          ${isHovered ? 'text-gray-700 scale-105' : 'text-gray-600'}
          ${isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-3 opacity-0'
          }
        `}
        style={{ 
          transitionDelay: `${index * 200 + 1200}ms`
        }}
        >
          {description}
        </p>
      </div>

      
      <div 
        className={`
          absolute top-3 right-3 w-2 h-2 bg-blue-300 rounded-full 
          transition-all duration-500 animate-bounce
          ${isHovered ? 'opacity-60 scale-110' : 'opacity-0 scale-75'}
        `}
        style={{ 
          animationDelay: `${index * 0.2}s`,
          transitionDelay: '200ms'
        }}
      ></div>
      <div 
        className={`
          absolute bottom-4 left-3 w-1.5 h-1.5 bg-purple-300 rounded-full 
          transition-all duration-700 animate-bounce
          ${isHovered ? 'opacity-40 scale-110' : 'opacity-0 scale-75'}
        `}
        style={{ 
          animationDelay: `${index * 0.3 + 0.5}s`,
          transitionDelay: '400ms'
        }}
      ></div>

      {/* Ripple effect on hover */}
      <div className={`
        absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent
        transition-all duration-1000 ease-out pointer-events-none
        ${isHovered 
          ? 'translate-x-full opacity-30' 
          : '-translate-x-full opacity-0'
        }
      `}></div>
    </div>
  );
};

interface Offer {
  title: string;
  description: string;
  logo: any;
}

const Offers = [
  {
    title: "Vast Library",
    description: "Access to over 50,000 books across all genres",
    Logo: BookOpen,
  },
  {
    title: "Offline Reading",
    description: "Download books and read anywhere, anytime",
    Logo: Download,
  },
  {
    title: "Audiobooks",
    description: "Professional narrations for immersive listening",
    Logo: Headphones,
  },
  {
    title: "Multi-Platform",
    description: "Read on any device with seamless sync",
    Logo: Phone,
  },
  {
    title: "Cloud Sync",
    description: "Your library and progress synced across devices",
    Logo: Cloud,
  },
  {
    title: "Community",
    description: "Connect with fellow readers and book clubs",
    Logo: User2,
  },
];

const Values = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsStartAnimation, setCardsStartAnimation] = useState(false);

  useEffect(() => {

    const headerTimer = setTimeout(() => {
      setHeaderVisible(true);
    }, 200);

   
    const cardsTimer = setTimeout(() => {
      setCardsStartAnimation(true);
    }, 600);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-2 justify-baseline w-full h-auto bg-gradient-to-b from-gray-50 to-white py-16 overflow-hidden relative">
      
     
      <div className="absolute top-20 left-10 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-purple-300/15 to-pink-300/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '4s' }}></div>

     
      <div className={`
        flex flex-col items-center text-center gap-5 justify-center 
        w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%] h-auto mb-12
        transition-all duration-1000 ease-out
        ${headerVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-8 opacity-0'
        }
      `}>
        <h1 className={`
          text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 
          bg-clip-text text-transparent transition-all duration-700
          hover:scale-105 cursor-default relative
          ${headerVisible ? 'scale-100' : 'scale-90'}
        `}>
          Why Choose BookVerse Premium?
          
          <div className={`
            absolute -bottom-2 left-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400
            transition-all duration-1000 ease-out
            ${headerVisible ? 'w-3/4 -translate-x-1/2' : 'w-0 -translate-x-1/2'}
          `}
          style={{ transitionDelay: '500ms' }}
          ></div>
        </h1>
        
        <p className={`
          text-gray-600 text-lg md:text-xl leading-relaxed
          transition-all duration-700 ease-out
          ${headerVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-6 opacity-0'
          }
        `}
        style={{ transitionDelay: '300ms' }}
        >
          Unlock the full potential of your reading experience with our
          premium features
        </p>
      </div>

    
      <div className={`
        grid w-[90%] md:w-[80%] h-auto gap-6 place-items-center 
        grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative
        transition-all duration-500 ease-out
        ${cardsStartAnimation ? 'scale-100' : 'scale-95'}
      `}>
        {Offers.map((offer: Offer, i: number) => (
          <div
            key={i}
            className="w-full max-w-sm"
            style={{
              animationDelay: `${i * 100}ms`
            }}
          >
            <FeatureCard 
              {...offer} 
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Enhanced bottom decoration with staggered dots */}
      <div className={`
        mt-16 flex justify-center space-x-3
        transition-all duration-1000 ease-out
        ${headerVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-6 opacity-0'
        }
      `}
      style={{ transitionDelay: '2000ms' }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`
              h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full 
              animate-pulse transition-all duration-500 ease-out
              ${headerVisible ? 'w-2 scale-100' : 'w-0 scale-0'}
            `}
            style={{ 
              animationDelay: `${i * 0.2}s`,
              transitionDelay: `${2200 + i * 100}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Values;