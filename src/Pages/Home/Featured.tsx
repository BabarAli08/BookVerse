import FeaturedBookCard from "../../Component/FeaturedBookCard";
import useFetchData from "../../Data/useFetchData";
import { SkeletonBookCard } from "../../Component/Loading";
import type { book } from "../../Data/Interfaces";
import { useNavigate } from "react-router";
import { useMemo, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { RootState } from "../../Store/store";
import { setBooks } from "../../Store/FeaturedBooksSlice";
import { useDispatch, useSelector } from "react-redux";

const Featured = () => {
  const page = useMemo(() => Math.floor(Math.random() * 10), []);
  const dispatch = useDispatch();
  const { books } = useSelector((state: RootState) => state.featuredBooks);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const {
    data: ShowcaseBooks,
    loading,
    error,
  } = useFetchData(
    books.length === 0
      ? { url: "https://gutendex.com/books", page }
      : { url: "", page: 0 } 
  );

  useEffect(() => {
    if (ShowcaseBooks && books.length === 0) {
      dispatch(setBooks(ShowcaseBooks));
    }
  }, [ShowcaseBooks, books.length, dispatch]);

  const navigate = useNavigate();

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

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateY: -15
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: index * 0.1,
        duration: 0.8
      }
    })
  };

  const skeletonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    })
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            variants={floatingVariants}
            animate="animate"
            className="absolute opacity-5"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
          >
            <div className="w-12 h-16 bg-gradient-to-b from-blue-200 to-purple-200 rounded transform rotate-12 shadow-sm">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-300 rounded-l opacity-60"></div>
            </div>
          </motion.div>
        ))}

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4'
              } 0%, transparent 70%)`,
              right: `${10 + i * 25}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto">
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={headerVariants}
            className="relative inline-block"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 relative z-10"
              style={{
                background: "linear-gradient(135deg, #1f2937 0%, #3b82f6 50%, #8b5cf6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              Featured Books
            </motion.h1>
            
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { width: "200px", opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>

          <motion.p 
            variants={subtitleVariants}
            className="text-gray-600 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
          >
            Discover our handpicked selection of the most captivating reads that will transport you to new worlds
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center mt-6"
          >
            <div className="flex items-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
            
            {loading && books.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  variants={skeletonVariants}
                  custom={i}
                  className="w-full max-w-sm"
                >
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  >
                    <SkeletonBookCard />
                  </motion.div>
                </motion.div>
              ))}

            {books.slice(0, 3).map((book: book, i: number) => (
              <motion.div 
                key={book.id} 
                variants={cardVariants}
                custom={i}
                className="w-full max-w-sm group"
                whileHover={{ 
                  y: -10,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }
                }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  style={{ perspective: "1000px" }}
                >
                  {/* Card glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 blur group-hover:opacity-20 transition-opacity duration-300"
                  />
                  
                  <div className="relative">
                    <FeaturedBookCard
                      book={book}
                      onClick={() => navigate(`/books/${book.id}`)}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {books.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center mt-16"
            >
              <motion.button
                onClick={() => navigate('/books')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Explore All Books</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <motion.div
                  className="absolute top-1 right-3 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-red-500 text-lg mb-4">
              Oops! Something went wrong while loading featured books.
            </div>
            <motion.button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Featured;