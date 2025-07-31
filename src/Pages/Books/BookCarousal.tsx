import { useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Crown } from "lucide-react";

import PremiumBook from "./PremiumBook";
import BookCard from "./FreeBooks";
import useFetchData from "../../Data/useFetchData";
import { SpinningBookLoader } from "../../Component/Loading";
import type { book } from "../../Data/Interfaces";
import {
  setFreeBooks,
  nextFreeBatch,
  prevFreeBatch,
  resetFreeBooks,
  
} from "../../Store/FreeBookSlice";
import {
  setPremiumBooks,
  nextPremiumBatch,
  prevPremiumBatch,
  setInitialPage,
  resetPremiumBooks,
} from "../../Store/PremiumBookSlice";
import {
  useDispatch,
  useSelector,
} from "react-redux";
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
  const dispatch = useDispatch();

  const {filters}=useSelector((state:RootState)=>state.filteredBooks)

      const freeBooks = useSelector((state: RootState) => state.freeBooks);
  const premiumBooks = useSelector((state: RootState) => state.premiumBooks);

  const { displayedBooks, allBooks, currentIndex } = (isPremium
    ? premiumBooks
    : freeBooks) || {
    displayedBooks: [],
    allBooks: [],
    currentIndex: 0,
  };
  const bookState = useSelector((state: RootState) =>
    isPremium ? state.premiumBooks : state.freeBooks
  );

  const page = bookState?.page ?? 1;

  const booksPerView = isPremium ? 4 : 5;


  const { data, error, loading } = useFetchData({
    url: "https://gutendex.com/books",
    page: page,
    
  });

  useEffect(() => {
  if (isPremium) {
    let defaultPage:number;

    if(filters.search.length>0 || filters.category !=="All Tiers"){
      defaultPage=2
    }
    else{
      defaultPage=10
    }

    dispatch(setInitialPage(defaultPage));
  }
}, [filters.category, dispatch, isPremium]);
  useEffect(() => {
    
    if (data && data.length > 0) {
      if (isPremium) {
        if(filters.search.length>0 || filters.category!== "All Tiers"){
          dispatch(resetPremiumBooks())
          dispatch(setPremiumBooks([...data]));
          
        }
        else{

          dispatch(setPremiumBooks(data))
        }
        
      } else {
        if(filters.search.length>0){
          
          dispatch(resetFreeBooks())
         
          dispatch(setFreeBooks([...data]))
          console.log("Updated displayedBooks", freeBooks.displayedBooks);
        }
        else{
          dispatch(setFreeBooks(data))
        }
      }

    }
  }, [data, dispatch, isPremium,filters.category,filters.search]);

  // console.log("Page:", page);
  // console.log("Current index:", currentIndex);
  // console.log("Total books loaded:", allBooks.length);
  // console.log(
  //   "Latest data:",
  //   data.map((b) => b.id)
  // );

  
  const nextSlide = () => {
    if (isPremium) {
      dispatch(nextPremiumBatch());
    } else {
      dispatch(nextFreeBatch());
    }
  };

  const prevSlide = () => {
    if (isPremium) {
      dispatch(prevPremiumBatch());
    } else {
      dispatch(prevFreeBatch());
    }
  };
const premiumState = useSelector((state: RootState) => state.premiumBooks);
console.log("PREMIUM STATE:", premiumState);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {/* Section Header */}
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
            disabled={loading || currentIndex === 0}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={
              loading ||
              (currentIndex + booksPerView >= allBooks.length &&
                data.length === 0)
            }
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-hidden">
        {loading ? (
          <SpinningBookLoader />
        ) : error ? (
          <h1 className="bg-red-400 text-xl text-white p-4 rounded-md">
            There was an issue loading the books. Please try again later.
          </h1>
        ) : allBooks && allBooks.length > 0 ? (
          displayedBooks.map((book: book) =>
            isPremium ? (
              <PremiumBook key={book.id} book={book} />
            ) : (
              <BookCard key={book.id} book={book} />
            )
          )
        ) : (
          <p className="text-gray-600">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default BookCarousel;
