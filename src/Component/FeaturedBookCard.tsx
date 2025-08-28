import { Star } from "lucide-react";
import { IoBookOutline } from "react-icons/io5";
import type { book } from "../Data/Interfaces";

interface FeaturedBookCardProps {
  book: book;
  onClick: () => void;
}

const FeaturedBookCard = ({ book, onClick }: FeaturedBookCardProps) => {
  const image =
    book.formats?.["image/jpeg"] ||
    book.formats?.["image/png"] ||
    book.formats?.["image/jpg"] ||
    "";
  const tag = book.bookshelves?.[0] || "Fiction";
  const name = book.title;
  const author =
    book.authors?.map((a) => a.name).join(", ") || "Unknown Author";
  const description =
    book?.summaries?.[0] || "No description available.";
  const rating = (Math.random() * 5).toFixed(1);
  const downloads = book.download_count || 0;

  return (
    <div className="w-full sm:w-[90%] md:w-[95%] lg:w-full bg-gray-100 shadow-md rounded-lg border border-gray-300 overflow-hidden hover:shadow-lg hover:mb-3 transition-all duration-300 cursor-pointer group">
 
      <div className="relative h-40 sm:h-48 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

      
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <span className="bg-purple-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg transform group-hover:scale-105 transition-transform duration-200">
            {tag}
          </span>
        </div>
      </div>

    
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {name}
        </h3>

        <p className="text-gray-600 text-sm sm:text-base mb-3 group-hover:text-gray-700 transition-colors duration-200">
          by {author}
        </p>

        <p className="text-gray-700 text-xs sm:text-sm mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {rating}
            </span>
          </div>
          <div className="text-sm sm:text-lg font-semibold text-gray-600">
            {downloads}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={onClick}
            className="w-full bg-gray-950 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transform hover:scale-101 active:scale-100 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            View Details
          </button>

          <span className="p-2 sm:p-3 bg-gray-200 rounded-full">
            <IoBookOutline size={20} className="sm:size-[23px]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBookCard;
