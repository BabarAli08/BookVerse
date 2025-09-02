import { useDispatch, useSelector } from "react-redux";
import FreeCard from "./FreeCard";
import type { RootState } from "../../Store/store";
import { useNavigate } from "react-router";
import { setPlan } from "../../Store/PaymentSlice";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface cardState {
  yes: string[];
  no: string[];
  title: string;
  name: string;
  price: string;
  yearly: boolean;
  onClick?: () => void;
  color: string;
  heading: string;
  priceTitle: string;
}

const Pricing = () => {
  const { prices, Yearly } = useSelector((state: RootState) => state.prices);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  
  const navigate = useNavigate();
  const handlePayment = (plan: cardState) => {
    const originalPrice = parseFloat(plan.price.replace("$", ""));
    const taxed_price = originalPrice * 1.08;

    dispatch(setPlan({ ...plan, price: String(taxed_price) }));
    navigate("/checkout");
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.4, 0.4, 0]);

  const cards = [
    {
      yes: [
        "Access to 1,000+ free books",
        "Basic reading features",
        "Mobile app access",
        "Community discussions",
      ],
      no: [
        "Limited book selection",
        "Ads between chapters",
        "No offline downloads",
        "No premium features",
      ],
      name: "free",
      yearly: Yearly,
      title: "Get Started Free",
      price: prices.free,
      color: "gray",
      heading: "Perfect for casual readers",
      priceTitle: "Free",
    },
    {
      yes: [
        "Access to 50,000+ books",
        "Ad-free reading experience",
        "Unlimited offline downloads",
        "Premium reading features",
        "Audiobook access (5 per month)",
        "Priority customer support",
        "Reading analytics & insights",
        "Text highlighting & notes",
      ],
      no: [],
      name: "premium",
      title: "Go Premium",
      yearly: Yearly,
      price: prices.premium,
      color: "purple",
      heading: "For avid readers who want more",
      priceTitle: "Premium",
    },
    {
      yes: [
        "Everything in Premium",
        "Unlimited audiobook access",
        "Early access to new releases",
        "Exclusive author content",
        "Advanced AI recommendations",
        "Multi-device sync",
        "Family sharing (up to 6 members)",
        "Personal reading coach",
        "Advanced highlighting & annotations",
        "Export notes & highlights",
      ],
      no: [],
      yearly: Yearly,
      name: "ultimate",
      title: "Choose Ultimate",
      price: prices.ultimate,
      color: "yellow",
      heading: "The complete reading experience",
      priceTitle: "Ultimate",
    },
  ];

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
    },
  };

 
  const getCardColor = (color: string) => {
    switch (color) {
      case 'gray':
        return {
          bg: 'from-gray-100 to-gray-200',
          glow: 'rgba(107, 114, 128, 0.3)',
          particle: 'bg-gray-400'
        };
      case 'purple':
        return {
          bg: 'from-purple-100 to-purple-200',
          glow: 'rgba(147, 51, 234, 0.4)',
          particle: 'bg-purple-400'
        };
      case 'yellow':
        return {
          bg: 'from-yellow-100 to-yellow-200',
          glow: 'rgba(251, 191, 36, 0.4)',
          particle: 'bg-yellow-400'
        };
      default:
        return {
          bg: 'from-blue-100 to-blue-200',
          glow: 'rgba(59, 130, 246, 0.3)',
          particle: 'bg-blue-400'
        };
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden px-4 py-12"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      
      <div className="absolute inset-0 pointer-events-none">
       
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-yellow-50/30"
          style={{ 
            y: backgroundY,
            opacity: backgroundOpacity 
          }}
        />

        
        <motion.div
          className="absolute top-16 left-8 text-6xl text-green-200 font-bold select-none opacity-20"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ 
            scale: isInView ? 1 : 0,
            rotate: isInView ? 0 : -45,
          }}
          transition={{ 
            delay: 0.5, 
            duration: 0.6,
            type: "spring",
            damping: 15 
          }}
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          $
        </motion.div>

        <motion.div
          className="absolute top-32 right-12 text-4xl text-purple-200 font-bold select-none opacity-20"
          initial={{ scale: 0, rotate: 45 }}
          animate={{ 
            scale: isInView ? 1 : 0,
            rotate: isInView ? 0 : 45,
          }}
          transition={{ 
            delay: 0.8, 
            duration: 0.6,
            type: "spring",
            damping: 15 
          }}
          animate={{
            rotate: [0, -8, 8, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          €
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-16 text-5xl text-yellow-200 font-bold select-none opacity-20"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ 
            scale: isInView ? 1 : 0,
            rotate: isInView ? 0 : -30,
          }}
          transition={{ 
            delay: 1.1, 
            duration: 0.6,
            type: "spring",
            damping: 15 
          }}
          animate={{
            rotate: [0, 3, -3, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          ¥
        </motion.div>

        
        <motion.div
          className="absolute top-24 right-32 w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-32 right-20 w-8 h-8 bg-gradient-to-br from-green-200 to-green-300 rounded-lg opacity-20 rotate-45"
          animate={{
            y: [0, -20, 0],
            rotate: [45, 225, 405],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-6 p-8 w-full relative z-10" style={{ overflowX: 'visible' }}>
        {cards.map((card, i) => {
          const cardColors = getCardColor(card.color);
          
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              custom={i}
              whileHover={{
                scale: 1.02,
                y: -4,
                transition: { 
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 } 
              }}
              className="relative"
            >
             <motion.div
                className="relative"
              >
               
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${cardColors.bg} rounded-2xl opacity-0 blur-md`}
                  whileHover={{
                    opacity: 0.3,
                    transition: { duration: 0.2 }
                  }}
                />

                
                {card.name === 'premium' && (
                  <>
                   
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      <motion.div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 4px 15px rgba(147, 51, 234, 0.3)",
                            "0 6px 20px rgba(147, 51, 234, 0.4)",
                            "0 4px 15px rgba(147, 51, 234, 0.3)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Most Popular
                      </motion.div>
                    </motion.div>

                   
                    {[...Array(6)].map((_, sparkleIndex) => (
                      <motion.div
                        key={`sparkle-${sparkleIndex}`}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full"
                        style={{
                          top: `${10 + Math.cos(sparkleIndex * 60 * Math.PI / 180) * 40}%`,
                          left: `${50 + Math.sin(sparkleIndex * 60 * Math.PI / 180) * 45}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: sparkleIndex * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </>
                )}

                <motion.div
                  key={`${Yearly}-${card.price}`}
                  className="absolute inset-0 pointer-events-none"
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${cardColors.bg} opacity-30`} />
                </motion.div>

             
                <FreeCard 
                  {...card} 
                  onClick={() => {
                    
                    handlePayment(card);
                  }} 
                />

                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(4)].map((_, particleIndex) => (
                    <motion.div
                      key={`hover-particle-${particleIndex}`}
                      className={`absolute w-1 h-1 ${cardColors.particle} rounded-full`}
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: particleIndex * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="flex justify-center mt-8 space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        {cards.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === 1 ? 'bg-purple-400' : 'bg-gray-300'
            }`}
            animate={{
              scale: index === 1 ? [1, 1.2, 1] : 1,
              opacity: index === 1 ? [0.7, 1, 0.7] : 0.5,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Pricing;