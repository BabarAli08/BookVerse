import { Trash2, Crown, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client"; 

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

const WishlistBook = ({ book, onDelete, setShowPremium }: WishlistBookProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  
  const addedDate = book.created_at
    ? new Date(book.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "";

  const handleDelete = async () => {
    if (isDeleting) return; 

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
        .eq("user_id", user.id); 

      if (error) {
        alert("Error occurred while deleting: " + error.message);
        return;
      }

      console.log("Book deleted successfully:", data);

      
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
      className={`group relative overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-3 ${
        isPremium 
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white" 
          : "bg-white"
      } rounded-2xl shadow-lg hover:shadow-2xl max-w-sm backdrop-blur-sm ${
        isPremium 
          ? "border border-yellow-400/20 hover:border-yellow-400/50 shadow-black/20 hover:shadow-black/40" 
          : "border border-gray-200 hover:border-gray-300 shadow-gray-900/10 hover:shadow-gray-900/20"
      }`}
    >
     
      {isPremium && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 via-amber-500/3 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-400/8 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </>
      )}

      <div className="relative p-6 pb-3">
       
        <div onClick={()=>navigate('/premium')}
          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all duration-300 ${
            isPremium
              ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30"
          }`}
        >
          {isPremium && <Crown size={13} className="text-amber-900" />}
          {book.tier || "Free"}
        </div>

       
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`absolute top-6 right-6 p-2.5 rounded-xl transition-all duration-300 shadow-lg ${
            isPremium
              ? "bg-red-950/40 text-red-400 hover:bg-red-950/60 hover:text-red-300 border border-red-800/30 hover:border-red-700/50"
              : "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 border border-red-200"
          } ${isDeleting ? "opacity-50 cursor-not-allowed" : "hover:scale-110 hover:rotate-3"} backdrop-blur-sm`}
          aria-label="Delete from wishlist"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>

      
      <div className="px-6 pb-4">
        <div 
          className={`relative w-full h-52 rounded-xl overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-2xl ${
            isPremium 
              ? "bg-gradient-to-br from-gray-800 via-gray-750 to-gray-900 border border-yellow-400/20 hover:border-yellow-400/40" 
              : "bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200"
          }`}
        >
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className={`p-4 rounded-full ${isPremium ? "bg-yellow-400/10" : "bg-blue-100"}`}>
                <BookOpen size={44} className={`${isPremium ? "text-yellow-400" : "text-blue-600"} drop-shadow-sm`} />
              </div>
            </div>
          )}
          
          
          {isPremium && (
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/20 via-transparent to-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </div>
      </div>

     
      <div className="px-6 pb-6">
        <h3 className={`text-xl font-bold mb-2 line-clamp-2 leading-tight transition-all duration-300 ${
          isPremium 
            ? "text-white group-hover:text-yellow-50" 
            : "text-gray-900 group-hover:text-gray-800"
        }`}>
          {book.title}
        </h3>
        
        <p className={`text-sm font-medium mb-3 transition-colors duration-300 ${
          isPremium ? "text-gray-300 group-hover:text-gray-200" : "text-gray-600"
        }`}>
          by {book.authors}
        </p>
        
        <p className={`text-sm mb-4 line-clamp-3 leading-relaxed transition-colors duration-300 ${
          isPremium ? "text-gray-400 group-hover:text-gray-350" : "text-gray-700"
        }`}>
          {book.description || "No description available."}
        </p>
        
        {addedDate && (
          <p className={`text-xs mb-5 transition-colors duration-300 ${
            isPremium ? "text-gray-500" : "text-gray-500"
          }`}>
            Added on {addedDate}
          </p>
        )}

       
        <button
          onClick={() => isPremium ? setShowPremium?.(true) : navigate(`/books/${book.book_id}/read`)}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden ${
            isPremium
              ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 shadow-yellow-400/40 hover:shadow-yellow-400/60"
              : "bg-gradient-to-r from-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900 shadow-gray-900/40"
          }`}
        >
          
          {isPremium && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          )}
          
          <span className="relative flex items-center justify-center gap-2">
            <BookOpen size={16} />
            {isPremium ? "Read Premium" : "Read Free"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default WishlistBook;