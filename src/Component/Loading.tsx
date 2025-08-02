import { BookOpen } from "lucide-react";

// Book Pages Loading Animation
export const BookPagesLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-lg shadow-lg">
          {/* Animated Pages */}
          <div className="absolute -left-1 top-2 w-14 h-16 bg-white rounded-r border-l-2 border-gray-200 animate-pulse"></div>
          <div className="absolute -left-2 top-1 w-14 h-16 bg-gray-50 rounded-r border-l-2 border-gray-300 animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute -left-3 top-0 w-14 h-16 bg-gray-100 rounded-r border-l-2 border-gray-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

// Spinning Book Icon
export const SpinningBookLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <BookOpen size={32} className="text-blue-600 animate-spin" />
        <div className="absolute inset-0 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" style={{animationDuration: '1.5s'}}></div>
      </div>
    </div>
  );
};

// Dots Loading Animation
export const DotsLoader = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
    </div>
  );
};

// Skeleton Book Card
export const SkeletonBookCard = () => {
  return (
    <div className="w-[15rem] bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Progress Bar Loader
export const ProgressLoader = ({ progress = 65 }) => {
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Loading books...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
