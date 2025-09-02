import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useCallback, useMemo } from "react";

import {
  BookOpen,
  Download,
  Heart,
  Share2,
  Star,
  Clock,
  FileText,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import { toast } from "sonner";
import BookDetailsLoader from "../../Component/BookDetailsLoader";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import BookDetailsLoadingButton from "../../Component/BookDetailsLoadingButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import {
  updateCompletedBooks,
  updateUserStreaks,
  updateWishlisted,
} from "../../Store/UserSettingsSlice";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const buttonVariants: any = {
  idle: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  tap: { scale: 0.98 },
};

const progressVariants: any = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      delay: 0.5,
    },
  }),
};

const OptimizedImage = memo(
  ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
      <div className="relative">
        {!loaded && !error && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
        )}
        {error && (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <BookOpen size={48} className="text-gray-400" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        />
      </div>
    );
  }
);

const MemoizedBookInfo = memo(
  ({ book, pages }: { book: any; pages: number }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        Book Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
        <div className="space-y-3">
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FileText size={16} className="text-gray-400" />
            <span className="text-gray-500">Pages:</span>
            <span className="ml-1 sm:ml-2 font-medium text-gray-900">
              {pages}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-500">Reading Time:</span>
            <span className="ml-1 sm:ml-2 font-medium text-gray-900">
              5h 45m
            </span>
          </motion.div>
        </div>
        <div className="space-y-3">
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Calendar size={16} className="text-gray-400" />
            <span className="text-gray-500">Published:</span>
            <span className="ml-1 sm:ml-2 font-medium text-gray-900">
              {book?.authors?.[0]?.death_year || "Unknown"}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <User size={16} className="text-gray-400" />
            <span className="text-gray-500">Publisher:</span>
            <span className="ml-1 sm:ml-2 font-medium text-gray-900">
              {book?.authors?.[0]?.name || "Unknown"}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
);

const MemoizedActionButton = memo(
  ({
    onClick,
    disabled,
    icon: Icon,
    children,
    variant = "secondary",
    href,
    className = "",
  }: {
    onClick?: () => void;
    disabled?: boolean;
    icon: any;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    href?: string;
    className?: string;
  }) => {
    const baseClasses = `w-full flex items-center justify-center gap-2 sm:gap-3 h-12 rounded-xl transition-all duration-200 border text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`;
    const variantClasses =
      variant === "primary"
        ? "bg-black hover:bg-gray-800 text-white border-black"
        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200";

    const content = (
      <>
        {disabled ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Icon
            size={18}
            className={variant === "primary" ? "text-white" : ""}
          />
        )}
        {children}
      </>
    );

    return (
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover={!disabled ? "hover" : "idle"}
        whileTap={!disabled ? "tap" : "idle"}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses}`}
      >
        {href ? (
          <a href={href} className="flex items-center gap-2">
            {content}
          </a>
        ) : (
          content
        )}
      </motion.button>
    );
  }
);

const BookDetails = () => {
  const [credentialsLoading, setCredentialsLoading] = useState<boolean>(true);
  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("summary");
  const { wishlistedBook } = useSelector(
    (state: RootState) => state.userSettings
  );
  const { premiumBookClicked } = useSelector((state: RootState) => state.read);
  const { currentPlan } = useSelector(
    (state: RootState) => state.userSettings.reading.billing
  );

  const completedBooks = useSelector(
    (state: RootState) => state.userSettings.completedBooks
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    const isWishlisted = wishlistedBook.some((b) => b.bookId === Number(id));
    setWishlisted(isWishlisted);
  }, []);

  const { book, loading, error } = useFetchSingleBook({ id: Number(id) });

  const imageUrl = useMemo(
    () =>
      book?.formats?.["image/jpeg"] ||
      book?.formats?.["image/png"] ||
      book?.formats?.["image/jpg"] ||
      "",
    [book?.formats]
  );

  const downloadUrl = useMemo(
    () =>
      book?.formats?.["application/pdf"] ||
      book?.formats?.["application/epub+zip"] ||
      "",
    [book?.formats]
  );

  const rating = useMemo(() => (Math.random() * 2 + 3).toFixed(1), []);
  const pages = useMemo(() => Math.floor(Math.random() * 500 + 100), []);
  const authors = useMemo(
    () => book?.authors?.map((author: any) => author.name).join(", ") || "",
    [book?.authors]
  );

  useEffect(() => {
    if (book?.id) {
      const storedProgress = localStorage.getItem(
        `reading-progress-${book.id}`
      );
      if (storedProgress) {
        setReadingProgress(JSON.parse(storedProgress));
      }
    }
  }, [book?.id]);

  const trackUserActivity = async (userId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const now = new Date().toISOString();

      const { data: existingActivity } = await supabase
        .from("user_daily_activities")
        .select("book_clicks")
        .eq("user_id", userId)
        .eq("activity_date", today)
        .single();

      const isFirstClickToday = !existingActivity;

      if (isFirstClickToday) {
        console.log("First click of the day!");

        const { error: insertError } = await supabase
          .from("user_daily_activities")
          .insert({
            user_id: userId,
            activity_date: today,
            book_clicks: 1,
            first_click_time: now,
            last_click_time: now,
          });

        if (insertError) {
          console.error("Error inserting activity:", insertError);
        }
      } else {
        console.log(
          `Already clicked ${existingActivity.book_clicks} times today`
        );

        const { error: updateError } = await supabase
          .from("user_daily_activities")
          .update({
            book_clicks: existingActivity.book_clicks + 1,
            last_click_time: now,
          })
          .eq("user_id", userId)
          .eq("activity_date", today);

        if (updateError) {
          console.error("Error updating activity:", updateError);
        }
      }

      await updateUserStreak(userId, today);
    } catch (error) {
      console.error("Error tracking user activity:", error);
    }
  };

  const updateUserStreak = async (userId: string, today: string) => {
    try {
      const { data: currentStreak } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .single();

      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      let newStreak = 1;
      if (currentStreak) {
        if (currentStreak.last_activity_date === yesterday) {
          newStreak = currentStreak.current_streak + 1;

          dispatch(
            updateUserStreaks({
              currenStreak: newStreak,
              longestStreak: Number(currentStreak.longest_streak),
            })
          );
        } else {
          newStreak = 1;
          dispatch(
            updateUserStreaks({
              currenStreak: newStreak,
              longestStreak: Number(currentStreak.longest_streak),
            })
          );
        }
      } else {
        dispatch(
          updateUserStreaks({
            currenStreak: 0,
            longestStreak: Number(currentStreak.longest_streak),
          })
        );
      }

      const longestStreak = Math.max(
        newStreak,
        currentStreak?.longest_streak || 0
      );

      const { error } = await supabase.from("user_streaks").upsert(
        {
          user_id: userId,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        console.error("Error updating streak:", error);
      } else {
        console.log(`Streak updated: ${newStreak} days`);
      }
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  };

  const handleReadFree = useCallback(async () => {
    if (premiumBookClicked && currentPlan.name === "free") {
      toast.warning("Buy premium to read this book");
      navigate("/premium");
      return;
    }
    try {
      setBookLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("User not found. Please login");
        navigate("/login");
        return;
      }

      await trackUserActivity(user.id);

      const { data: completedBooks, error: fetchError } = await supabase
        .from("completed_books")
        .select("book_id")
        .eq("user_id", user.id)
        .eq("book_id", id);

      if (fetchError) {
        toast.error(fetchError.message);
        return;
      }

      const isCompleted = completedBooks?.some(
        (book) => Number(book.book_id) === Number(id)
      );

      if (isCompleted) {
        await supabase
          .from("currently_reading")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", id);

        const filteredBooks = completedBooks.filter(
          (book: any) => book.bookId !== Number(id)
        );

        dispatch(updateCompletedBooks(filteredBooks));
        navigate(`/books/${id}/read`);
        return;
      }

      const { data: currentlyReading } = await supabase
        .from("currently_reading")
        .select("book_id")
        .eq("user_id", user.id)
        .eq("book_id", id);

      if (currentlyReading && currentlyReading.length > 0) {
        navigate(`/books/${id}/read`);
        return;
      }

      const supabaseBook = {
        book_id: book?.id,
        user_id: user?.id,
        title: book?.title,
        description: book?.summaries?.[0] || null,
        cover: imageUrl,
        published_at: book?.authors?.[0]?.death_year,
        authors: authors,
        tier: premiumBookClicked ? "premium" : "free",
      };

      const { error: insertError } = await supabase
        .from("currently_reading")
        .insert([supabaseBook]);

      if (insertError) {
        toast.error("Could not add book: " + insertError.message);
        return;
      }

      navigate(`/books/${id}/read`);
    } catch (err) {
      console.error("Error in handleReadFree:", err);
      toast.error("Error adding the book: " + (err as Error)?.message);
    } finally {
      setBookLoading(false);
    }
  }, [currentPlan, premiumBookClicked, navigate, id, book, imageUrl, authors]);

  const handleBookCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied");
  }, []);

  const handleAddWishlist = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Please log in to add to wishlist.");
      return;
    }

    const wishlistBook = {
      title: book?.title,
      bookId: book?.id,
      description: book?.summaries?.[0],
      cover: imageUrl,
      authors: authors,
      publishedAt: book?.authors?.[0].death_year,
      tier: premiumBookClicked ? "premium" : "free",
    };
    dispatch(updateWishlisted([wishlistBook]));

    try {
      if (wishlisted) {
        const { error } = await supabase
          .from("books")
          .delete()
          .eq("book_id", id)
          .eq("user_id", user.id);
        if (error) throw error;
        setWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        const supabaseBook = {
          user_id: user.id,
          book_id: id,
          title: book?.title,
          cover: imageUrl,
          description: book?.summaries?.[0],
          published_at: book?.authors?.[0]?.death_year,
          tier: premiumBookClicked ? "premium" : "free",
          authors: authors,
        };

        const { error } = await supabase
          .from("books")
          .upsert([supabaseBook], { onConflict: ["user_id", "book_id"] });
        if (error) throw error;
        setWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error: any) {
      console.error("Error updating wishlist:", error.message);
      toast.error(`Failed to update wishlist: ${error.message}`);
    }
  }, [wishlisted, id, book, imageUrl, premiumBookClicked, authors]);

  const tabs = ["summary", "chapters", "reviews", "similar books"];
  const tabLabels = ["Summary", "Chapters", "Reviews", "Similar Books"];

  if (loading) return <BookDetailsLoader />;
  if (error) return <h1>{error}</h1>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col bg-gray-50 p-4 sm:p-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <motion.div
            variants={itemVariants}
            className="w-full md:w-[400px] space-y-6"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                  className="relative aspect-[3/4] w-full max-w-[280px] mx-auto bg-gray-200 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <OptimizedImage
                    src={imageUrl}
                    alt={book?.title || "Book cover"}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`absolute top-3 left-3 ${
                      premiumBookClicked ? "bg-purple-600" : "bg-green-500"
                    } text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium backdrop-blur-sm`}
                  >
                    {premiumBookClicked ? "Premium book" : "Free"}
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="px-4 sm:px-6 py-3 border-b border-gray-100"
              >
                <div className="flex items-center gap-2 text-sm">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  </motion.div>
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500">(1 reviews)</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-4 sm:p-6 space-y-3"
              >
                <AnimatePresence mode="sync">
                  {bookLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <BookDetailsLoadingButton
                        title="Getting your book Ready"
                        isBlack={true}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <MemoizedActionButton
                        onClick={handleReadFree}
                        icon={BookOpen}
                        variant="primary"
                      >
                        {premiumBookClicked ? "Read Premium" : "Read Free"}
                      </MemoizedActionButton>
                    </motion.div>
                  )}
                </AnimatePresence>

                <MemoizedActionButton icon={Download} href={downloadUrl}>
                  Download
                </MemoizedActionButton>

                <MemoizedActionButton
                  onClick={handleAddWishlist}
                  disabled={wishlistLoading}
                  icon={Heart}
                  className={wishlisted ? "text-red-500" : ""}
                >
                  {wishlistLoading
                    ? "Checking..."
                    : wishlisted
                    ? "Wishlisted"
                    : "Add to wishlist"}
                </MemoizedActionButton>

                <MemoizedActionButton onClick={handleBookCopy} icon={Share2}>
                  Share Book
                </MemoizedActionButton>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="px-4 sm:px-6 pb-4 sm:pb-6"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Reading Progress</span>
                    <span className="text-gray-900 font-medium">
                      {readingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      variants={progressVariants}
                      initial="initial"
                      animate="animate"
                      custom={readingProgress}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 space-y-6">
            <motion.div variants={itemVariants} className="space-y-3">
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                {book?.title}
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                by <span className="text-gray-900 font-medium">{authors}</span>
              </motion.p>
              <motion.p
                className="text-gray-600 leading-relaxed text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {book?.summaries?.[0]}
              </motion.p>
            </motion.div>

            <MemoizedBookInfo book={book} pages={pages} />

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-sm border border-gray-200"
            >
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 text-sm sm:text-base">
                {tabLabels.map((label, index) => (
                  <motion.button
                    key={tabs[index]}
                    onClick={() => setActiveTab(tabs[index])}
                    className={`px-4 sm:px-6 py-3 sm:py-4 font-medium whitespace-nowrap relative ${
                      activeTab === tabs[index]
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    {label}
                    {activeTab === tabs[index] && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-6"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    {activeTab === "summary"
                      ? "Book Summary"
                      : activeTab === "chapters"
                      ? "Chapter List"
                      : activeTab === "reviews"
                      ? "User Reviews"
                      : "Similar Books"}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {activeTab === "summary"
                      ? book?.summaries?.[0]
                      : `${
                          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                        } content will be displayed here.`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(BookDetails);
