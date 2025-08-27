import { use, useEffect, useState } from "react";
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
  const booksPerView = isPremium ? 4 : 5;

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

  const nextSlide = () => {
    const totalLoaded = booksState.allBooks.length;
    const currentIndex = booksState.currentIndex;
    const nextIndex = currentIndex + booksPerView;

    console.log("Next slide clicked:", {
      totalLoaded,
      currentIndex,
      nextIndex,
      booksPerView,
      loading,
      willNeedMoreData: nextIndex >= totalLoaded,
    });

    if (isPremium) {
      dispatch(nextPremiumBatch());
    } else {
      dispatch(nextFreeBatch());
    }

    if (nextIndex >= totalLoaded) {
      console.log("Need to fetch more data, incrementing page...");
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

  const isNextDisabled = loading && allBooks.length === 0;
  const isPrevDisabled =
    (loading && allBooks.length === 0) || currentIndex === 0;

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
      {!isMobile && (
        <div className="flex gap-6 overflow-hidden">
          {loading && allBooks.length === 0 ? (
            Array(booksPerView)
              .fill(0)
              .map((_, i) => <LoaderCard3 key={i} />)
          ) : error ? (
            <h1 className="bg-red-400 text-xl text-white p-4 rounded-md">
              No {isPremium ? "Premium" : "Free"} Books Available for this tier
            </h1>
          ) : (
            <>
              {displayedBooks.map((book: book) =>
                isPremium ? (
                  <PremiumBook key={book.id} book={book} />
                ) : (
                  <BookCard key={book.id} book={book} />
                )
              )}

              {loading &&
                Array(booksPerView)
                  .fill(0)
                  .map((_, i) => <LoaderCard3 key={`loader-${i}`} />)}
            </>
          )}
        </div>
      )}
      {isMobile&&(
        <div className="grid grid-cols-2 gap-6 overflow-hidden">
          {loading && allBooks.length === 0 ? (
            Array(booksPerView)
              .fill(0)
              .map((_, i) => <LoaderCard3 key={i} />)
          ) : error ? (
            <h1 className="bg-red-400 text-xl text-white p-4 rounded-md">
              No {isPremium ? "Premium" : "Free"} Books Available for this tier
            </h1>
          ) : (
            <>
              {displayedBooks.map((book: book) =>
                isPremium ? (
                  <PremiumBook key={book.id} book={book} />
                ) : (
                  <BookCard key={book.id} book={book} />
                )
              )}

              {loading &&
                Array(booksPerView)
                  .fill(0)
                  .map((_, i) => <LoaderCard3 key={`loader-${i}`} />)}
            </>
          )}
        </div>
      )}

      {import.meta.env.MODE === "development" && (
        <div className="mt-4 text-xs text-gray-500">
          Page: {booksState.page} | Total: {allBooks.length} | Current:{" "}
          {currentIndex} | Filters: {hasActiveFilters ? "Active" : "None"} |
          Loading: {loading ? "Yes" : "No"} | Displayed: {displayedBooks.length}
        </div>
      )}
    </div>
  );
};

export default BookCarousel;
