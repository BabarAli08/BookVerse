import { BookOpen, Star, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { author, book } from "../../Data/Interfaces";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { setPremiumBookClicked } from "../../Store/ReadSlice";
import { useDispatch } from "react-redux";

const BookCard = ({ book }: { book: book }) => {
  const [fav, setFav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
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
  const dispatch = useDispatch();

  return (
    <motion.div
      className="w-[15rem] bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex-shrink-0 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      layout
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Free Badge */}
        <motion.div
          className="absolute top-3 left-3 z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
            Free
          </div>
        </motion.div>

        {/* Heart Button */}
        <motion.button
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
          onClick={handleFav}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Loader2 size={16} className="text-green-500 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="heart"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Heart
                  size={16}
                  className={`transition-colors duration-200 ${
                    fav 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-400 hover:text-red-400"
                  }`}
                />
                {fav && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Image */}
        <div className="w-full h-full flex items-center justify-center relative">
          {imageUrl ? (
            <>
              <motion.img
                src={imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={20} className="text-gray-400" />
                  </motion.div>
                </div>
              )}
            </>
          ) : (
            <motion.div
              className="w-12 h-12 border-2 border-gray-300 rounded-lg border-dashed flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <BookOpen size={20} className="text-gray-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <motion.div 
        className="p-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {/* Title */}
        <motion.h3 
          className="text-base font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-200"
          layoutId={`title-${book.id}`}
        >
          {book.title}
        </motion.h3>

        {/* Author */}
        <motion.p 
          className="text-sm text-gray-600"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          by {authorNames}
        </motion.p>

        {/* Rating and Pages */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">{pages}p</span>
        </motion.div>

        
        <motion.button
          onClick={() =>{
              dispatch(setPremiumBookClicked(false))
             navigate(`/books/${book.id}`)
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 mt-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <BookOpen size={16} />
          </motion.div>
          <span>Read Free</span>
        </motion.button>
      </motion.div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default BookCard;