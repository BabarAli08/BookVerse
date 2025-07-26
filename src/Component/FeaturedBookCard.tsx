
import { Star } from "lucide-react";
import { IoBookOutline } from "react-icons/io5";
interface Book {
  image: string;
  tag: string;
  name: string;
  author: string;
  description: string;
  rating: number;
  downloads: number;
  onClick: () => void;
}

const FeaturedBookCard = ({
  image,
  tag,
  name,
  author,
  description,
  rating,
  downloads,
  onClick,
}: Book) => {
  return (
    <div className="w-100 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden hover:shadow-lg hover:mb-3 transition-all duration-300 cursor-pointer group">
      {/* Book Cover Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg transform group-hover:scale-105 transition-transform duration-200">
            {tag}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {name}
        </h3>

        {/* Author */}
        <p className="text-gray-600 mb-3 group-hover:text-gray-700 transition-colors duration-200">
          by {author}
        </p>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{description}</p>

        {/* Rating and Downloads Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <div className="text-lg font-semibold text-gray-600">{downloads}</div>
        </div>

        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={onClick}
            className="w-full bg-gray-950 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transform hover:scale-101 active:scale-100 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Details
          </button>

          <span className="p-3 bg-gray-200 rounded-full"><IoBookOutline  size={23} /> </span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBookCard;
