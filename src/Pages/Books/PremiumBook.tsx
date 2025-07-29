import type { book as bookState } from "../../Data/Interfaces";

interface PremiumBookProps {
  book: bookState
}

const PremiumBook = ({ book }: PremiumBookProps) => {
  const imageUrl =
    book.formats?.["image/jpeg"] ||
    book.formats?.["image/png"] ||
    book.formats?.["image/jpg"];

  const defaultImage = "/placeholder-book.png";

  // Generate mock values to match UI
  const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
  const randomPages = Math.floor(Math.random() * (500 - 150) + 150);

  return (
    <div className="w-full max-w-xs bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden relative flex flex-col">
      {/* Premium Badge */}
      <span className="absolute top-2 left-2 z-10 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
        Premium
      </span>

      
      {/* <div className="h-48 bg-black opacity-60"> */}

      <div className="relative h-48  bg-gray-200">
        <img
          src={imageUrl || defaultImage}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
          />
          {/* </div> */}
        <div className="absolute inset-0 bg-black  opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      
      <div className="p-4 space-y-2">
        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {book.title}
        </h2>

        {book.authors && book.authors.length > 0 && (
          <p className="text-sm text-gray-700">by {book.authors?.map((a) => a.name).join(", ")}</p>
        )}

        <p className="text-sm text-gray-500">
          {book.subjects?.slice(0, 2).join(" • ") || "No subject info available"}
        </p>

    
        <div className="flex justify-between items-center text-sm mt-2">
          <div className="flex items-center gap-1 text-yellow-500">
            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-gray-800">{randomRating}</span>
          </div>
          <span className="text-gray-500">{randomPages} pages</span>
        </div>

 
        <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center space-x-2 mt-3">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span>Upgrade to Read</span>
        </button>
      </div>
    </div>
  );
};

export default PremiumBook;
