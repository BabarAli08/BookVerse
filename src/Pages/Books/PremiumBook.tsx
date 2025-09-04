import { useEffect, useState } from "react";
import type { book as bookState } from "../../Data/Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setBook, setClicked } from "../../Data/PremiumBookClickedSlice";
import { Heart, Star, BookOpen, Crown } from "lucide-react";
import type { RootState } from "../../Store/store";
import supabase from "../../supabase-client";
import { useNavigate } from "react-router";
import { setPremiumBookClicked } from "../../Store/ReadSlice";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { removeFromWishlist, updateWishlisted } from "../../Store/UserSettingsSlice";

interface PremiumBookProps {
  book: bookState;
}

const PremiumBook = ({ book }: PremiumBookProps) => {
  const dispatch = useDispatch();
  const [fav, setFav] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { currentPlan } = useSelector(
    (state: RootState) => state.userSettings.reading.billing
  );
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(setClicked(true));
    dispatch(setBook([book]));
  };

  const handlePremiumBookRead = () => {
    dispatch(setPremiumBookClicked(true));
    dispatch(setBook([book]));
    navigate(`/books/${book.id}`);
  };

  const allAuthors = book.authors
    ?.map((a: { name: string }) => a.name)
    .join(",");
  const wishlistedBook = useSelector(
    (state: RootState) => state.userSettings.wishlistedBook
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to add to wishlist.");
      return;
    }

    if (!fav) {
      const filteredBook = {
        title: book.title,
        bookId: book.id,
        description: book.summaries?.[0],
        authors: allAuthors,
        cover: book.formats?.["image/jpeg"],
        publishedAt: book?.authors?.[0]?.death_year,
      };
      dispatch(updateWishlisted([filteredBook]));
      setFav(true);
      toast.success("Added to wishlist!");
    } else {
      dispatch(removeFromWishlist(book.id));
      setFav(false);
      toast.success("Removed from wishlist!");
    }

    if (!fav) {
      const mappedBook = {
        user_id: user.id,
        book_id: book.id,
        tier: "premium",
        title: book.title,
        authors: allAuthors,
        cover: book.formats?.["image/jpeg"],
        published_at: book?.authors?.[0]?.death_year,
        description: book?.summaries?.[0],
      };

      const { error } = await supabase
        .from("books")
        .upsert([mappedBook], { onConflict: ["user_id", "book_id"] });
      if (error) {
        toast.error("Could not add book to wishlist: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("book_id", book.id)
        .eq("user_id", user.id);
      if (error) {
        toast.error("Could not remove from wishlist: " + error.message);
      }
    }
  };

  const imageUrl =
    book.formats?.["image/jpeg"] ||
    book.formats?.["image/png"] ||
    book.formats?.["image/jpg"];

  const defaultImage = "/placeholder-book.png";
  const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
  const randomPages = Math.floor(Math.random() * (500 - 150) + 150);
  const isPremiumUser = currentPlan.name !== "free" && currentPlan.status === "active";

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
      <div 
        className={`
          relative w-full h-[440px] min-w-[280px] max-w-[320px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer
          border-gray-200 border transition-all duration-300 group
         
        `}
        style={isPremiumUser ? {
          background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #a855f7, #ec4899) border-box"
        } : {}}
      >
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`
            absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-xs font-bold
            flex items-center gap-1.5 shadow-sm
            ${isPremiumUser 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
              : "bg-purple-100 text-purple-700"
            }
          `}
        >
          <Crown size={12} />
          <span>Premium</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          onClick={handleFav}
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${
              fav ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </motion.button>

        <div className="relative h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <motion.img
            src={imageUrl || defaultImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultImage;
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0.5 }}
          />
          
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            whileHover="visible"
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            {!isPremiumUser ? (
              <div className="text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                  </svg>
                </motion.div>
                <p className="text-sm font-medium">Premium Required</p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </motion.div>

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-4 h-[240px] flex flex-col">
          
          <div className="h-[3.5rem] mb-3">
            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 hover:text-purple-600 transition-colors duration-200">
              {book.title}
            </h3>
          </div>

          <div className="h-[1.5rem] mb-3">
            {book.authors && book.authors.length > 0 ? (
              <p className="text-sm text-gray-600 line-clamp-1">
                by {book.authors.map((a) => a.name).join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-400">Author unknown</p>
            )}
          </div>

          <div className="h-[1.5rem] mb-4">
            <p className="text-xs text-gray-500 line-clamp-1">
              {book.subjects?.slice(0, 2).join(" • ") || "Fiction"}
            </p>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-700">{randomRating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>{randomPages}p</span>
            </div>
          </div>

          <div className="mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isPremiumUser) {
                  handlePremiumBookRead();
                } else {
                  handleClick();
                }
              }}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200
                flex items-center justify-center gap-2 shadow-sm
                ${isPremiumUser
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                }
              `}
            >
              {isPremiumUser ? (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Read Now</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to Read</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {isPremiumUser && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-sm -z-10"
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PremiumBook;