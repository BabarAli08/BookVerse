import { useEffect, useState, useRef } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

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
  const booksPerView = isMobile ? 2 : (isPremium ? 4 : 5);

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
      console.log("Initial load - Setting books:", isPremium ? "premium" : "free");
      if (isPremium) {
        dispatch(setPremiumBooks(data));
      } else {
        dispatch(setFreeBooks(data));
      }
    } else {
      console.log("Fetching more books (append):", isPremium ? "premium" : "free");
      if (isPremium) {
        dispatch(fetchMorePremium(data));
      } else {
        dispatch(fetchMoreFree(data));
      }
    }
  }, [data, isPremium, dispatch]);

  // Check scroll position and update button visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    setShowLeftButton(scrollLeft > 0);
    // Always show right button - either for scrolling or loading more data
    setShowRightButton(true);
  };

  // Update button visibility when books change
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(checkScrollPosition, 100); // Small delay to ensure DOM is updated
    }
  }, [booksState.allBooks]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = isMobile ? 200 : 300;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'left') {
      container.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      // Check if we're at the end of current content
      const isAtEnd = currentScroll >= maxScroll - 10;
      
      if (isAtEnd && !loading) {
        // Load more books
        const newPage = booksState.page + 1;
        if (isPremium) {
          dispatch(setInitialPage(newPage));
        } else {
          dispatch(setFreePage(newPage));
        }
      } else {
        // Normal scroll
        container.scrollTo({
          left: Math.min(maxScroll, currentScroll + scrollAmount),
          behavior: 'smooth'
        });
      }
    }
  };

  const { allBooks } = booksState;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isPremium ? (
            <Crown className="text-purple-600" size={24} />
          ) : (
            <BookOpen className="text-green-600" size={24} />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p
              className={`text-sm ${
                isPremium ? "text-purple-600" : "text-green-600"
              } font-medium`}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!showLeftButton}
            className={`p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${
              showLeftButton ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={loading}
            className={`p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity opacity-100`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className={`
            flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth
            ${isMobile ? 'gap-4' : 'gap-6'}
          `}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: 'none'
          }}
        >
          {loading && allBooks.length === 0 ? (
            Array(booksPerView)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 max-w-xs">
                  <div className="w-full [&>*]:!w-full">
                    <LoaderCard3 />
                  </div>
                </div>
              ))
          ) : error ? (
            <div className="flex-shrink-0 w-full">
              <h1 className="bg-red-400 text-xl text-white p-4 rounded-md">
                No {isPremium ? "Premium" : "Free"} Books Available for this tier
              </h1>
            </div>
          ) : (
            <>
              {allBooks.map((book: book) => (
                <div key={book.id} className="flex-shrink-0">
                  {isPremium ? (
                    <PremiumBook book={book} />
                  ) : (
                    <BookCard book={book} />
                  )}
                </div>
              ))}

              {loading &&
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={`loader-${i}`} className="flex-shrink-0 w-48 h-64">
                      <LoaderCard3 />
                    </div>
                  ))}
            </>
          )}
        </div>
      </div>

      {import.meta.env.MODE === "development" && (
        <div className="mt-4 text-xs text-gray-500">
          Page: {booksState.page} | Total: {allBooks.length} | 
          Filters: {hasActiveFilters ? "Active" : "None"} |
          Loading: {loading ? "Yes" : "No"} | 
          Left Button: {showLeftButton ? "Show" : "Hide"}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BookCarousel;