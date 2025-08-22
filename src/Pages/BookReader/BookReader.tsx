// src/Pages/BookReader/BookReader.tsx
import { useNavigate, useParams } from "react-router-dom";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import BookFetchError from "../../Component/BookFetchError";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReadingBook } from "../../Store/BookReadingSlice";
import Header from "./Header";
import type { RootState } from "../../Store/store";
import ReadingSidebar from "./SideBar";
import Highlighting from "./Highlighting";
import Navbar from "../../Component/Navbar/Navbar";
import FocusModeSettings from "./FocusModeSettings";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const BookReader = () => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [selectedPosition, setSelectedPosition] = useState({ x: 0, y: 0 });
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [focusSettingsOpen, setFocusSettingsOpen] = useState<boolean>(false);
  const [progressTooltip, setProgressTooltip] = useState({
    show: false,
    percentage: 0,
    x: 0,
  });
  const [bookContent, setBookContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);

  const bookContentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { book, loading, error } = useFetchSingleBook({ id: Number(id) });

  const {
    togglDark,
    toggleSidebar,
    lineHeight,
    fontFamily,
    fontSize,
    theme,
    isFocused,
  } = useSelector((state: RootState) => state.bookReading);

  const handleScroll = useCallback(
    throttle(() => {
      const el = bookContentRef.current;
      if (!el || !isContentReady) return;

      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      if (maxScrollTop <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = Math.max(
        0,
        Math.min(100, (scrollTop / maxScrollTop) * 100)
      );
      setScrollProgress(progress);
    }, 16),
    [isContentReady]
  );

  useEffect(() => {
    const container = bookContentRef.current;
    if (container && isContentReady) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll, isContentReady]);

  const handleSeek = useCallback(
    (percentage: number) => {
      const container = bookContentRef.current;
      if (!container || !isContentReady) return;

      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      if (maxScrollTop <= 0) return;

      const targetScrollTop = (clampedPercentage / 100) * maxScrollTop;

      try {
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      } catch (error) {
        container.scrollTop = targetScrollTop;
      }
    },
    [isContentReady]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target !== document.body &&
        !(e.target as HTMLElement)?.closest(".book-reader-container")
      )
        return;

      const step = e.shiftKey ? 10 : 5;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          handleSeek(Math.min(100, scrollProgress + step));
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          handleSeek(Math.max(0, scrollProgress - step));
          break;
        case "Home":
          e.preventDefault();
          handleSeek(0);
          break;
        case "End":
          e.preventDefault();
          handleSeek(100);
          break;
        case " ":
          e.preventDefault();
          if (e.shiftKey) {
            handleSeek(Math.max(0, scrollProgress - 20));
          } else {
            handleSeek(Math.min(100, scrollProgress + 20));
          }
          break;
      }
    },
    [scrollProgress, handleSeek]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);

        if (
          bookContentRef.current &&
          bookContentRef.current.contains(range.commonAncestorContainer)
        ) {
          const rect = range.getBoundingClientRect();
          setSelectedText(selection.toString().trim());
          setSelectedPosition({ x: rect.x, y: rect.y - 60 });
          setShowOptions(true);
        } else {
          clearSelection();
        }
      }
    }, 50);
  };

  const clearSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    setSelectedText("");
    setShowOptions(false);
  };

  const handleCloseHighlighting = () => {
    clearSelection();
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  const getBookUrl = () => {
    if (!book?.formats) return "";

    return (
      book.formats["text/html"] ||
      book.formats["text/html; charset=utf-8"] ||
      book.formats["text/plain; charset=utf-8"] ||
      book.formats["text/plain"] ||
      ""
    );
  };

  const htmlUrl = getBookUrl();

  useEffect(() => {
    if (book) dispatch(setReadingBook(book));
  }, [book, dispatch]);

  const fetchWithProxy = async (url: string): Promise<string> => {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      url
    )}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const data = await response.json();
    return data.contents;
  };

  const processBookHtml = (html: string): string => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<link\b[^>]*>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<\/?html[^>]*>/gi, "")
      .replace(/<\/?body[^>]*>/gi, "");
  };

  useEffect(() => {
    if (!htmlUrl) return;

    const fetchContent = async () => {
      setContentLoading(true);
      setContentError(null);
      setIsContentReady(false);

      try {
        const html = await fetchWithProxy(htmlUrl);
        const processedHtml = processBookHtml(html);
        setBookContent(processedHtml);

        setTimeout(() => {
          setIsContentReady(true);
        }, 500);
      } catch (error) {
        setContentError("Failed to load book content");
        console.error("Error fetching book:", error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [htmlUrl]);

  const debouncedSaveProgress = useCallback(
    debounce((bookId: number, progress: number) => {
      if (progress > 0) {
        localStorage.setItem(`reading-progress-${bookId}`, progress.toFixed(2));
      }
    }, 1000),
    []
  );

  useEffect(() => {
    if (book?.id && scrollProgress > 0) {
      debouncedSaveProgress(Number(book?.id), scrollProgress);
    }
  }, [book?.id, scrollProgress, debouncedSaveProgress]);

  useEffect(() => {
    if (book?.id && bookContentRef.current && isContentReady) {
      const savedProgress = localStorage.getItem(`reading-progress-${book.id}`);
      if (savedProgress) {
        const progress = parseFloat(savedProgress);

        const restoreProgress = () => {
          const container = bookContentRef.current;
          if (container && container.scrollHeight > container.clientHeight) {
            handleSeek(progress);
          } else {
            setTimeout(restoreProgress, 200);
          }
        };

        setTimeout(restoreProgress, 1000);
      }
    }
  }, [book?.id, isContentReady, handleSeek]);

  const handleProgressBarClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    handleSeek(percentage);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));

    setProgressTooltip({
      show: true,
      percentage: Math.round(percentage),
      x: Math.max(20, Math.min(rect.width - 20, mouseX)),
    });
  };

  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-2xl">Loading book...</h1>
      </div>
    );

  if (error)
    return (
      <BookFetchError
        onRetry={() => window.location.reload()}
        onGoHome={() => navigate("/")}
        onSearch={() => navigate("/books")}
      />
    );

  if (contentLoading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-2xl">Loading book content...</h1>
      </div>
    );

  if (contentError)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <h1
            className={`text-2xl mb-4 ${
              togglDark ? "text-red-400" : "text-red-600"
            }`}
          >
            Error Loading Book
          </h1>
          <p
            className={`mb-4 ${togglDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {contentError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              togglDark
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className={`${togglDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {!isFocused && <Navbar />}
      
      {/* Move FocusModeSettings outside the main layout flow */}
      <FocusModeSettings />
      
      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <Highlighting onClose={handleCloseHighlighting} text={selectedText} />
        </div>
      )}
      
      <div
        className={`min-h-screen transition-colors duration-300 ${
          togglDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {!isFocused && <Header />}

        <div className="flex h-[calc(100vh-64px)]">
          {toggleSidebar && !isFocused && ( // Hide sidebar in focus mode
            <div className="flex-shrink-0">
              <ReadingSidebar />
            </div>
          )}

          <div className="flex-1 flex justify-center items-start p-6">
            <div
              className={`
              w-full h-full rounded-xl shadow-2xl transition-all duration-300
              book-reader-container
              ${
                togglDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-850 text-gray-100 shadow-black/30 border border-gray-700/50"
                  : "bg-gradient-to-br from-white to-gray-50 text-gray-900 shadow-gray-300/40 border border-gray-200/50"
              }
              ${isFocused ? "max-w-4xl mx-auto" : "max-w-5xl"}
              `}
            >
              <div
                ref={bookContentRef}
                className={`
                h-full overflow-auto rounded-xl custom-scrollbar
                ${theme?.bg || (togglDark ? 'bg-gray-800' : 'bg-white')}
                ${theme?.text || (togglDark ? "text-gray-100" : "text-gray-800")}
                ${isFocused ? "px-16 py-12" : "px-12 py-10"}
              `}
                dangerouslySetInnerHTML={{ __html: bookContent }}
                style={{
                  fontFamily: fontFamily,
                  fontSize: fontSize + "px",
                  lineHeight: lineHeight,
                }}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`fixed top-0 left-0 w-full z-40 ${isFocused ? 'opacity-30 hover:opacity-80' : ''} transition-opacity duration-300`}>
          <div
            className={`
              w-full cursor-pointer transition-all duration-300 relative group
              ${isProgressHovered ? "h-3" : "h-1.5"}
              backdrop-blur-sm
            `}
            onClick={handleProgressBarClick}
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => {
              setIsProgressHovered(false);
              setProgressTooltip({ show: false, percentage: 0, x: 0 });
            }}
            onMouseMove={handleProgressBarMouseMove}
            title={`Reading progress: ${Math.round(scrollProgress)}%`}
          >
            <div
              className={`
                w-full h-full rounded-full transition-all duration-300
                ${
                  togglDark
                    ? "bg-gradient-to-r from-gray-800/60 via-gray-700/60 to-gray-800/60 shadow-lg shadow-black/20"
                    : "bg-gradient-to-r from-gray-200/80 via-gray-300/80 to-gray-200/80 shadow-md shadow-gray-400/20"
                }
                ${isProgressHovered ? "shadow-xl scale-y-110" : ""}
              `}
            >
              <div
                className={`
                  h-full transition-all duration-500 ease-out relative overflow-hidden rounded-full
                  ${isProgressHovered ? "shadow-lg" : ""}
                `}
                style={{
                  width: `${Math.max(0, Math.min(100, scrollProgress))}%`,
                  background: togglDark
                    ? `linear-gradient(90deg, 
                        #6366f1 0%,
                        #8b5cf6 25%,
                        #a855f7 50%,
                        #ec4899 75%,
                        #f43f5e 100%)`
                    : `linear-gradient(90deg,
                        #3b82f6 0%,
                        #6366f1 25%,
                        #8b5cf6 50%,
                        #a855f7 75%,
                        #d946ef 100%)`,
                  boxShadow: isProgressHovered
                    ? togglDark
                      ? "0 4px 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)"
                      : "0 4px 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(99, 102, 241, 0.15)"
                    : undefined,
                }}
              >
                <div
                  className={`
                    absolute inset-0 opacity-40
                    bg-gradient-to-r from-transparent via-white to-transparent
                    transform -skew-x-12 w-20
                    ${scrollProgress > 0 ? "animate-shimmer" : ""}
                  `}
                />

                <div
                  className={`
                    absolute top-0 right-0 w-4 h-full
                    bg-gradient-to-l from-white/60 to-transparent
                    rounded-full blur-sm
                    ${scrollProgress > 2 ? "opacity-100" : "opacity-0"}
                    transition-opacity duration-300
                  `}
                />
              </div>

              {scrollProgress > 1 && (
                <div
                  className={`
                    absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2
                    rounded-full transition-all duration-300 z-10
                    ${
                      isProgressHovered
                        ? "w-4 h-4 scale-125"
                        : "w-2.5 h-2.5 scale-100"
                    }
                    ${
                      togglDark
                        ? "bg-white shadow-lg ring-2 ring-indigo-400/40"
                        : "bg-white shadow-xl ring-2 ring-blue-400/50"
                    }
                    ${isProgressHovered ? "animate-pulse" : ""}
                  `}
                  style={{
                    left: `${Math.max(2, Math.min(98, scrollProgress))}%`,
                    boxShadow: isProgressHovered
                      ? togglDark
                        ? "0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)"
                        : "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(99, 102, 241, 0.2)"
                      : undefined,
                  }}
                >
                  <div
                    className={`
                      absolute inset-1 rounded-full
                      ${togglDark ? "bg-indigo-400" : "bg-blue-500"}
                      ${isProgressHovered ? "animate-ping" : ""}
                    `}
                  />
                </div>
              )}

              {progressTooltip.show && isProgressHovered && (
                <div
                  className={`
                    absolute top-4 px-4 py-3 rounded-xl text-xs font-medium pointer-events-none
                    transition-all duration-200 z-20 backdrop-blur-md transform -translate-x-1/2
                    ${
                      togglDark
                        ? "bg-gray-900/95 text-gray-100 border border-gray-700/50 shadow-2xl shadow-black/40"
                        : "bg-white/95 text-gray-800 border border-gray-200/50 shadow-2xl shadow-gray-500/20"
                    }
                    animate-in fade-in slide-in-from-top-2 duration-200
                  `}
                  style={{
                    left: `${progressTooltip.x}px`,
                  }}
                >
                  <div className="text-center">
                    <div className="font-bold text-sm flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          togglDark ? "bg-indigo-400" : "bg-blue-500"
                        } animate-pulse`}
                      ></div>
                      {progressTooltip.percentage}%
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {progressTooltip.percentage === 0
                        ? "Beginning"
                        : progressTooltip.percentage === 100
                        ? "The End"
                        : "Click to jump here"}
                    </div>
                  </div>

                  <div
                    className={`
                      absolute top-full left-1/2 transform -translate-x-1/2
                      w-0 h-0 border-l-4 border-r-4 border-t-4
                      ${
                        togglDark
                          ? "border-l-transparent border-r-transparent border-t-gray-900/95"
                          : "border-l-transparent border-r-transparent border-t-white/95"
                      }
                    `}
                  />
                </div>
              )}
            </div>

            <div
              className={`
                absolute top-2 right-4 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-300 backdrop-blur-sm
                ${
                  scrollProgress > 1
                    ? "opacity-80 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-4 scale-90"
                }
                ${
                  togglDark
                    ? "bg-gray-800/90 text-gray-300 border border-gray-700/50 shadow-lg"
                    : "bg-white/90 text-gray-600 border border-gray-300/50 shadow-md"
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    togglDark ? "bg-indigo-400" : "bg-blue-500"
                  } animate-pulse`}
                ></div>
                <span>{Math.round(scrollProgress)}% complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(400%) skewX(-12deg); }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-from-top-2 {
          from { transform: translateY(-8px) translateX(-50%); }
          to { transform: translateY(0) translateX(-50%); }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.2s ease-out;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${
            togglDark ? "#4B5563 #1F2937" : "#CBD5E1 #F1F5F9"
          };
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 20px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${togglDark ? "#1F2937" : "#F1F5F9"};
          border-radius: 10px;
          margin: 20px 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${
            togglDark
              ? "linear-gradient(180deg, #6B7280 0%, #4B5563 100%)"
              : "linear-gradient(180deg, #94A3B8 0%, #64748B 100%)"
          };
          border-radius: 10px;
          border: 2px solid ${togglDark ? "#1F2937" : "#F1F5F9"};
          transition: all 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${
            togglDark
              ? "linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)"
              : "linear-gradient(180deg, #64748B 0%, #475569 100%)"
          };
          transform: scaleY(1.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: ${togglDark ? "#374151" : "#334155"};
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${togglDark ? "#1F2937" : "#F1F5F9"};
        }

        /* Enhanced book content styling */
        .book-reader-container h1,
        .book-reader-container h2,
        .book-reader-container h3,
        .book-reader-container h4,
        .book-reader-container h5,
        .book-reader-container h6 {
          color: ${togglDark ? "#F3F4F6" : "#1F2937"};
          margin-top: 2em;
          margin-bottom: 1em;
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        .book-reader-container h1 {
          font-size: 2em;
          border-bottom: 2px solid ${togglDark ? "#374151" : "#E5E7EB"};
          padding-bottom: 0.5em;
        }

        .book-reader-container h2 {
          font-size: 1.6em;
        }

        .book-reader-container h3 {
          font-size: 1.3em;
        }

        .book-reader-container p {
          margin-bottom: 1.5em;
          text-align: justify;
          hyphens: auto;
          word-spacing: 0.05em;
        }

        .book-reader-container blockquote {
          border-left: 4px solid ${togglDark ? "#6366F1" : "#3B82F6"};
          padding-left: 1.5em;
          margin: 2em 0;
          font-style: italic;
          background: ${
            togglDark ? "rgba(99, 102, 241, 0.1)" : "rgba(59, 130, 246, 0.05)"
          };
          padding: 1em 1.5em;
          border-radius: 0.5em;
        }

        .book-reader-container a {
          color: ${togglDark ? "#60A5FA" : "#2563EB"};
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: all 0.2s ease;
        }

        .book-reader-container a:hover {
          text-decoration-color: currentColor;
          text-decoration-thickness: 2px;
        }

        .book-reader-container img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
          box-shadow: 0 4px 12px ${
            togglDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"
          };
          margin: 2em 0;
        }

        .book-reader-container ul,
        .book-reader-container ol {
          margin-left: 1.5em;
        }

        .book-reader-container ul li,
        .book-reader-container ol li {
          margin-bottom: 0.5em;
        }

        .book-reader-container code {
          color: ${togglDark ? "#60A5FA" : "#2563EB"};
          background: ${
            togglDark ? "rgba(99, 102, 241, 0.1)" : "rgba(59, 130, 246, 0.05)"
          };
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default BookReader;