import { Trash2, Crown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client"; // Assuming supabase client is imported



type WishlistBookProps = {
  book: {
    book_id: number | string;
    tier: string;
    title: string;
    authors: string;
    description?: string;
    created_at?: string;
    cover?: string;
  };
  onDelete?: () => void;
  setShowPremium?: (value: boolean) => void;

};

const WishlistBook = ({ book, onDelete,setShowPremium }: WishlistBookProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Format added_at date nicely
  const addedDate = book.created_at
 ? new Date(book.created_at).toLocaleDateString("en-US", {
 year: "numeric",
 month: "numeric",
 day: "numeric",
      })
 : "";

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks

    setIsDeleting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        alert("Error fetching user: " + userError.message);
 return;
      }

      if (!user) {
        alert("Please login to delete");
 return;
      }

      const { data, error } = await supabase
        .from("books")
        .delete()
        .eq("book_id", book.book_id)
        .eq("user_id", user.id); // Fixed: use user.id instead of user

      if (error) {
        alert("Error occurred while deleting: " + error.message);
 return;
      }

      console.log("Book deleted successfully:", data);

      // Call the callback to refresh the wishlist
      if (onDelete) {
        onDelete();
      }
      
    } catch (err) {
      console.error("Delete error:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isPremium = book.tier?.toLowerCase() === "premium";

  return (
    <div 
      className={`relative shadow-xl rounded-lg p-4 max-w-sm ${
        isPremium 
 ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-yellow-400/30" 
 : "bg-white"
      }`}
    >
      {/* Premium overlay pattern */}
      {isPremium && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/5 pointer-events-none" />
      )}

      {/* Tier badge */}
      <div 
        className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 ${
          isPremium
 ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
 : "bg-green-100 text-green-700"
        }`}
      >
        {isPremium && <Crown size={12} />}
        {book.tier || "Free"}
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`absolute top-3 right-3 p-1 rounded hover:bg-opacity-80 transition-all ${
          isPremium
 ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
 : "bg-red-100 text-red-600 hover:bg-red-200"
        } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Delete from wishlist"
      >
        {isDeleting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>

      {/* Placeholder for book cover */}
      <div 
        className={`w-full h-40 rounded flex items-center justify-center mb-4 ${
          isPremium 
 ? "bg-gray-700 border border-yellow-400/20" 
 : "bg-gray-200"
        }`}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="object-cover w-full h-full rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className={`text-4xl ${isPremium ? "text-gray-500" : "text-gray-400"}`}>📖</div> // Fallback icon
        )}
      </div>

      <h3 className={`text-lg font-bold mb-1 line-clamp-2 ${isPremium ? "text-white" : "text-black"}`}>
        {book.title}
      </h3>
      <p className={`text-sm mb-1 ${isPremium ? "text-gray-300" : "text-gray-600"}`}>
        by {book.authors}
      </p>
      <p className={`text-sm mb-3 line-clamp-3 ${isPremium ? "text-gray-400" : "text-gray-700"}`}>
        {book.description || "No description available."}
      </p>
      {addedDate && (
        <p className={`text-xs mb-3 ${isPremium ? "text-gray-500" : "text-gray-500"}`}>
          Added on {addedDate}
        </p>
      )}

      <button
        onClick={() => isPremium ? setShowPremium?.(true) : navigate(`/books/${book.book_id}/read`)}
        className={`w-full py-2 rounded font-medium transition ${
          isPremium
 ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
 : "bg-black text-white hover:bg-gray-900"
        }`}
      >
        {isPremium ? "Read Premium" : "Read Free"}
      </button>
    </div>
  );
};

export default WishlistBook;