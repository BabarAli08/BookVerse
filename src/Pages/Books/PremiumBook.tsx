import { useEffect, useState } from "react";
import type { book as bookState } from "../../Data/Interfaces";
import { useDispatch, useSelector } from "react-redux";
import { setBook, setClicked } from "../../Data/PremiumBookClickedSlice";
import { Heart } from "lucide-react";
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
    console.log("is fav " + checkFav);
    setFav(checkFav);
  }, [book.id]);

  const handleFav = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to add to wishlist.");
      return;
    }
    if (!fav) {
       const filteredBook={
        title:book.title,
        bookId:book.id,
        description:book.summaries?.[0],
        authors:allAuthors,
        cover:book.formats?.["image/jpeg"],
        publishedAt:book?.authors?.[0]?.death_year,
      }
      dispatch(updateWishlisted([filteredBook]));
      setFav(true);
    } else {
      dispatch(removeFromWishlist(book.id));
      setFav(false);
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

      const { data, error } = await supabase
        .from("books")
        .upsert([mappedBook], { onConflict: ["user_id", "book_id"] });
      if (error) {
        toast.error("could not add book to wishlist" + error.message);
      }
    } else {
      await supabase
        .from("books")
        .delete()
        .eq("book_id", book.id)
        .eq("user_id", user.id);
    }
  };

  const imageUrl =
    book.formats?.["image/jpeg"] ||
    book.formats?.["image/png"] ||
    book.formats?.["image/jpg"];

  const defaultImage = "/placeholder-book.png";
  const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
  const randomPages = Math.floor(Math.random() * (500 - 150) + 150);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full max-w-xs bg-white rounded-xl border shadow-md overflow-hidden relative flex flex-col group
        ${
          currentPlan.name !== "free" && currentPlan.status == "active"
            ? "border-purple-100 ring-2 ring-purple-300"
            : "border-gray-300"
        }
      `}
    >
      <span
        className={`absolute top-2 left-2 z-10 text-xs font-semibold px-2 py-1 rounded 
          ${
            currentPlan.name !== "free" && currentPlan.status == "active"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
              : "bg-purple-100 text-purple-800"
          }
        `}
      >
        Premium
      </span>

      <button
        className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        onClick={handleFav}
      >
        <Heart
          size={18}
          className={`text-red-500 ${fav ? "fill-red-500" : ""}`}
        />
      </button>

      <div className="relative h-48 bg-gray-200 group">
        <img
          src={imageUrl || defaultImage}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
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

      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <h2 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[3rem]">
          {book.title}
        </h2>

        {book.authors && (
          <p className="text-sm text-gray-700 line-clamp-1">
            by {book.authors?.map((a) => a.name).join(", ")}
          </p>
        )}

        <p className="text-sm text-gray-500 line-clamp-1">
          {book.subjects?.slice(0, 2).join(" • ") ||
            "No subject info available"}
        </p>

        <div className="flex justify-between items-center text-sm mt-2">
          <div className="flex items-center gap-1 text-yellow-500">
            ⭐ <span className="font-medium text-gray-800">{randomRating}</span>
          </div>
          <span className="text-gray-500">{randomPages} pages</span>
        </div>

        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.02,
            transition: {
              duration: 0.2,
              ease: "easeInOut",
            },
          }}
          onClick={() => {
            if (currentPlan.name === "free") handleClick();
            else handlePremiumBookRead();
          }}
          className={`mt-auto w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2
            ${
              currentPlan.name !== "free" && currentPlan.status == "active"
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800"
            }
          `}
        >
          <span>
            {currentPlan.name !== "free" && currentPlan.status == "active"
              ? "Read Premium"
              : "Upgrade to read"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PremiumBook;
