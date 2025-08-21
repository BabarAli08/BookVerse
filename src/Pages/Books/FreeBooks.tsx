import { BookOpen, Star, Heart, LoaderPinwheel, Loader2 } from "lucide-react";
import type { author, book } from "../../Data/Interfaces";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

const BookCard = ({ book }: { book: book }) => {
  const [fav, setFav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const imageUrl =
    book.formats?.["image/jpeg"] ||
    book.formats?.["image/png"] ||
    book.formats?.["image/jpg"] ||
    "";

  const authorNames =
    book.authors?.map((author: author) => author.name).join(", ") ||
    "Unknown Author";
  const pages = Math.floor(Math.random() * 800 + 100);
  const rating = (Math.random() * 2 + 3).toFixed(1);
  useEffect(() => {
    async function fetchFav() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return setLoading(false);

      const { data: favBooks, error } = await supabase
        .from("books")
        .select("book_id")
        .eq("user_id", user.id)
        .eq("book_id", book.id)
        .single();

      if (!error && favBooks) {
        setLoading(false);
        setFav(true);
      } else {
        setLoading(false);
        setFav(false);
      }
    }

    fetchFav();
  }, [book.id]);
  const handleFav = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fav) setFav(true);
    else setFav(false);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to add to wishlist.");
      return;
    }
    if (!fav) {
      const mappedBook = {
        user_id: user.id,
        book_id: book.id,
        tier: "free",
        title: book.title,
        authors: authorNames,
        cover: book.formats?.["image/jpeg"],
        published_at: book?.authors?.[0]?.death_year,
        description: book?.summaries?.[0],
      };
      console.log("mapped Book", mappedBook);

      const { data, error } = await supabase
        .from("books")
        .upsert([mappedBook], { onConflict: ["user_id", "book_id"] });

      if (error) console.log(error);
    } else {
      const { data, error } = await supabase
        .from("books")
        .delete()
        .eq("book_id", book.id)
        .eq("user_id", user.id);
      if (error) console.log(error);
      else {
        setFav(false);
      }
    }
  };

  return (
    <div className="w-[15rem] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex-shrink-0 group">
      <div className="relative h-48 bg-gray-200">
        {/* Free Badge */}
        <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
          Free
        </div>

        {/* Wishlist Heart (shows on hover) */}
        <button
          className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
          onClick={handleFav}
        >
          {loading ? (
            <Loader2 size={18} className="text-red-500 animate-spin" />
          ) : (
            <Heart
              size={18}
              className={`text-red-500 transition-all duration-300 ${
                fav ? "fill-red-500 scale-110" : ""
              }`}
            />
          )}
        </button>

        {/* Book Image */}
        <div className="w-full h-full flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 border-2 border-gray-400 rounded border-dashed"></div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600">by {authorNames}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-600">{pages}p</span>
        </div>
        <button
          onClick={() => navigate(`/books/${book.id}`)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 mt-3"
        >
          <BookOpen size={16} />
          <span>Read Free</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
