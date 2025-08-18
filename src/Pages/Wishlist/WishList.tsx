import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import type { book } from "../../Data/Interfaces";
import BookCard from "../Books/FreeBooks";
import WishlistBook from "../../Component/WishlistedBook";
import { BookHeart, Library, Plus } from "lucide-react";
import UpgradeToSee from "../../Component/UpgradeToSee";
import { useNavigate } from "react-router";

const WishList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [showPremium, setShowPremium] = useState(false);

  const getWishlisted = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      setLoading(false);
      return;
    }
    if (!user) {
      console.error("No user found");
      setLoading(false);
      return;
    }

    const { data: wishlist, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching wishlist:", error);
      setLoading(false);
      return;
    }

    setBooks(wishlist || []);
    setLoading(false);
  };

  useEffect(() => {
    getWishlisted();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookHeart className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Your collection of books to read
            </p>
          </div>

          {/* Empty State */}
          <div className="max-w-sm mx-auto text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Library className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              No books in your wishlist yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding books you want to read later.
            </p>
            <button onClick={()=>navigate('/books')} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Plus size={16} />
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showPremium && (
        <div 
          onClick={() => { setShowPremium(false) }} 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookHeart className="h-6 w-6 text-blue-600" />
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-4">
                Upgrade to Premium
              </h1>
              
              <button 
                className="bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors" 
                onClick={() => navigate('/premium')}
              >
                Buy Premium
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookHeart className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Your collection of books to read
          </p>
          
          {/* Legend */}
          <div className="inline-flex items-center gap-6 bg-white rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Premium</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {books.length}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">
                  {
                    books.filter((book) => book.tier?.toLowerCase() !== "premium")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600">Free</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-600">
                  {
                    books.filter((book) => book.tier?.toLowerCase() === "premium")
                      .length
                  }
                </div>
                <div className="text-xs text-gray-600">Premium</div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {books.map((book, i) => (
            <div key={book.book_id || i} className="w-full max-w-sm mx-auto">
              <WishlistBook
                book={book}
                onDelete={getWishlisted}
                setShowPremium={setShowPremium}
              />
            </div>
          ))}
        </div>

        {/* Add More Button */}
        <div className="text-center">
          <button onClick={()=>navigate('/books')} className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            Add More Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishList;