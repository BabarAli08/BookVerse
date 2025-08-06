import {
  Check,
  BookOpen,
  Bookmark,
  ChevronDown,
  PenTool,
  Settings,
  Moon,
  Sun,
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

  useEffect(() => {
    const interval=setInterval(()=>{
      const storedProgress = localStorage.getItem(`reading-progress-${book.id}`);
      if (storedProgress) {
        setReadingProgress(JSON.parse(storedProgress));
      }

    },1000)
    return () => clearInterval(interval)

    
  }, [book.id]);
  const [bookmarks] = useState([
    { id: 1, title: "Introduction to Mindfulness", completed: false },
    { id: 2, title: "The Science Behind Meditation", completed: true },
    { id: 3, title: "Breathing Techniques", completed: false },
  ]);

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

  const toggleComplete = (type: string, id: number) => {
    console.log(`Toggling ${type} completion for id: ${id}`);
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

        {/* Bookmarks */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toggleSection("bookmarks")}
            className={`flex items-center justify-between w-full p-3 rounded-lg ${
              togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark
                className={`w-4 h-4 ${
                  togglDark ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <h2
                className={`font-medium ${
                  togglDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Bookmarks
              </h2>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedSections.bookmarks ? "rotate-180" : ""
              } ${togglDark ? "text-gray-400" : "text-gray-600"}`}
            />
          </button>

          {expandedSections.bookmarks && (
            <div className="mt-3 space-y-1 px-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  <span
                    className={`text-sm flex-1 ${
                      bookmark.completed
                        ? togglDark
                          ? "line-through text-gray-500"
                          : "line-through text-gray-400"
                        : togglDark
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}
                  >
                    {bookmark.title}
                  </span>
                  <button
                    onClick={() => toggleComplete("bookmark", bookmark.id)}
                    className={`p-1 rounded ${
                      bookmark.completed
                        ? "bg-green-500 text-white"
                        : togglDark
                        ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complete Chapter Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Mark Chapter Complete
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
