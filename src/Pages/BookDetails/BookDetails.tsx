import { useNavigate, useParams } from "react-router-dom";
import BookDetailsButton from "../../Component/BookDetailsButton";
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
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";

const BookDetails = () => {
  const [credentialsLoading, setCredentialsLoading] = useState<boolean>(true);
  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);
  const [bookLoading, setBookLoading] = useState<boolean>(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [boughtPremium, setBoughtPremium] = useState<boolean>(false);
  const { premiumBookClicked } = useSelector((state: RootState) => state.read);

  const { book, loading, error } = useFetchSingleBook({ id: Number(id) });
  useEffect(() => {
    const getSubscriptionStatus = async () => {
      if (!premiumBookClicked) return;

      try {
        setCredentialsLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          toast.error("could not find the user subscription Kindly login");
          navigate("/signup");
          return;
        }
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user?.id)
          .single();
        if (error) {
          setBoughtPremium(false);
          return;
        }
        setBoughtPremium(data.status === "active" && data.plan_type !== "free");
      } catch (err) {
        toast.error("error getting the user subscripion status");
        setBoughtPremium(false);

        navigate("/signup");
        return;
      } finally {
        setCredentialsLoading(false);
      }
    };
    getSubscriptionStatus();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      setWishlistLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/signup");
          setWishlistLoading(false);
          return;
        }

        const { data: books, error } = await supabase
          .from("books")
          .select("book_id")
          .eq("user_id", user.id)
          .eq("book_id", id);

        if (error) {
          console.error("Error fetching wishlist:", error);
          setWishlistLoading(false);
          return;
        }

        setWishlisted(books && books.length > 0);
        setWishlistLoading(false);
      } catch (err) {
        console.error("Unexpected error fetching wishlist:", err);
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, [id, navigate]);

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

  const handleReadFree = async () => {
    if (!boughtPremium) {
      toast.warning("buy premium to read this book");
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
        alert("User not found. Kindly login");
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
        alert(fetchError.message);
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
        published_at: book?.authors?.[0].death_year,
        authors: book?.authors?.map((author) => author.name).join(", "),
        tier: premiumBookClicked ? "premium" : "free",
      };

      const { error: insertError } = await supabase
        .from("currently_reading")
        .insert([supabaseBook]);

      if (insertError) {
        alert("Could not add book: " + insertError.message);
        return;
      }

      navigate(`/books/${id}/read`);
    } catch (err) {
      console.error("Error in handleReadFree:", err);
      alert("Error adding the book: " + (err as Error)?.message);
    } finally {
      setBookLoading(false);
    }
  };

  const pages = Math.floor(Math.random() * 500 + 100);
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
        console.log("🎉 First click of the day!");

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
          console.log(`Streak continues! Day ${newStreak}`);
        } else {
          newStreak = 1;
          console.log("Starting new streak");
        }
      } else {
        console.log("Welcome! Starting your first streak");
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

  const handleBookCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied");
  };

  const handleAddWishlist = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Please log in to add to wishlist.");
      return;
    }

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
          published_at: book?.authors?.[0].death_year,
          tier: premiumBookClicked ? "premium" : "free",
          authors:
            book?.authors?.map((author) => author.name).join(", ") || null,
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
  };

  if (loading) return <BookDetailsLoader />;
  if (error) return <h1>{error}</h1>;

  const imageUrl =
    book?.formats?.["image/jpeg"] ||
    book?.formats?.["image/png"] ||
    book?.formats?.["image/jpg"] ||
    "";

  const pdf = book?.formats?.["application/pdf"] || "";
  const epub = book?.formats?.["application/epub+zip"] || "";

  const rating = (Math.random() * 2 + 3).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Sidebar (Book Cover & Actions) */}
          <div className="w-full md:w-[400px] space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative p-4 sm:p-6 bg-gray-100">
                <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={imageUrl}
                    alt={book?.title}
                  />
                  <div
                    className={`absolute top-3 left-3 ${
                      premiumBookClicked ? "bg-purple-600" : "bg-green-500"
                    } text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium`}
                  >
                    {boughtPremium ? "Premium book" : "Free"}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500">(1 reviews)</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="p-4 sm:p-6 space-y-3">
                {bookLoading ? (
                  <BookDetailsLoadingButton
                    title="Getting your book Ready"
                    isBlack={true}
                  />
                ) : (
                  <BookDetailsButton
                    logo={BookOpen}
                    isBlack={true}
                    title={premiumBookClicked ? "Read Premium" : "Read Free"}
                    onClick={handleReadFree}
                  />
                )}

                <button className="w-full flex items-center justify-center gap-2 sm:gap-3 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200 text-sm sm:text-base">
                  <Download size={18} />
                  <a href={pdf === "" ? epub : pdf} className="font-medium">
                    Download
                  </a>
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleAddWishlist}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200 text-sm sm:text-base"
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <>
                      <Loader2
                        className="animate-spin text-gray-500"
                        size={18}
                      />
                      <span className="font-medium">Checking...</span>
                    </>
                  ) : (
                    <>
                      <Heart
                        size={18}
                        className={`${
                          wishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="font-medium">
                        {wishlisted ? "Wishlisted" : "Add to wishlist"}
                      </span>
                    </>
                  )}
                </button>

                {/* Share */}
                <button
                  onClick={handleBookCopy}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200 text-sm sm:text-base"
                >
                  <Share2 size={18} />
                  <span className="font-medium">Share Book</span>
                </button>
              </div>

              {/* Progress */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Reading Progress</span>
                    <span className="text-gray-900 font-medium">
                      {readingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 space-y-6">
            {/* Title + Summary */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {book?.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                by{" "}
                <span className="text-gray-900 font-medium">
                  {book?.authors?.map((author) => author.name).join(", ")}
                </span>
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {book?.summaries?.[0]}
              </p>
            </div>

            {/* Book Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Book Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                {/* Left column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-gray-500">Pages:</span>
                    <span className="ml-1 sm:ml-2 font-medium text-gray-900">
                      {pages}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-500">Reading Time:</span>
                    <span className="ml-1 sm:ml-2 font-medium text-gray-900">
                      5h 45m
                    </span>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-500">Published:</span>
                    <span className="ml-1 sm:ml-2 font-medium text-gray-900">
                      {book?.authors?.[0].death_year}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-500">Publisher:</span>
                    <span className="ml-1 sm:ml-2 font-medium text-gray-900">
                      {book?.authors?.[0]?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 text-sm sm:text-base">
                <button className="px-4 sm:px-6 py-3 sm:py-4 text-blue-600 border-b-2 border-blue-600 font-medium whitespace-nowrap">
                  Summary
                </button>
                <button className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">
                  Chapters
                </button>
                <button className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">
                  Reviews
                </button>
                <button className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">
                  Similar Books
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Book Summary
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {book?.summaries?.[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
