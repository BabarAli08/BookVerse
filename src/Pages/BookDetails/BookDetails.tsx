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
import { DotsLoader } from "../../Component/Loading";
import { toast } from "sonner";
import BookDetailsLoader from "../../Component/BookDetailsLoader";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client";

const BookDetails = () => {
  const [wishlisted, setWishlisted] = useState(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  const { id } = useParams();
  const navigate = useNavigate();

  const { book, loading, error } = useFetchSingleBook({ id: Number(id) });

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        const { data: books, error } = await supabase
          .from("books")
          .select("book_id")
          .eq("user_id", user.id)
          .eq("book_id", id);

        if (error) {
          console.error("Error fetching wishlist:", error);
          return;
        }

        setWishlisted(books && books.length > 0);
      } catch (err) {
        console.error("Unexpected error fetching wishlist:", err);
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
    try {
      // Get user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not found. Kindly login");
        navigate("/login");
        return;
      }

      // Track user activity
      await trackUserActivity(user.id);

      // Check if book is completed
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
        // Remove from currently_reading if it exists there
        await supabase
          .from("currently_reading")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", id);

        navigate(`/books/${id}/read`);
        return;
      }

      // Check if book is already in currently_reading
      const { data: currentlyReading } = await supabase
        .from("currently_reading")
        .select("book_id")
        .eq("user_id", user.id)
        .eq("book_id", id);

      // If already in currently_reading, just navigate
      if (currentlyReading && currentlyReading.length > 0) {
        navigate(`/books/${id}/read`);
        return;
      }

      // Book is not completed and not in currently_reading, so add it
      const supabaseBook = {
        book_id: book?.id,
        user_id: user?.id,
        title: book?.title,
        description: book?.summaries?.[0] || null,
        cover: imageUrl,
        published_at: book?.authors?.[0].death_year,
        authors: book?.authors?.map((author) => author.name).join(", "),
        tier: "free",
      };

      const { error: insertError } = await supabase
        .from("currently_reading")
        .insert([supabaseBook]);

      if (insertError) {
        alert(
          "Could not add book to currently reading: " + insertError.message
        );
        return;
      }

      // Navigate to reading page
      navigate(`/books/${id}/read`);
    } catch (err) {
      console.error("Error in handleReadFree:", err);
      alert("Error adding the book to currently reading: " + (err as Error)?.message);
    }
  };

  // Extract the activity tracking into a separate function
  const trackUserActivity = async (userId:string) => {
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

  const updateUserStreak = async (userId :string, today:string) => {
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
          console.log(`🔥 Streak continues! Day ${newStreak}`);
        } else {
          newStreak = 1;
          console.log("🔄 Starting new streak");
        }
      } else {
        console.log("🆕 Welcome! Starting your first streak");
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
        console.log(`✅ Streak updated: ${newStreak} days`);
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
          tier: "free",
          authors: book?.authors?.map((author) => author.name).join(", "),
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

  // Early returns after all hooks
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          <div className="w-[400px] space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative p-6 bg-gray-100">
                <div className="relative aspect-[3/4] max-w-[280px] mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full text-gray-400">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src={imageUrl}
                      alt={book?.title}
                    />
                  </div>

                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    Free
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500 text-sm">(1 reviews)</span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <BookDetailsButton
                  logo={BookOpen}
                  isBlack={true}
                  title="Read Free"
                  onClick={handleReadFree}
                />

                <button className="w-full flex items-center justify-center gap-3 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200">
                  <Download size={18} />
                  <a href={pdf === "" ? epub : pdf} className="font-medium">
                    Download
                  </a>
                </button>

                <button
                  onClick={handleAddWishlist}
                  className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200"
                >
                  <Heart
                    size={18}
                    className={`text-gray-400 hover:text-black ${
                      wishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span className="font-medium">
                    {wishlisted ? "Wishlisted" : "Add to wishlist"}
                  </span>
                </button>

                <button
                  onClick={handleBookCopy}
                  className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200"
                >
                  <Share2 size={18} />
                  <span className="font-medium">Share Book</span>
                </button>
              </div>

              <div className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
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

          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900">
                {book?.title}
              </h1>
              <p className="text-lg text-gray-600">
                by{" "}
                <span className="text-gray-900 font-medium">
                  {book?.authors?.map((author) => author.name).join(", ")}
                </span>
              </p>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                {book?.summaries?.[0]}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Book Information
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Pages:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        380
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">
                        Reading Time:
                      </span>
                      <span className="ml-2 font-medium text-gray-900">
                        5h 45m
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Published:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {book?.authors?.[0].death_year}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Publisher:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {book?.authors?.[0]?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-sm">
                  Available Formats:
                </span>
                <div className="flex gap-2 mt-2">
                  <a
                    href={pdf}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium "
                  >
                    PDF {pdf === "" ? "unavailable" : ""}
                  </a>
                  <a
                    href={epub}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                  >
                    EPUB {epub === "" ? "unavailable" : ""}
                  </a>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                  Summary
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Chapters
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Reviews
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Similar Books
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Book Summary
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
