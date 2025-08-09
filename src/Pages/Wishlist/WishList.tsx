import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import type { book } from "../../Data/Interfaces";
import BookCard from "../Books/FreeBooks";
import WishlistBook from "../../Component/WishlistedBook";
import { BookHeart, Library, Plus } from "lucide-react";
import UpgradeToSee from "../../Component/UpgradeToSee";

const WishList = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-900 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <BookHeart className="h-12 w-12 text-gray-400 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your personal collection of books you want to read
            </p>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <Library className="h-24 w-24 text-gray-300 mx-auto mb-8" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your reading list by adding books you'd like to
              read later.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
              <Plus size={20} />
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showPremium && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <UpgradeToSee onClose={() => setShowPremium(false)} />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookHeart className="h-12 w-12 text-gray-700 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            Your personal collection of books you want to read
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Free Books
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
              Premium Books
            </span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {books.length}
              </div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {
                  books.filter((book) => book.tier?.toLowerCase() !== "premium")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Free Books</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {
                  books.filter((book) => book.tier?.toLowerCase() === "premium")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Premium Books</div>
            </div>
          </div>
        </div>

        {/* Books Grid - Fixed width issue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
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

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <button className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg">
            <Plus size={20} />
            Add More Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishList;
