import { useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import PremiumBook from "./PremiumBook";
import BookCard from "./FreeBooks";
import useFetchData from "../../Data/useFetchData";
import { LoaderCard3 } from "../../Component/Loading CardComponent";
import type { book } from "../../Data/Interfaces";
import {
  setFreeBooks,
  nextFreeBatch,
  prevFreeBatch,
  resetFreeBooks,
  setFreePage,
  fetchMore as fetchMoreFree,
} from "../../Store/FreeBookSlice";
import {
  setPremiumBooks,
  nextPremiumBatch,
  prevPremiumBatch,
  resetPremiumBooks,
  setInitialPage,
  fetchMore as fetchMorePremium,
} from "../../Store/PremiumBookSlice";
import type { RootState } from "../../Store/store";
import { DotsLoader } from "../../Component/Loading";

const BookCarousel = ({
  title,
  subtitle,
  isPremium = false,
}: {
  title: string;
  subtitle: string;
  isPremium?: boolean;
}) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.filteredBooks);

  const freeBooks = useSelector((state: RootState) => state.freeBooks);
  const premiumBooks = useSelector((state: RootState) => state.premiumBooks);

  const booksState = isPremium ? premiumBooks : freeBooks;
  const booksPerView = isPremium ? 4 : 5;

  // Check if filters are active
  const hasActiveFilters = filters.search.length > 0 || filters.category !== "All Tiers";
  
  // Set default pages based on filter status
  const getDefaultPage = () => {
    if (hasActiveFilters) {
      if(isPremium) return 2
      else return 1
      
    } else {
      return isPremium ? 10 : 1; // Premium: page 10, Free: page 1 when no filters
    }
  };

  // Reset books and set initial page when filters change
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

  // Handle data fetching with proper condition checks
  useEffect(() => {
    console.log('Data effect triggered:', { 
      hasData: !!data, 
      dataLength: data?.length, 
      currentBooks: booksState.allBooks.length,
      hasFilters: hasActiveFilters,
      page: booksState.page,
      isPremium 
    });
    
    if (!data || data.length === 0) return;

    const currentBooksLength = booksState.allBooks.length;
    
    // Determine if this is initial load
    const isInitialLoad = currentBooksLength === 0;
    
    if (isInitialLoad) {
      console.log('Initial load - Setting books:', isPremium ? 'premium' : 'free');
      // Set new books (initial load)
      if (isPremium) {
        dispatch(setPremiumBooks(data));
      } else {
        dispatch(setFreeBooks(data));
      }
    } else {
      console.log('Fetching more books (append):', isPremium ? 'premium' : 'free');
      // Append books for pagination
      if (isPremium) {
        dispatch(fetchMorePremium(data));
      } else {
        dispatch(fetchMoreFree(data));
      }
    }
  }, [data, isPremium, dispatch]);

  const nextSlide = () => {
    const totalLoaded = booksState.allBooks.length;
    const currentIndex = booksState.currentIndex;
    const nextIndex = currentIndex + booksPerView;

    console.log('Next slide clicked:', {
      totalLoaded,
      currentIndex,
      nextIndex,
      booksPerView,
      loading,
      willNeedMoreData: nextIndex >= totalLoaded
    });

    // First, move to next batch
    if (isPremium) {
      dispatch(nextPremiumBatch());
    } else {
      dispatch(nextFreeBatch());
    }

    // Then check if we need to fetch more data (but don't block navigation)
    if (nextIndex >= totalLoaded) {
      console.log('Need to fetch more data, incrementing page...');
      const newPage = booksState.page + 1;
      if (isPremium) {
        dispatch(setInitialPage(newPage));
      } else {
        dispatch(setFreePage(newPage));
      }
    }
  };

  const prevSlide = () => {
    if (isPremium) {
      dispatch(prevPremiumBatch());
    } else {
      dispatch(prevFreeBatch());
    }
  };

  const { displayedBooks, allBooks, currentIndex } = booksState;

  // Check if next button should be disabled
  const isNextDisabled = loading && allBooks.length === 0; // Only disable if loading AND no books
  const isPrevDisabled = (loading && allBooks.length === 0) || currentIndex === 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
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
            onClick={prevSlide}
            disabled={isPrevDisabled}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            disabled={isNextDisabled}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Books */}
      <div className="flex gap-6 overflow-hidden">
        {loading && allBooks.length === 0 ? (
          // Only show loading spinner on initial load (no books exist)
          Array(booksPerView)
            .fill(0)
            .map((_, i) => <LoaderCard3 key={i} />)
        ) : error ? (
          <h1 className="bg-red-400 text-xl text-white p-4 rounded-md">
            No {isPremium ? "Premium" : "Free"} Books Available for this tier
          </h1>
        ) : (
          // Always show books if they exist, even while loading more
          displayedBooks.map((book: book) =>
            isPremium ? (
              <PremiumBook key={book.id} book={book} />
            ) : (
              <BookCard key={book.id} book={book} />
            )
          )
        )}
        
        
        {loading && allBooks.length > 0 && ( // Check if loading and if there are already books displayed
          <div className="flex items-center justify-center min-w-[200px]">
            <div className="text-gray-500 text-lg mt-1">{<DotsLoader/>}</div>
          </div>
        )}
      </div>
      
     
      {import.meta.env.MODE === 'development' && (
        <div className="mt-4 text-xs text-gray-500">
          Page: {booksState.page} | Total: {allBooks.length} | 
          Current: {currentIndex} | Filters: {hasActiveFilters ? 'Active' : 'None'} |
          Loading: {loading ? 'Yes' : 'No'} | Displayed: {displayedBooks.length}
        </div>
      )}
    </div>
  );
};

export default BookCarousel;