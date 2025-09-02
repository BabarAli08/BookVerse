import { useState, useEffect, useRef } from 'react';

const MeetOurTeam = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  const teamMembers = [
    {
      name: "Babar ALi",
      role: "Founder & CEO",
      description: "Former librarian turned tech entrepreneur, passionate about making reading accessible to everyone.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mark Luther", 
      role: "Head of Content",
      description: "Curates our extensive book collection and works with publishers to bring you the best titles.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Brown",
      role: "UX Designer", 
      description: "Designs intuitive reading experiences that make digital books feel natural and enjoyable.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Alex Harmozi",
      role: "Engineering Lead",
      description: "Builds the technology that powers our platform and ensures a seamless reading experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setHeaderVisible(true);
    }, 300);

    teamMembers.forEach((_, index) => {
      const cardTimer = setTimeout(() => {
        setVisibleCards(prev => new Set([...prev, index]));
      }, 800 + (index * 200));
    });

    const observeElement = (element, callback, threshold = 0.2) => {
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
          rootMargin: '50px 0px -100px 0px'
        }
      );

      observer.observe(element);
      return observer;
    };

    const observers = [];

    const setupObservers = setTimeout(() => {
      setHeaderVisible(false);
      setVisibleCards(new Set());

      if (headerRef.current) {
        const headerObserver = observeElement(headerRef.current, () => {
          setTimeout(() => setHeaderVisible(true), 100);
        }, 0.3);
        if (headerObserver) observers.push(headerObserver);
      }

      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          const cardObserver = observeElement(cardRef, () => {
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, index]));
            }, index * 150 + 300);
          }, 0.25);
          if (cardObserver) observers.push(cardObserver);
        }
      });
    }, 100);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(setupObservers);
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const TeamCard = ({ member, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const isVisible = visibleCards.has(index);

    useEffect(() => {
      if (isVisible) {
        const detailsTimer = setTimeout(() => {
          setDetailsVisible(true);
        }, 400);

        return () => clearTimeout(detailsTimer);
      }
    }, [isVisible]);

    return (
      <div
        ref={el => cardRefs.current[index] = el}
        className={`
          bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100
          cursor-pointer overflow-hidden relative group
          transition-all duration-700 ease-out
          hover:shadow-2xl hover:-translate-y-2 hover:scale-105
          ${isVisible 
            ? 'translate-y-0 opacity-100 rotate-0' 
            : 'translate-y-8 opacity-0 rotate-1'
          }
        `}
        style={{ 
          transitionDelay: `${index * 100}ms`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className={`
            mb-6 transition-all duration-500 ease-out
            ${isVisible 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-4 opacity-0 scale-90'
            }
          `}
          style={{ transitionDelay: `${index * 150 + 200}ms` }}
          >
            <div className={`
              w-24 h-24 mx-auto rounded-full bg-gray-200 overflow-hidden
              transition-all duration-500 ease-out relative
              ${isHovered ? 'scale-110 shadow-xl ring-4 ring-purple-200' : 'scale-100'}
              ${isVisible ? 'rotate-0' : 'rotate-12'}
            `}>
              {!imageLoaded && (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              )}
              
              <img 
                src={member.image} 
                alt={member.name}
                className={`
                  w-full h-full object-cover transition-all duration-500
                  ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                  ${isHovered ? 'brightness-110 saturate-110' : 'brightness-100'}
                `}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              
              <div className={`
                absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent
                transition-opacity duration-300
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}></div>
            </div>

            <div className={`
              absolute top-2 right-8 w-2 h-2 bg-purple-300 rounded-full
              transition-all duration-500 animate-bounce
              ${isHovered ? 'opacity-60 scale-110' : 'opacity-0 scale-75'}
            `}
            style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
            <div className={`
              absolute bottom-2 left-8 w-1.5 h-1.5 bg-blue-300 rounded-full
              transition-all duration-700 animate-bounce
              ${isHovered ? 'opacity-40 scale-110' : 'opacity-0 scale-75'}
            `}
            style={{ animationDelay: `${index * 0.3 + 0.5}s` }}
            ></div>
          </div>

          <div className="space-y-3">
            <h3 className={`
              text-xl font-bold transition-all duration-500 ease-out
              ${isHovered ? 'text-purple-700 scale-105' : 'text-gray-900'}
              ${detailsVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-2 opacity-0'
              }
            `}
            style={{ transitionDelay: `${index * 150 + 400}ms` }}
            >
              {member.name}
            </h3>
            
            <p className={`
              text-purple-600 font-semibold text-sm transition-all duration-500 ease-out
              ${isHovered ? 'text-purple-700 scale-105' : 'text-purple-600'}
              ${detailsVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-3 opacity-0'
              }
            `}
            style={{ transitionDelay: `${index * 150 + 600}ms` }}
            >
              {member.role}
            </p>
            
            <p className={`
              text-gray-600 text-sm leading-relaxed transition-all duration-600 ease-out
              ${isHovered ? 'text-gray-700 scale-105' : 'text-gray-600'}
              ${detailsVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
              }
            `}
            style={{ transitionDelay: `${index * 150 + 800}ms` }}
            >
              {member.description}
            </p>
          </div>
        </div>

        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent
          transition-all duration-1000 ease-out pointer-events-none rounded-xl
          ${isHovered 
            ? 'translate-x-full opacity-20' 
            : '-translate-x-full opacity-0'
          }
        `}></div>

        <div className={`
          absolute top-3 right-3 w-1 h-1 bg-purple-400 rounded-full
          transition-all duration-500
          ${isHovered ? 'opacity-60 scale-150' : 'opacity-0 scale-100'}
        `}></div>
        <div className={`
          absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full
          transition-all duration-700
          ${isHovered ? 'opacity-40 scale-125' : 'opacity-0 scale-100'}
        `}
        style={{ transitionDelay: '200ms' }}
        ></div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-8 overflow-hidden relative">
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-200/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div 
        className={`
          text-center mb-16 transition-all duration-1000 ease-out
          ${headerVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-8 opacity-0 scale-95'
          }
        `}
        ref={headerRef}
      >
        <h1 className={`
          text-4xl font-bold text-gray-900 mb-4 relative
          bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 
          bg-clip-text text-transparent transition-all duration-700
          hover:scale-105 cursor-default
          ${headerVisible ? 'scale-100 rotate-0' : 'scale-90 rotate-1'}
        `}>
          Meet Our Team
          
          <div className={`
            absolute -bottom-1 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400
            transition-all duration-1000 ease-out
            ${headerVisible ? 'w-20 -translate-x-1/2 opacity-100' : 'w-0 -translate-x-1/2 opacity-0'}
          `}
          style={{ transitionDelay: '500ms' }}
          ></div>
        </h1>
        
        <p className={`
          text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 ease-out
          ${headerVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-4 opacity-0'
          }
        `}
        style={{ transitionDelay: '300ms' }}
        >
          The passionate people behind BookVerse who make it all possible
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <TeamCard 
            key={index} 
            member={member} 
            index={index}
          />
        ))}
      </div>

      <div className={`
        mt-12 flex justify-center space-x-2
        transition-all duration-1000 ease-out
        ${headerVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-4 opacity-0'
        }
      `}
      style={{ transitionDelay: '2000ms' }}
      >
        {teamMembers.map((_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full 
              animate-pulse transition-all duration-500 ease-out
              ${headerVisible ? 'scale-100 opacity-60' : 'scale-0 opacity-0'}
            `}
            style={{ 
              animationDelay: `${i * 0.3}s`,
              transitionDelay: `${2200 + i * 100}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MeetOurTeam;