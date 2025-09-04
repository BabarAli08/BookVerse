import WhiteButton from '../../Component/WhiteButton';
import TransparentButton from '../../Component/TransparentButton';
import { useNavigate } from 'react-router';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Users, Zap, ArrowRight } from 'lucide-react';

const JoinSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: (index: number) => ({
      y: [-10, 10, -10],
      x: [0, 5, 0],
      rotate: [-2, 2, -2],
      transition: {
        duration: 3 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.3
      }
    })
  };

  return (
    <div className="relative w-full min-h-[40vh] py-20 px-4 overflow-hidden">
      
     
      <motion.div 
        className="absolute inset-0"
        initial={{ 
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
        }}
        animate={{
          background: [
            "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
            "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {[BookOpen, Users, Zap].map((Icon, index) => (
          <motion.div
            key={index}
            variants={floatingVariants}
            animate="animate"
            custom={index}
            className="absolute opacity-10"
            style={{
              left: `${15 + index * 30}%`,
              top: `${20 + (index % 2) * 40}%`,
            }}
          >
            <Icon size={60} className="text-white" />
          </motion.div>
        ))}

        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
              right: `${10 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}

        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 400,
            }}
            animate={{
              y: [Math.random() * 400, -50],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth + (Math.random() - 0.5) * 100
              ],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

   
      <motion.div
        ref={sectionRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto"
      >
        
        <motion.div
          variants={itemVariants}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">Join 100,000+ Happy Readers</span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center mb-8 max-w-4xl"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            Ready to Start Your{' '}
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: "linear-gradient(90deg, #ffffff, #fbbf24, #f59e0b, #ffffff)",
                backgroundSize: "300% 300%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              Reading Journey
            </motion.span>
            ?
          </motion.h1>
          
          <motion.p 
            className="text-white/90 text-xl md:text-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Join thousands of readers who have discovered their next favorite book with{' '}
            <span className="font-semibold text-yellow-300">BookVerse</span>
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl"
        >
          {[
            { icon: BookOpen, title: "50,000+ Books", desc: "Endless stories await" },
            { icon: Users, title: "Global Community", desc: "Connect with readers" },
            { icon: Zap, title: "Instant Access", desc: "Read anywhere, anytime" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center group cursor-pointer"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        
        <motion.div
          variants={buttonContainerVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg"
        >
          <motion.div
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-xs sm:w-auto flex justify-center"
          >
            <div className="relative group w-full sm:w-auto flex justify-center">
              <WhiteButton 
                title="Start Reading Free" 
                onClick={() => navigate('/signup')}
              />
              
              <motion.div
                className="absolute -inset-1 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"
                whileHover={{ scale: 1.1 }}
              />
            </div>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-xs sm:w-auto flex justify-center"
          >
            <div className="relative group w-full sm:w-auto flex justify-center">
              <TransparentButton 
                title="Go Premium" 
                onClick={() => navigate('/premium')}
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={16} className="text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-white/70 text-sm">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JoinSection;