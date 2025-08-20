import {
  Check,
  BookOpen,
  Bookmark,
  ChevronDown,
  PenTool,
  Settings,
  Moon,
  Sun,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import {
  setFontFamily,
  setFontSize,
  setLetterSpacing,
  setLineHeight,
  toggleDark,
} from "../../Store/BookReadingSlice";
import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { toast } from "sonner";

interface sectionState {
  settings: boolean;
  highlights: boolean;
  bookmarks: boolean;
  notes: boolean;
}

const ReadingSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<sectionState>({
    settings: true,
    highlights: true,
    bookmarks: true,
    notes: true,
  });

  const dispatch = useDispatch();
  const {
    fontFamily,
    book,
    highlited: highlights,
    notes,
    fontSize,
    lineHeight,
    togglDark,
    letterSpacing,
  } = useSelector((state: RootState) => state.bookReading);

  const [readingProgress, setReadingProgress] = useState<number>(
    parseFloat(localStorage.getItem(`reading-progress-${book.id}`) || "0")
  );

  const [bookCompleted, setBookCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedProgress = localStorage.getItem(
        `reading-progress-${book.id}`
      );
      if (storedProgress) {
        setReadingProgress(JSON.parse(storedProgress));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [book.id]);
 
  
  useEffect(() => {
    const checkBookCompletionStatus = async () => {
      try {
        setIsCheckingStatus(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Failed to get user:", userError);
          return;
        }

        if (!user) {
          console.log("No user found");
          return;
        }

        const { data, error } = await supabase
          .from("completed_books")
          .select("*")
          .eq("user_id", user.id)
          .eq("book_id", book.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          console.error("Failed to get book completion status:", error);
          toast.error("Failed to check book status");
          return;
        }
        
       
        setBookCompleted(!!data);
        
      } catch (error) {
        console.error("Error checking book completion status:", error);
        toast.error("Failed to check book status");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkBookCompletionStatus();
  }, [book.id]);

  const fontFamilies = ["Georgia, serif", "sans-serif", "cursive", "monospace"];

  const toggleSection = (section: keyof sectionState) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getHighlightColor = (color: string) => {
    return togglDark ? `border border-gray-600/30` : `border border-gray-200`;
  };

  const bookAuthors = book.authors?.map((a) => a.name).join(", ");

  const toggleBookCompleted = async () => {
    if (isLoading) return; 
    
    try {
      setIsLoading(true);
      
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Please login to mark book as completed");
        return;
      }

      const completedBook = {
        user_id: user.id,
        book_id: book.id,
        cover: book?.formats?.["image/jpeg"],
        description: book?.summaries?.[0],
        title: book?.title,
        authors: bookAuthors,
      };
      const { data, error}=await supabase.from('currently_reading').delete().eq('user_id',user.id).eq('book_id',book.id)
      
      if(error){
        alert("error deleting the book from curently reading")
      }
      if (!bookCompleted) {
       
        const { data, error } = await supabase
          .from("completed_books")
          .upsert([completedBook], {
            onConflict: "user_id,book_id",
          });

        if (error) {
          console.error("Failed to mark book as completed:", error);
          toast.error("Failed to mark book as completed");
          return;
        }

        setBookCompleted(true);
        toast.success("Book marked as completed");
      } else {
        // Mark as uncompleted (DELETE)
        const { error } = await supabase
          .from("completed_books")
          .delete()
          .eq("user_id", user.id)
          .eq("book_id", book.id);

        if (error) {
          console.error("Failed to mark book as uncompleted:", error);
          toast.error("Failed to mark book as uncompleted");
          return;
        }

        setBookCompleted(false);
        toast.success("Book marked as uncompleted");
      }
    } catch (error) {
      console.error("Error toggling book completion:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-80 h-screen border-r ${
        togglDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="h-full overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <BookOpen
                className={`w-5 h-5 ${
                  togglDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <div>
                <h1
                  className={`text-lg font-semibold ${
                    togglDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {book.title}
                </h1>
                <p
                  className={`text-sm ${
                    togglDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Chapter 2
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch(toggleDark())}
              className={`p-2 rounded-lg ${
                togglDark
                  ? "text-yellow-400 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {togglDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          <div
            className={`w-full rounded-full h-2 ${
              togglDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`bg-blue-600 h-2 rounded-full `}
              style={{ width: `${readingProgress}%` }}
            ></div>
          </div>
          <p
            className={`text-xs mt-2 ${
              togglDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {Math.ceil(readingProgress)}% Complete
          </p>
        </div>

        {/* Reading Settings */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("settings")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings
                className={`w-4 h-4 ${
                  togglDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <h2
                className={`font-medium ${
                  togglDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Reading Settings
              </h2>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.settings ? "rotate-180" : ""
              } ${togglDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>

          {expandedSections.settings && (
            <div className="mt-3 space-y-4 px-3">
              {/* Font Size */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    togglDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => dispatch(setFontSize(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12px</span>
                  <span>{fontSize}px</span>
                  <span>24px</span>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    togglDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) =>
                    dispatch(
                      setFontFamily(
                        e.target.value as
                          | "Georgia, serif"
                          | "sans-serif"
                          | "cursive"
                          | "monospace"
                      )
                    )
                  }
                  className={`w-full p-2 border rounded-lg text-sm ${
                    togglDark
                      ? "bg-gray-800 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {fontFamilies.map((font: any) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Height */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    togglDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Line Height
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => dispatch(setLineHeight(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1.2</span>
                  <span>{lineHeight}</span>
                  <span>2.0</span>
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    togglDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Letter Spacing
                </label>
                <input
                  type="range"
                  min="-0.5"
                  max="2"
                  step="0.1"
                  value={letterSpacing}
                  onChange={(e) => dispatch(setLetterSpacing(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-0.5px</span>
                  <span>{letterSpacing}px</span>
                  <span>2px</span>
                </div>
              </div>

              {/* Preview */}
              <div
                className={`p-3 border rounded-lg ${
                  togglDark
                    ? "bg-gray-800/50 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-2 ${
                    togglDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Preview
                </p>
                <p
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}px`,
                  }}
                  className={`${togglDark ? "text-gray-200" : "text-gray-700"}`}
                >
                  The practice of mindfulness brings awareness to the present
                  moment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Highlights */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toggleSection("highlights")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <PenTool
                className={`w-4 h-4 ${
                  togglDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <h2
                className={`font-medium ${
                  togglDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Highlights
              </h2>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.highlights ? "rotate-180" : ""
              } ${togglDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>

          {expandedSections.highlights && (
            <div className="mt-3 space-y-2 px-3">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${getHighlightColor(
                    highlight.color
                  )}`}
                  style={{
                    backgroundColor: highlight.color
                      ? `${highlight.color}30`
                      : "#fbbf2430",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          togglDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Highlight
                      </span>
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: highlight.color || "#fbbf24",
                        }}
                      ></div>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${
                      togglDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {highlight.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toggleSection("notes")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <PenTool
                className={`w-4 h-4 ${
                  togglDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <h2
                className={`font-medium ${
                  togglDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Notes
              </h2>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.notes ? "rotate-180" : ""
              } ${togglDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>

          {expandedSections.notes && (
            <div className="mt-3 space-y-2 px-3">
              {notes.length === 0 ? (
                <p
                  className={`text-sm text-center py-4 ${
                    togglDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No notes yet
                </p>
              ) : (
                notes.map((note, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      togglDark
                        ? "bg-gray-800/50 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          togglDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Note
                      </span>
                    </div>
                    <blockquote
                      className={`text-xs italic mb-2 p-2 rounded ${
                        togglDark
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      "{note.selectedText}"
                    </blockquote>
                    <p
                      className={`text-sm ${
                        togglDark ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {note.note}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Complete Chapter Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleBookCompleted}
            disabled={isLoading || isCheckingStatus}
            className={`w-full font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] ${
              isLoading || isCheckingStatus
                ? "opacity-50 cursor-not-allowed"
                : bookCompleted
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : isCheckingStatus ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking status...</span>
              </>
            ) : bookCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
                <span>Mark as Unread</span>
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${togglDark ? "#4B5563 #1F2937" : "#CBD5E1 #F1F5F9"};
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${togglDark ? "#1F2937" : "#F1F5F9"};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${togglDark ? "#4B5563" : "#CBD5E1"};
          border-radius: 4px;
          border: 2px solid ${togglDark ? "#1F2937" : "#F1F5F9"};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${togglDark ? "#6B7280" : "#94A3B8"};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: ${togglDark ? "#374151" : "#64748B"};
        }
      `}</style>
    </div>
  );
};

export default ReadingSidebar;