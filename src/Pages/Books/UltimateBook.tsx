import { Star, Lock, Crown } from "lucide-react";

interface UltimateBook {
  title: string;
  author: string;
  description: string;
  rating: number;
  image: string;
  pages: number;
}

const UltimateBook = ({ title, image, author, description, rating, pages }: UltimateBook) => {
  return (
    <div className="w-[18rem] bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Book Cover Section with Ultimate Badge and Lock Overlay */}
      <div className="relative h-52 bg-gray-500 overflow-hidden">
        {/* Ultimate Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-3 py-1.5 rounded-md z-10 shadow-md">
          Ultimate
        </div>
        
        {/* Background Image (blurred/grayed out) */}
        <div className="absolute inset-0">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-gray-400"></div>
          )}
        </div>
        
        {/* Gray Overlay */}
        <div className="absolute inset-0 bg-gray-600 bg-opacity-60"></div>
        
        {/* Lock Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
            <Lock size={36} className="text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {title}
        </h3>
        
        {/* Author */}
        <p className="text-sm text-gray-600">
          by {author}
        </p>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          {description}
        </p>
        
        {/* Rating and Pages */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          
          <span className="text-sm text-gray-500">{pages} pages</span>
        </div>

        {/* Upgrade to Read Button */}
        <button className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 mt-4 shadow-sm hover:shadow-md">
          <Crown size={18} className="text-yellow-600" />
          <span>Upgrade to Read</span>
        </button>
      </div>
    </div>
  );
};

export default UltimateBook