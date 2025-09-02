import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import WhiteButton from '../../Component/WhiteButton';
import TransparentButton from '../../Component/TransparentButton';



const Mission = () => {
  const [isVisible, setIsVisible] = useState(false);
 
  const navigate = useNavigate()
  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-auto bg-gray-50 flex items-center justify-center py-10 overflow-hidden">
      <div className="flex flex-col md:flex-row w-[90%] md:w-[70%] items-center justify-center gap-10">
        
        <div className={`
          flex flex-col w-full md:w-[45%] gap-4 text-center md:text-left 
          items-center md:items-start transition-all duration-1000 ease-out
          ${isVisible 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-8 opacity-0'
          }
        `}>
          
          <h1 className={`
            text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
            bg-clip-text text-transparent transition-all duration-700 ease-out
            hover:scale-105 cursor-default
            ${isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
            }
          `}
          style={{ transitionDelay: '200ms' }}
          >
            Our Mission
          </h1>

          
          <p className={`
            text-gray-600 text-base md:text-xl leading-relaxed
            transition-all duration-700 ease-out hover:text-gray-800
            ${isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
            }
          `}
          style={{ transitionDelay: '400ms' }}
          >
            At BookVerse, we believe that books have the power to transform lives, 
            broaden perspectives, and connect people across cultures and generations. 
            Our mission is to make literature accessible to everyone, everywhere.
          </p>

         
          <p className={`
            text-gray-600 text-base md:text-xl leading-relaxed
            transition-all duration-700 ease-out hover:text-gray-800
            ${isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
            }
          `}
          style={{ transitionDelay: '600ms' }}
          >
            We're not just a digital library – we're a platform that celebrates 
            the joy of reading, fosters community discussions, and empowers 
            readers to discover their next favorite story.
          </p>

          
          <div className={`
            flex flex-col sm:flex-row gap-4 justify-center md:justify-start
            transition-all duration-700 ease-out
            ${isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
            }
          `}
          style={{ transitionDelay: '800ms' }}
          >
            <div className="transform transition-all duration-300 hover:scale-105">
              <WhiteButton
                title="Start Reading"
                onClick={() => navigate("/books")}
                isBlack={true}
              />
            </div>
            <div className="transform transition-all duration-300 hover:scale-105">
              <TransparentButton
                title="Get Premium"
                isBlack={true}
                onClick={() => navigate("/premium")}
              />
            </div>
          </div>
        </div>

      
        <div className={`
          w-full md:w-[50%] relative transition-all duration-1000 ease-out
          ${isVisible 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-8 opacity-0'
          }
        `}
        style={{ transitionDelay: '300ms' }}
        >
        
          <div className="relative group overflow-hidden rounded-xl">
          
           
            
         
            <img
              src="../../../assets/AboutImage.png"
              alt="About BookVerse"
              className={`
                w-full h-auto object-cover rounded-xl shadow-md
                transition-all duration-500 ease-out group-hover:scale-105
                
              `}
            
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-6 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 blur-sm animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-md animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-100 to-transparent rounded-full opacity-50 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default Mission;