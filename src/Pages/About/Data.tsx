import { useState, useEffect } from 'react';

interface DataState {
  number: string;
  description: string;
}

const Data = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState<string[]>([]);

  const data = [
    { number: "50000+", description: "Books Available" },
    { number: "100,000+", description: "Active Readers" },
    { number: "1M+", description: "Books Read" },
    { number: "150+", description: "Countries Served" },
  ];

 
  const animateNumber = (target: string, index: number) => {
    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
    const suffix = target.replace(/[\d,]/g, '');
    let current = 0;
    const increment = Math.ceil(numericValue / 50);
    const duration = 20;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }

      setAnimatedNumbers(prev => {
        const newNumbers = [...prev];
        newNumbers[index] = current.toLocaleString() + suffix;
        return newNumbers;
      });
    }, duration);
  };

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      data.forEach((item, index) => {
        setTimeout(() => {
          animateNumber(item.number, index);
        }, index * 200);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8 max-w-6xl mx-auto">
      {data.map((item: DataState, i: number) => (
        <div
          key={i}
          className={`
            relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 
            rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl
            transform transition-all duration-700 ease-out
            hover:scale-105 hover:-translate-y-2
            ${isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
            }
          `}
          style={{
            transitionDelay: `${i * 150}ms`,
            animationDelay: `${i * 150}ms`
          }}
        >
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: `${i * 0.5}s` }}></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: `${i * 0.3}s` }}></div>
          
          <div className="relative z-10">
            <div className={`
              text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
              bg-clip-text text-transparent mb-3
              transition-all duration-500 ease-out
              ${isVisible ? 'scale-100' : 'scale-75'}
            `}>
              {animatedNumbers[i] || '0'}
            </div>
            
            <div className={`
              text-gray-700 font-medium text-sm md:text-base
              transition-all duration-700 ease-out
              ${isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
              }
            `}
            style={{ transitionDelay: `${i * 150 + 300}ms` }}
            >
              {item.description}
            </div>
          </div>

         
          <div className="absolute inset-0 rounded-2xl transition-all duration-300 hover:bg-white/10"></div>
        </div>
      ))}
      
     
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default Data;