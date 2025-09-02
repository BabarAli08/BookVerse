import { useState, useEffect, useRef, useCallback } from 'react';

const OurJourney = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const headerRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

  const journeyData = [
    {
      year: "2020",
      title: "BookVerse Founded",
      description: "Started with a simple mission: make reading more accessible and enjoyable for everyone.",
      side: "left"
    },
    {
      year: "2021", 
      title: "10,000 Books",
      description: "Reached our first major milestone with 10,000 books in our digital library.",
      side: "right"
    },
    {
      year: "2022",
      title: "100,000 Users", 
      description: "Welcomed our 100,000th reader to the BookVerse community.",
      side: "left"
    },
    {
      year: "2023",
      title: "Premium Features",
      description: "Launched premium subscriptions with advanced reading features and audiobooks.",
      side: "right"
    }
  ];

  useEffect(() => {
    
    const headerTimer = setTimeout(() => {
      setHeaderVisible(true);
    }, 300);

    const timelineTimer = setTimeout(() => {
      setTimelineVisible(true);
    }, 800);

    
    journeyData.forEach((_, index) => {
      const itemTimer = setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, 1400 + (index * 300)); 
    });

  const observeElement = (element, callback, threshold = 0.1) => {
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback();
              observer.unobserve(element);
            }
          });
        },
        { 
          threshold,
          rootMargin: '100px 0px -50px 0px'
        }
      );

      observer.observe(element);
      return observer;
    };

    const observers = [];

    
    const setupObservers = setTimeout(() => {
      
      setHeaderVisible(false);
      setTimelineVisible(false);
      setVisibleItems(new Set());

      if (headerRef.current) {
        const headerObserver = observeElement(headerRef.current, () => {
          setTimeout(() => setHeaderVisible(true), 100);
        }, 0.2);
        if (headerObserver) observers.push(headerObserver);
      }

     
      if (timelineRef.current) {
        const timelineObserver = observeElement(timelineRef.current, () => {
          setTimeout(() => setTimelineVisible(true), 300);
        }, 0.1);
        if (timelineObserver) observers.push(timelineObserver);
      }

      
      itemRefs.current.forEach((itemRef, index) => {
        if (itemRef) {
          const itemObserver = observeElement(itemRef, () => {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, index]));
            }, index * 200 + 500);
          }, 0.3);
          if (itemObserver) observers.push(itemObserver);
        }
      });
    }, 100);

   
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(timelineTimer);
      clearTimeout(setupObservers);
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const TimelineItem = ({ item, index, isMobile = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [iconVisible, setIconVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const isVisible = visibleItems.has(index);

    useEffect(() => {
      if (isVisible) {
        // Icon appears first
        const iconTimer = setTimeout(() => {
          setIconVisible(true);
        }, 200);

        // Content appears after icon
        const contentTimer = setTimeout(() => {
          setContentVisible(true);
        }, 400);

        return () => {
          clearTimeout(iconTimer);
          clearTimeout(contentTimer);
        };
      }
    }, [isVisible]);

    return (
      <div 
        className="relative"
        ref={el => itemRefs.current[index] = el}
      >
        <div className={`
          ${isMobile ? 'absolute left-4' : 'hidden md:block absolute left-1/2 transform -translate-x-1/2'}
          w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10
          transition-all duration-700 ease-out
          ${iconVisible 
            ? 'scale-100 opacity-100 rotate-0' 
            : 'scale-0 opacity-0 rotate-45'
          }
        `}
        >
          <div className={`
            absolute inset-0 bg-purple-400 rounded-full animate-ping
            ${iconVisible ? 'opacity-75' : 'opacity-0'}
          `}
          style={{ animationDelay: '0ms' }}
          ></div>
          <div className={`
            absolute inset-0 bg-purple-300 rounded-full animate-ping
            ${iconVisible ? 'opacity-50' : 'opacity-0'}
          `}
          style={{ animationDelay: '200ms' }}
          ></div>
          <div className={`
            absolute inset-0 bg-purple-200 rounded-full animate-ping
            ${iconVisible ? 'opacity-25' : 'opacity-0'}
          `}
          style={{ animationDelay: '400ms' }}
          ></div>
        </div>

        {isMobile && (
          <div className={`
            ml-16 transition-all duration-800 ease-out
            ${contentVisible 
              ? 'translate-x-0 opacity-100 rotate-0' 
              : 'translate-x-12 opacity-0 rotate-1'
            }
          `}
          >
            <div 
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-lg"></div>
              
              <div className="relative z-10">
                <div className={`
                  flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3
                  transition-all duration-500 ease-out
                  ${contentVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                  }
                `}
                style={{ transitionDelay: '100ms' }}
                >
                  <span className={`
                    bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full w-fit
                    transition-all duration-500 transform
                    ${isHovered ? 'scale-110 bg-purple-700 shadow-lg' : 'scale-100'}
                    ${contentVisible ? 'rotate-0' : 'rotate-12'}
                  `}>
                    {item.year}
                  </span>
                  <h3 className={`
                    text-lg sm:text-xl font-bold transition-all duration-500
                    ${isHovered ? 'text-purple-700 scale-105' : 'text-gray-900'}
                    ${contentVisible 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-2 opacity-0'
                    }
                  `}
                  style={{ transitionDelay: '200ms' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className={`
                  text-gray-600 leading-relaxed text-sm sm:text-base transition-all duration-600
                  ${isHovered ? 'text-gray-700 scale-105' : 'text-gray-600'}
                  ${contentVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-3 opacity-0'
                  }
                `}
                style={{ transitionDelay: '300ms' }}
                >
                  {item.description}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-2 h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 animate-bounce"></div>
              <div className="absolute bottom-3 left-16 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-1/2 right-6 w-1 h-1 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>

              <div className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0
                transition-all duration-1200 ease-out pointer-events-none rounded-lg
                ${isHovered ? 'translate-x-full opacity-20' : '-translate-x-full opacity-0'}
              `}></div>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center">
          {item.side === "left" ? (
            <>
              <div className={`
                w-1/2 pr-8 transition-all duration-900 ease-out
                ${contentVisible 
                  ? 'translate-x-0 opacity-100 rotate-0' 
                  : '-translate-x-16 opacity-0 -rotate-2'
                }
              `}
              >
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 ml-auto max-w-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 cursor-pointer overflow-hidden relative group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/40 to-blue-100/40 opacity-0 group-hover:opacity-80 transition-opacity duration-800"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
                  
                  <div className="relative z-10">
                    <div className={`
                      flex items-center gap-3 mb-3 transition-all duration-600 ease-out
                      ${contentVisible 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-3 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: '100ms' }}
                    >
                      <span className={`
                        bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full
                        transition-all duration-500 transform
                        ${isHovered ? 'scale-110 bg-purple-700 shadow-xl rotate-6' : 'scale-100 rotate-0'}
                        ${contentVisible ? 'scale-100' : 'scale-75'}
                      `}>
                        {item.year}
                      </span>
                      <h3 className={`
                        text-xl font-bold transition-all duration-500
                        ${isHovered ? 'text-purple-700 scale-105' : 'text-gray-900'}
                        ${contentVisible 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-3 opacity-0'
                        }
                      `}
                      style={{ transitionDelay: '200ms' }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className={`
                      text-gray-600 leading-relaxed transition-all duration-600
                      ${isHovered ? 'text-gray-700 scale-105' : 'text-gray-600'}
                      ${contentVisible 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-4 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: '300ms' }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 animate-bounce"></div>
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/2 right-8 w-1 h-1 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-600 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-35 transition-all duration-800 animate-bounce" style={{ animationDelay: '0.9s' }}></div>
                  
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0
                    transition-all duration-1200 ease-out pointer-events-none rounded-lg
                    ${isHovered ? 'translate-x-full opacity-25 scale-110' : '-translate-x-full opacity-0 scale-100'}
                  `}></div>
                </div>
              </div>
              <div className="w-1/2 pl-8"></div>
            </>
          ) : (
            <>
              <div className="w-1/2 pr-8"></div>
              <div className={`
                w-1/2 pl-8 transition-all duration-900 ease-out
                ${contentVisible 
                  ? 'translate-x-0 opacity-100 rotate-0' 
                  : 'translate-x-16 opacity-0 rotate-2'
                }
              `}
              >
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 mr-auto max-w-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 cursor-pointer overflow-hidden relative group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-bl from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-100/40 to-purple-100/40 opacity-0 group-hover:opacity-80 transition-opacity duration-800"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-l from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
                  
                  <div className="relative z-10">
                    <div className={`
                      flex items-center gap-3 mb-3 transition-all duration-600 ease-out
                      ${contentVisible 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-3 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: '100ms' }}
                    >
                      <span className={`
                        bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full
                        transition-all duration-500 transform
                        ${isHovered ? 'scale-110 bg-purple-700 shadow-xl -rotate-6' : 'scale-100 rotate-0'}
                        ${contentVisible ? 'scale-100' : 'scale-75'}
                      `}>
                        {item.year}
                      </span>
                      <h3 className={`
                        text-xl font-bold transition-all duration-500
                        ${isHovered ? 'text-purple-700 scale-105' : 'text-gray-900'}
                        ${contentVisible 
                          ? 'translate-x-0 opacity-100' 
                          : '-translate-x-3 opacity-0'
                        }
                      `}
                      style={{ transitionDelay: '200ms' }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className={`
                      text-gray-600 leading-relaxed transition-all duration-600
                      ${isHovered ? 'text-gray-700 scale-105' : 'text-gray-600'}
                      ${contentVisible 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-4 opacity-0'
                      }
                    `}
                    style={{ transitionDelay: '300ms' }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 animate-bounce"></div>
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/2 left-8 w-1 h-1 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-600 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-35 transition-all duration-800 animate-bounce" style={{ animationDelay: '0.9s' }}></div>
                  
                  <div className={`
                    absolute inset-0 bg-gradient-to-l from-transparent via-white to-transparent opacity-0
                    transition-all duration-1200 ease-out pointer-events-none rounded-lg
                    ${isHovered ? '-translate-x-full opacity-25 scale-110' : 'translate-x-full opacity-0 scale-100'}
                  `}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto py-8 md:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 w-full px-4 md:px-8 overflow-hidden relative">
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-pink-200/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      
      <div 
        className={`
          text-center mb-8 md:mb-16 transition-all duration-1000 ease-out
          ${headerVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-12 opacity-0 scale-95'
          }
        `}
        ref={headerRef}
      >
        <h1 className={`
          text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative
          bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 
          bg-clip-text text-transparent transition-all duration-700
          hover:scale-105 cursor-default
          ${headerVisible ? 'scale-100 rotate-0' : 'scale-90 rotate-1'}
        `}>
          Our Journey
          <div className={`
            absolute -bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400
            transition-all duration-1200 ease-out
            ${headerVisible ? 'w-24 -translate-x-1/2 opacity-100' : 'w-0 -translate-x-1/2 opacity-0'}
          `}
          style={{ transitionDelay: '600ms' }}
          ></div>
          <div className={`
            absolute -bottom-3 left-1/2 w-1 h-1 bg-purple-400 rounded-full
            transition-all duration-800 ease-out
            ${headerVisible ? 'scale-100 -translate-x-1/2 opacity-60' : 'scale-0 -translate-x-1/2 opacity-0'}
          `}
          style={{ transitionDelay: '1000ms' }}
          ></div>
        </h1>
        <p className={`
          text-base md:text-lg text-gray-600 transition-all duration-800 ease-out
          ${headerVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-6 opacity-0'
          }
        `}
        style={{ transitionDelay: '400ms' }}
        >
          From a simple idea to a global reading platform
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
        
        <div className={`
          hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-200 via-blue-200 to-purple-200
          transition-all duration-2500 ease-out origin-top shadow-sm
          ${timelineVisible ? 'h-full scale-y-100 opacity-100' : 'h-full scale-y-0 opacity-60'}
        `}></div>
        
        <div className={`
          md:hidden absolute left-6 w-1 bg-gradient-to-b from-purple-200 via-blue-200 to-purple-200
          transition-all duration-2500 ease-out origin-top shadow-sm
          ${timelineVisible ? 'h-full scale-y-100 opacity-100' : 'h-full scale-y-0 opacity-60'}
        `}></div>

        <div className="space-y-12 md:space-y-20">
          {journeyData.map((item, index) => (
            <div key={index}>
              {/* Mobile version */}
              <div className="md:hidden">
                <TimelineItem item={item} index={index} isMobile={true} />
              </div>
              
              {/* Desktop version */}
              <div className="hidden md:block">
                <TimelineItem item={item} index={index} isMobile={false} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`
        mt-16 flex justify-center space-x-3
        transition-all duration-1000 ease-out
        ${headerVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-6 opacity-0 scale-90'
        }
      `}
      style={{ transitionDelay: '4000ms' }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`
              h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 rounded-full 
              animate-pulse transition-all duration-600 ease-out
              ${headerVisible ? 'w-2 scale-100 opacity-70' : 'w-0 scale-0 opacity-0'}
            `}
            style={{ 
              animationDelay: `${i * 0.3}s`,
              transitionDelay: `${4200 + i * 150}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default OurJourney;