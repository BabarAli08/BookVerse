import { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PremiumBook from "./PremiumBook";
import BookCard from "./FreeBooks";
import useFetchData from "../../Data/useFetchData";
import { LoaderCard3 } from "../../Component/Loading CardComponent";
import type { book } from "../../Data/Interfaces";
import {
  setFreeBooks,
  resetFreeBooks,
  setFreePage,
  fetchMore as fetchMoreFree,
} from "../../Store/FreeBookSlice";
import {
  setPremiumBooks,
  resetPremiumBooks,
  setInitialPage,
  fetchMore as fetchMorePremium,
} from "../../Store/PremiumBookSlice";
import type { RootState } from "../../Store/store";

const BookCarousel = ({
  title,
  subtitle,
  isPremium = false,
}: {
  title: string;
  subtitle: string;
  isPremium?: boolean;
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.filteredBooks);

  const freeBooks = useSelector((state: RootState) => state.freeBooks);
  const premiumBooks = useSelector((state: RootState) => state.premiumBooks);

  const booksState = isPremium ? premiumBooks : freeBooks;
  const booksPerView = isMobile ? 2 : isPremium ? 4 : 5;

  const hasActiveFilters =
    filters.search.length > 0 || filters.category !== "All Tiers";

  const getDefaultPage = () => {
    if (hasActiveFilters) {
      if (isPremium) return 2;
      else return 1;
    } else {
      return isPremium ? 10 : 1;
    }
  };

  useEffect(() => {
    const defaultPage = getDefaultPage();

    if (isPremium) {
      dispatch(resetPremiumBooks());
      dispatch(setInitialPage(defaultPage));
    } else {
      dispatch(resetFreeBooks());
      dispatch(setFreePage(defaultPage));
    }
  }, [filters.search, filters.category, isPremium, dispatch]);

  const { data, error, loading } = useFetchData({
    url: "https://gutendex.com/books",
    page: booksState.page,
  });

  useEffect(() => {
    console.log("Data effect triggered:", {
      hasData: !!data,
      dataLength: data?.length,
      currentBooks: booksState.allBooks.length,
      hasFilters: hasActiveFilters,
      page: booksState.page,
      isPremium,
    });

    if (!data || data.length === 0) return;

    const currentBooksLength = booksState.allBooks.length;
    const isInitialLoad = currentBooksLength === 0;

    if (isInitialLoad) {
      console.log(
        "Initial load - Setting books:",
        isPremium ? "premium" : "free"
      );
      if (isPremium) {
        dispatch(setPremiumBooks(data));
      } else {
        dispatch(setFreeBooks(data));
      }
    } else {
      console.log(
        "Fetching more books (append):",
        isPremium ? "premium" : "free"
      );
      if (isPremium) {
        dispatch(fetchMorePremium(data));
      } else {
        dispatch(fetchMoreFree(data));
      }
    }
  }, [data, isPremium, dispatch]);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setShowLeftButton(scrollLeft > 0);
  
    setShowRightButton(true);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(checkScrollPosition, 100); 
    }
  }, [booksState.allBooks]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 300);

    const container = scrollContainerRef.current;
    const scrollAmount = isMobile ? 200 : 300;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === "left") {
      container.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: "smooth",
      });
    } else {
      
      const isAtEnd = currentScroll >= maxScroll - 10;

      if (isAtEnd && !loading) {
        
        const newPage = booksState.page + 1;
        if (isPremium) {
          dispatch(setInitialPage(newPage));
        } else {
          dispatch(setFreePage(newPage));
        }
      } else {
     
        container.scrollTo({
          left: Math.min(maxScroll, currentScroll + scrollAmount),
          behavior: "smooth",
        });
      }
    }
  };

  const { allBooks } = booksState;

  const containerVariants:any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants:any = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants:any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  const bookItemVariants:any = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  const loadingVariants:any = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
     
      <motion.div
        className="flex items-center justify-between mb-8"
        variants={headerVariants}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className={`relative p-3 rounded-2xl ${
              isPremium
                ? "bg-gradient-to-br from-purple-100 to-purple-50 shadow-purple-100"
                : "bg-gradient-to-br from-green-100 to-green-50 shadow-green-100"
            } shadow-lg`}
            whileHover={{
              scale: 1.05,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 },
            }}
          >
            {isPremium ? (
              <>
                <Crown className="text-purple-600 relative z-10" size={28} />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </>
            ) : (
              <>
                <BookOpen className="text-green-600 relative z-10" size={28} />
                <Sparkles
                  className="absolute -top-1 -right-1 text-green-400"
                  size={16}
                />
              </>
            )}
          </motion.div>

          <div className="space-y-1">
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {title}
            </motion.h2>
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div
                className={`h-1 w-12 rounded-full bg-gradient-to-r ${
                  isPremium
                    ? "from-purple-400 to-pink-400"
                    : "from-green-400 to-emerald-400"
                }`}
              />
              <p
                className={`text-sm font-semibold ${
                  isPremium ? "text-purple-600" : "text-green-600"
                }`}
              >
                {subtitle}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showLeftButton && (
              <motion.button
                onClick={() => scroll("left")}
                disabled={!showLeftButton}
                className={`
                  relative p-3 rounded-full border-2 backdrop-blur-sm
                  ${
                    isPremium
                      ? "border-purple-200 bg-purple-50/80 hover:bg-purple-100/90 hover:border-purple-300 shadow-purple-100"
                      : "border-green-200 bg-green-50/80 hover:bg-green-100/90 hover:border-green-300 shadow-green-100"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  group overflow-hidden
                `}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`absolute inset-0 ${
                    isPremium ? "bg-purple-200" : "bg-green-200"
                  } opacity-0 group-hover:opacity-20`}
                  initial={false}
                  animate={{ scale: isScrolling ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <ChevronLeft
                  size={22}
                  className={`relative z-10 ${
                    isPremium ? "text-purple-600" : "text-green-600"
                  } group-hover:text-opacity-80`}
                />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => scroll("right")}
            disabled={loading}
            className={`
              relative p-3 rounded-full border-2 backdrop-blur-sm
              ${
                isPremium
                  ? "border-purple-200 bg-purple-50/80 hover:bg-purple-100/90 hover:border-purple-300 shadow-purple-100"
                  : "border-green-200 bg-green-50/80 hover:bg-green-100/90 hover:border-green-300 shadow-green-100"
              }
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-200 shadow-lg hover:shadow-xl
              group overflow-hidden
            `}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`absolute inset-0 ${
                isPremium ? "bg-purple-200" : "bg-green-200"
              } opacity-0 group-hover:opacity-20`}
              initial={false}
              animate={{ scale: isScrolling ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              animate={{
                rotate: loading ? 360 : 0,
                x: isScrolling ? [0, 3, 0] : 0,
              }}
              transition={{
                rotate: { duration: 1, repeat: loading ? Infinity : 0 },
                x: { duration: 0.3 },
              }}
            >
              <ChevronRight
                size={22}
                className={`relative z-10 ${
                  isPremium ? "text-purple-600" : "text-green-600"
                } group-hover:text-opacity-80`}
              />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Carousel Container */}
      <motion.div
        className="relative group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >

        <div
          className={`
          absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none
          bg-gradient-to-r from-white via-white/80 to-transparent
          ${showLeftButton ? "opacity-100" : "opacity-0"}
          transition-opacity duration-300
        `}
        />
        <div
          className={`
          absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none
          bg-gradient-to-l from-white via-white/80 to-transparent
          ${showRightButton && !loading ? "opacity-100" : "opacity-0"}
          transition-opacity duration-300
        `}
        />

        <motion.div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className={`
            flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth
            ${isMobile ? "gap-4 pb-4" : "gap-6 pb-6"}
            px-2
          `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none", 
            WebkitOverflowScrolling: "touch", 
          }}
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {loading && allBooks.length === 0 ? (
        
              Array(booksPerView)
                .fill(0)
                .map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-shrink-0 w-48 max-w-xs"
                    variants={loadingVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-full [&>*]:!w-full">
                      <LoaderCard3 />
                    </div>
                  </motion.div>
                ))
            ) : error ? (
          
              <motion.div
                className="flex-shrink-0 w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className={`
                    relative overflow-hidden rounded-2xl p-6 text-center
                    ${
                      isPremium
                        ? "bg-gradient-to-br from-red-50 to-purple-50 border-2 border-red-200"
                        : "bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200"
                    }
                    shadow-lg
                  `}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <h1 className="relative text-xl font-bold text-red-600">
                    No {isPremium ? "Premium" : "Free"} Books Available for this
                    tier
                  </h1>
                </motion.div>
              </motion.div>
            ) : (
            
              <>
                {allBooks.map((book: book, index: number) => (
                  <motion.div
                    key={book.id}
                    className="flex-shrink-0"
                    variants={bookItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                     
                      <motion.div
                        className={`
                          absolute -inset-2 rounded-2xl opacity-0 blur-xl
                          ${isPremium ? "bg-purple-200" : "bg-green-200"}
                        `}
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative">
                        {isPremium ? (
                          <PremiumBook book={book} />
                        ) : (
                          <BookCard book={book} />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}

             
                <AnimatePresence>
                  {loading &&
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <motion.div
                          key={`loader-${i}`}
                          className="flex-shrink-0 w-48 h-64"
                          variants={loadingVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ delay: i * 0.1 }}
                        >
                          <motion.div
                            className="relative h-full"
                            animate={{
                              opacity: [0.7, 1, 0.7],
                              scale: [0.98, 1, 0.98],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.2,
                            }}
                          >
                            <LoaderCard3 />
                      
                            <motion.div
                              className={`
                                absolute inset-0 rounded-xl
                                bg-gradient-to-r from-transparent via-white/40 to-transparent
                              `}
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.3,
                              }}
                            />
                          </motion.div>
                        </motion.div>
                      ))}
                </AnimatePresence>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scroll behavior enhancement */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
        
        /* Better focus states */
        button:focus-visible {
          outline: 2px solid ${isPremium ? "#a855f7" : "#10b981"};
          outline-offset: 2px;
        }
      `}</style>
    </motion.div>
  );
};

export default BookCarousel;
