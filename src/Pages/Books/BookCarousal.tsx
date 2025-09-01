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
import { LoaderCard3Enhanced } from "../../Component/Loading CardComponent";
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
  const [loadingId, setLoadingId] = useState<string>("");
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

 
  useEffect(() => {
    if (loading) {
      setLoadingId(`loading-${isPremium ? 'premium' : 'free'}-${Date.now()}`);
    }
  }, [loading, isPremium]);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setShowLeftButton(scrollLeft > 10);
    setShowRightButton(scrollLeft < maxScrollLeft - 10);
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
  };

  const loadingVariants:any = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8"
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
            className={`relative p-3 rounded-2xl shadow-lg ${
              isPremium
                ? "bg-gradient-to-br from-purple-100 to-purple-50"
                : "bg-gradient-to-br from-blue-100 to-blue-50"
            }`}
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
                <BookOpen className="text-blue-600 relative z-10" size={28} />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles
                    className="absolute -top-1 -right-1 text-blue-400"
                    size={16}
                  />
                </motion.div>
              </>
            )}
          </motion.div>

          <div className="space-y-1">
            <motion.h2
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
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
                    : "from-blue-400 to-cyan-400"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  isPremium ? "text-purple-600" : "text-blue-600"
                }`}
              >
                {subtitle}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showLeftButton && (
              <motion.button
                onClick={() => scroll("left")}
                disabled={!showLeftButton || isScrolling}
                className={`
                  relative p-3 rounded-full backdrop-blur-sm transition-all duration-300
                  ${isPremium
                    ? "bg-purple-50/80 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 text-purple-600"
                    : "bg-blue-50/80 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                `}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => scroll("right")}
            disabled={loading || isScrolling}
            className={`
              relative p-3 rounded-full backdrop-blur-sm transition-all duration-300
              ${isPremium
                ? "bg-purple-50/80 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 text-purple-600"
                : "bg-blue-50/80 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600"
              }
              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
            `}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                rotate: loading ? 360 : 0,
              }}
              transition={{
                rotate: { duration: 1, repeat: loading ? Infinity : 0, ease: "linear" },
              }}
            >
              <ChevronRight size={20} />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
      
        <AnimatePresence>
          {showLeftButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent"
            />
          )}
          {showRightButton && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent"
            />
          )}
        </AnimatePresence>

        <motion.div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className={`
            flex overflow-x-auto scrollbar-hide scroll-smooth
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
         
          {loading && allBooks.length === 0 ? (
            Array(booksPerView)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={`initial-loader-${isPremium ? 'premium' : 'free'}-${i}`}
                  className="flex-shrink-0 w-48 max-w-xs"
                  variants={loadingVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`
                    p-4 rounded-2xl shadow-lg border-2 transition-all duration-300
                    ${isPremium 
                      ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                    }
                  `}>
                    <LoaderCard3Enhanced />
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
                  relative overflow-hidden rounded-2xl p-8 text-center shadow-xl border-2
                  ${isPremium
                    ? "bg-gradient-to-br from-red-50 to-purple-50 border-red-200"
                    : "bg-gradient-to-br from-red-50 to-blue-50 border-red-200"
                  }
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
                <h3 className="relative text-xl font-bold text-red-600 mb-2">
                  Unable to Load Books
                </h3>
                <p className="relative text-red-500">
                  No {isPremium ? "Premium" : "Free"} books available for this tier
                </p>
              </motion.div>
            </motion.div>
          ) : (
          
            <>
                {allBooks.map((book: book, index: number) => (
                <motion.div
                  key={`book-${book.id}-${isPremium ? 'premium' : 'free'}`}
                  className="flex-shrink-0"
                  variants={bookItemVariants}
                  initial="hidden"
                  animate="visible"
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
                        ${isPremium ? "bg-purple-200" : "bg-blue-200"}
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
                {loading && allBooks.length > 0 &&
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={`${loadingId}-${i}`}
                        className="flex-shrink-0 w-48"
                        variants={loadingVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: i * 0.1 }}
                      >
                        <motion.div
                          className={`
                            relative p-4 rounded-2xl shadow-lg border-2 transition-all duration-300
                            ${isPremium 
                              ? 'bg-gradient-to-br from-purple-50/80 to-purple-100/80 border-purple-200/50' 
                              : 'bg-gradient-to-br from-blue-50/80 to-blue-100/80 border-blue-200/50'
                            }
                            backdrop-blur-sm
                          `}
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
                          <LoaderCard3Enhanced />
                          
                         
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-2xl"
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
        
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
        
        button:focus-visible {
          outline: 2px solid ${isPremium ? "#a855f7" : "#3b82f6"};
          outline-offset: 2px;
        }
      `}</style>
    </motion.div>
  );
};

export default BookCarousel;