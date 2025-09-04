import { BookOpen, Star, Heart, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { author, book } from "../../Data/Interfaces";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { setPremiumBookClicked } from "../../Store/ReadSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { toast } from "sonner";
import {
  removeFromWishlist,
  updateWishlisted,
} from "../../Store/UserSettingsSlice";

const BookCard = ({ book }: { book: book }) => {
  const [fav, setFav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const { wishlistedBook } = useSelector(
    (state: RootState) => state.userSettings
  );

  useEffect(() => {
    const checkFav = wishlistedBook.some(
      (wBook) => Number(wBook.bookId) === Number(book.id)
    );
    setFav(checkFav);
  }, [book.id, wishlistedBook]);

  const handleFav = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to add to wishlist.");
      setLoading(false);
      return;
    }

    try {
      if (!fav) {
        const filteredBook = {
          title: book.title,
          bookId: book.id,
          description: book.summaries?.[0],
          authors: authorNames,
          cover: book.formats?.["image/jpeg"],
          publishedAt: book?.authors?.[0]?.death_year,
        };
        dispatch(updateWishlisted([filteredBook]));
        setFav(true);
        toast.success("Added to wishlist!");

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

        const { error } = await supabase
          .from("books")
          .upsert([mappedBook], { onConflict: ["user_id", "book_id"] });

        if (error) {
          toast.error("Failed to sync with server");
          console.error(error);
        }
      } else {
        dispatch(removeFromWishlist(book.id));
        setFav(false);
        toast.success("Removed from wishlist!");

        const { error } = await supabase
          .from("books")
          .delete()
          .eq("book_id", book.id)
          .eq("user_id", user.id);

        if (error) {
          toast.error("Failed to sync with server");
          console.error(error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadBook = () => {
    dispatch(setPremiumBookClicked(false));
    navigate(`/books/${book.id}`);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full"
    >
      <div className="relative w-full h-[440px] min-w-[280px] max-w-[320px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group">
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white"
        >
          <CheckCircle size={12} />
          <span>Free</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          onClick={handleFav}
          disabled={loading}
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
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="relative h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {imageUrl ? (
            <>
              <motion.img
                src={imageUrl}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder-book.png";
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0.5 }}
              />
              
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                whileHover="visible"
                className="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
              
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-xl border-dashed flex items-center justify-center">
                <BookOpen size={24} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 h-[240px] flex flex-col">
          
          <div className="h-[3.5rem] mb-3">
            <motion.h3
              className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 hover:text-green-600 transition-colors duration-200"
              layoutId={`title-${book.id}`}
            >
              {book.title}
            </motion.h3>
          </div>

          <div className="h-[1.5rem] mb-3">
            <p className="text-sm text-gray-600 line-clamp-1">
              by {authorNames}
            </p>
          </div>

          <div className="h-[1.5rem] mb-4">
            <p className="text-xs text-gray-500 line-clamp-1">
              {book.subjects?.slice(0, 2).join(" • ") || "Classic Literature"}
            </p>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-700">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>{pages}p</span>
            </div>
          </div>

          <div className="mt-auto">
            <motion.button
              onClick={handleReadBook}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-200"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Free</span>
              <motion.div
                className="w-1 h-1 bg-white rounded-full opacity-60"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </div>
        </div>

        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-2xl opacity-0 group-hover:opacity-10 blur-sm -z-10"
          whileHover={{ opacity: 0.15 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
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