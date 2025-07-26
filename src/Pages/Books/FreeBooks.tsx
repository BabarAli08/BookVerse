
import { BookOpen, Star } from "lucide-react";


interface Book {
  title: string;
  author: string;
  rating: number;
  image: string;
  pages: number;
}

const BookCard = ({ title, image, author, rating, pages }: Book) => {
  return (
    <div className="w-[15rem] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex-shrink-0">
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
          Free
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 border-2 border-gray-400 rounded border-dashed"></div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          by {author}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-600">{pages}p</span>
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 mt-3">
          <BookOpen size={16} />
          <span>Read Free</span>
        </button>
      </div>
    </div>
  );
};







export default BookCard;