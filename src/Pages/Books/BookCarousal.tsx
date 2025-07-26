
import { useState } from "react";
interface Book {
  title: string;
  author: string;
  rating: number;
  image: string;
  pages: number;
}

import { BookOpen, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import PremiumBook from "./PremiumBook";
import BookCard from "./FreeBooks";

const BookCarousel = ({ books, title, subtitle, isPremium = false }: { 
  books: Book[], 
  title: string, 
  subtitle: string,
  isPremium?: boolean 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const booksPerView = 5;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + booksPerView >= books.length ? 0 : prev + booksPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, books.length - booksPerView) : Math.max(0, prev - booksPerView)
    );
  };

  const visibleBooks = books.slice(currentIndex, currentIndex + booksPerView);

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
            <p className={`text-sm ${isPremium ? 'text-purple-600' : 'text-green-600'} font-medium`}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + booksPerView >= books.length}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      
      <div className="flex gap-6 overflow-hidden">
        {visibleBooks.map((book, index) => (
          isPremium ? (
            <PremiumBook key={currentIndex + index} {...book} />
          ) : (
            <BookCard key={currentIndex + index} {...book} />
          )
        ))}
      </div>
    </div>
  );
};

export default BookCarousel