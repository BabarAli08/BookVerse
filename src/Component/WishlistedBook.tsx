import { Trash2, Crown, BookOpen, Calendar, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../Store/store";
import { removeFromWishlist } from "../Store/UserSettingsSlice";
import { toast } from "sonner";

type WishlistBookProps = {
  book: {
    bookId: number | string;
    tier: string;
    title: string;
    authors: string;
    description?: string;
    created_at?: string;
    cover?: string;
  };
  setShowPremium?: (value: boolean) => void;
};

const WishlistBook = ({ book, setShowPremium }: WishlistBookProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const { wishlistedBook } = useSelector(
    (state: RootState) => state.userSettings
  );
  const { currentPlan } = useSelector(
    (state: RootState) => state.userSettings.reading.billing
  );

  const addedDate = book.created_at
    ? new Date(book.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      console.log("Deleting book with ID:", book.bookId);
      console.log("Current wishlist:", wishlistedBook);

      dispatch(removeFromWishlist(book.bookId));

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User authentication error:", userError);

        return;
      }

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("book_id", book.bookId)
        .eq("user_id", user.id);

      if (error) {
        toast.error("Error deleting from Supabase wishlist:" + error.message);
      } else {
        toast.success("Successfully deleted");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReadClick = () => {
    const isPremium = book.tier?.toLowerCase() === "premium";

    if (isPremium && currentPlan.name === "free") {
      setShowPremium?.(true);
    }
    else if(isPremium && currentPlan.name !== "free"){
      navigate(`/books/${book.bookId}/read`);
    } 
    else {
      navigate(`/books/${book.bookId}/read`);
    }
  };

  const isPremium = book.tier?.toLowerCase() === "premium";

  const cardVariants: any = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const deleteButtonVariants: any = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className={`
        group relative overflow-hidden backdrop-blur-sm border rounded-2xl shadow-lg transition-all duration-300
        ${
          isPremium
            ? "bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-amber-200/20 hover:border-amber-300/40 hover:shadow-amber-500/10"
            : "bg-white/95 border-gray-200/80 hover:border-blue-300/60 hover:shadow-blue-500/10"
        }
        max-w-sm mx-auto
      `}
    >
      {isPremium && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-yellow-400/3 to-orange-400/5 rounded-2xl"
        />
      )}

      <div className="relative p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300
              ${
                isPremium
                  ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
                  : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200"
              }
            `}
          >
            {isPremium && (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Crown size={12} />
              </motion.div>
            )}
            {book.tier || "Free"}
          </motion.div>

          <motion.button
            variants={deleteButtonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className={`
              p-2 rounded-lg transition-all duration-300 backdrop-blur-sm
              ${
                isPremium
                  ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/40"
                  : "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
              }
              ${
                isDeleting ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
              }
            `}
            aria-label="Remove from wishlist"
          >
            {isDeleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <Trash2 size={16} />
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`
            relative w-full h-48 rounded-xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-xl
            ${
              isPremium
                ? "bg-gradient-to-br from-slate-700 to-slate-800 border border-amber-200/20"
                : "bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200"
            }
          `}
        >
          {book.cover ? (
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={book.cover}
              alt={book.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`
                  p-4 rounded-full
                  ${
                    isPremium
                      ? "bg-amber-400/10 border border-amber-400/20"
                      : "bg-blue-50 border border-blue-200"
                  }
                `}
              >
                <BookOpen
                  size={40}
                  className={`${
                    isPremium ? "text-amber-400" : "text-blue-600"
                  }`}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="px-5 pb-5"
      >
        <motion.h3
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`
            text-lg font-bold mb-2 line-clamp-2 leading-tight transition-colors duration-300
            ${
              isPremium
                ? "text-slate-100 group-hover:text-white"
                : "text-gray-900 group-hover:text-gray-800"
            }
          `}
        >
          {book.title}
        </motion.h3>

        <p
          className={`
          text-sm font-medium mb-3 transition-colors duration-300
          ${isPremium ? "text-slate-300" : "text-gray-600"}
        `}
        >
          by {book.authors}
        </p>

        {book.description && (
          <p
            className={`
            text-sm mb-4 line-clamp-2 leading-relaxed transition-colors duration-300
            ${isPremium ? "text-slate-400" : "text-gray-700"}
          `}
          >
            {book.description}
          </p>
        )}

        {/* Added Date */}
        {addedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <Calendar
              size={12}
              className={`${isPremium ? "text-slate-500" : "text-gray-400"}`}
            />
            <span
              className={`text-xs ${
                isPremium ? "text-slate-500" : "text-gray-500"
              }`}
            >
              Added {addedDate}
            </span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReadClick}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden
            ${
              isPremium
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 hover:from-amber-400 hover:to-yellow-400 shadow-lg hover:shadow-amber-500/25"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-blue-500/25"
            }
          `}
        >
          <motion.div
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />

          <span className="relative flex items-center justify-center gap-2">
            <BookOpen size={16} />
            {isPremium && currentPlan.name === "free"
              ? "Unlock Premium"
              : isPremium && currentPlan.name !== "free"
              ? "Read Premium"
              : "Start Reading"}
          </span>
        </motion.button>
      </motion.div>

      {isPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="absolute top-3 left-3"
        >
          <div className="flex items-center gap-1 bg-amber-100/90 backdrop-blur-sm text-amber-800 px-2 py-1 rounded-full text-xs font-bold border border-amber-200/50">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star size={10} className="fill-current" />
            </motion.div>
            Premium
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WishlistBook;
