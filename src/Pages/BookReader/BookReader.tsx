
import { useNavigate, useParams } from "react-router-dom";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import BookFetchError from "../../Component/BookFetchError";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPreferances, setReadingBook } from "../../Store/BookReadingSlice";
import Header from "./Header";
import type { RootState } from "../../Store/store";
import ReadingSidebar from "./SideBar";
import Highlighting from "./Highlighting";
import Navbar from "../../Component/Navbar/Navbar";
import FocusModeSettings from "./FocusModeSettings";
import supabase from "../../supabase-client";
import { toast } from "sonner";

interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  text: string;
}

interface BackgroundOption {
  id: string;
  name: string;
  pattern: string;
  preview: string;
}

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
  const [isMobile, setIsMobile] = useState(false);

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
    letterSpacing,
    background,
    isFocused,
  } = useSelector((state: RootState) => state.bookReading);

 
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const backgroundOptions: BackgroundOption[] = [
    { id: "none", name: "None", pattern: "", preview: "bg-transparent" },
    {
      id: "notebook-paper",
      name: "Notebook Paper",
      pattern:
        "repeating-linear-gradient(transparent, transparent 23px, #3b82f6 24px, #3b82f6 25px), linear-gradient(90deg, #ef4444 0px, #ef4444 1px, transparent 1px, transparent 80px)",
      preview: "bg-white",
    },
    {
      id: "graph-paper",
      name: "Graph Paper",
      pattern:
        "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
      preview: "bg-blue-50",
    },
    {
      id: "parchment",
      name: "Parchment",
      pattern:
        "radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(160, 82, 45, 0.08) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(205, 133, 63, 0.04) 0%, transparent 50%)",
      preview: "bg-amber-100",
    },
    {
      id: "aged-paper",
      name: "Aged Paper",
      pattern:
        "radial-gradient(circle at 10% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 30%), radial-gradient(circle at 90% 20%, rgba(160, 82, 45, 0.08) 0%, transparent 40%), radial-gradient(circle at 30% 90%, rgba(205, 133, 63, 0.09) 0%, transparent 35%), radial-gradient(circle at 80% 80%, rgba(222, 184, 135, 0.06) 0%, transparent 45%)",
      preview: "bg-yellow-100",
    },
    {
      id: "watermark",
      name: "Watermark",
      pattern:
        "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)",
      preview: "bg-gray-50",
    },
    {
      id: "rice-paper",
      name: "Rice Paper",
      pattern:
        "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(circle at 6px 14px, rgba(0,0,0,0.06) 1px, transparent 1px), radial-gradient(circle at 14px 6px, rgba(0,0,0,0.07) 1px, transparent 1px)",
      preview: "bg-stone-50",
    },
    {
      id: "canvas",
      name: "Canvas",
      pattern:
        "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
      preview: "bg-neutral-50",
    },
    {
      id: "linen",
      name: "Linen",
      pattern:
        "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px), repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      preview: "bg-slate-50",
    },
    {
      id: "fabric",
      name: "Fabric",
      pattern:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 4px)",
      preview: "bg-gray-100",
    },
    {
      id: "vintage-dots",
      name: "Vintage Dots",
      pattern:
        "radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.15) 1px, transparent 1px), radial-gradient(circle at 12px 12px, rgba(160, 82, 45, 0.12) 1px, transparent 1px)",
      preview: "bg-amber-50",
    },
    {
      id: "crosshatch",
      name: "Crosshatch",
      pattern:
        "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 10px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(0,0,0,0.06) 8px, rgba(0,0,0,0.06) 10px)",
      preview: "bg-slate-100",
    },
    {
      id: "manuscript",
      name: "Manuscript",
      pattern:
        "linear-gradient(90deg, rgba(139, 69, 19, 0.15) 0px, rgba(139, 69, 19, 0.15) 2px, transparent 2px, transparent 100%), repeating-linear-gradient(transparent, transparent 19px, rgba(139, 69, 19, 0.3) 20px, rgba(139, 69, 19, 0.3) 21px)",
      preview: "bg-orange-50",
    },
    {
      id: "stipple",
      name: "Stipple",
      pattern:
        "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 0.5px, transparent 0.5px), radial-gradient(circle at 5px 3px, rgba(0,0,0,0.08) 0.5px, transparent 0.5px), radial-gradient(circle at 3px 7px, rgba(0,0,0,0.09) 0.5px, transparent 0.5px), radial-gradient(circle at 8px 6px, rgba(0,0,0,0.07) 0.5px, transparent 0.5px)",
      preview: "bg-stone-100",
    },
    {
      id: "zen-waves",
      name: "Zen Waves",
      pattern:
        "repeating-radial-gradient(ellipse at 50% 0%, transparent 0%, transparent 40%, rgba(0,0,0,0.04) 41%, rgba(0,0,0,0.04) 43%, transparent 44%)",
      preview: "bg-blue-50",
    },
    {
      id: "organic",
      name: "Organic",
      pattern:
        "radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(16, 185, 129, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 60% 20%, rgba(52, 211, 153, 0.04) 0%, transparent 40%)",
      preview: "bg-emerald-50",
    },
    {
      id: "minimalist-lines",
      name: "Minimalist Lines",
      pattern:
        "repeating-linear-gradient(180deg, transparent, transparent 40px, rgba(0,0,0,0.04) 40px, rgba(0,0,0,0.04) 42px)",
      preview: "bg-neutral-50",
    },
    {
      id: "dots",
      name: "Simple Dots",
      pattern:
        "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
      preview: "bg-white",
    },
    {
      id: "diagonal-stripes",
      name: "Diagonal Stripes",
      pattern:
        "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)",
      preview: "bg-gray-50",
    },
  ];

  const themeOptions: ThemeOption[] = [
    { id: "light", name: "Light", bg: "bg-white", text: "text-gray-900" },
    { id: "sepia", name: "Sepia", bg: "bg-amber-50", text: "text-amber-900" },
    { id: "dark", name: "Dark", bg: "bg-slate-800", text: "text-white" },
    { id: "forest", name: "Forest", bg: "bg-green-50", text: "text-green-800" },
    { id: "ocean", name: "Ocean", bg: "bg-blue-50", text: "text-blue-800" },
    {
      id: "lavender",
      name: "Lavender",
      bg: "bg-purple-50",
      text: "text-purple-800",
    },
  ];

  useEffect(() => {
    const getUserPreferances = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data: userSettings, error } = await supabase
        .from("reading_preferances")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        toast.warning("could not load your preferances");
        return;
      } else if (userSettings && userSettings.length > 0) {
        const preferances = {
          readingTheme:
            themeOptions.find((theme) => theme.id === userSettings[0]?.theme) ||
            themeOptions[0],
          background:
            backgroundOptions.find(
              (background) => background.id === userSettings[0]?.background
            ) || backgroundOptions[0],
          fontFamily: userSettings[0]?.font_family || "Serif",
          fontSize: userSettings[0]?.font_size || "Medium",
          lineSpacing: userSettings[0]?.line_spacing || "Normal",
        };
        dispatch(setPreferances(preferances));
      }
    };
    getUserPreferances();
  }, []);

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

  const mapFontFamily = (fontFamily: string): string => {
    switch (fontFamily) {
      case "Sans Serif":
        return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
      case "Monospace":
        return "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace";
      case "Dyslexic":
        return "OpenDyslexic, sans-serif";
      case "Serif":
        return "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
      default:
        return "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
    }
  };

  const mapLineHeight = (lineHeight: string): string => {
    switch (lineHeight) {
      case "Tight":
        return "1.4";
      case "Normal":
        return "1.6";
      case "Relaxed":
        return "1.8";
      case "Double":
        return "2.0";
      default:
        return "1.6";
    }
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

  const mapFontSize = (fontSize: string) => {
    const baseSize = isMobile ? 16 : 18;
    switch (fontSize) {
      case "Small":
        return `${baseSize - 2}px`;
      case "Medium":
        return `${baseSize}px`;
      case "Large":
        return `${baseSize + 4}px`;
      case "Extra Large":
        return `${baseSize + 8}px`;
      default:
        return `${baseSize}px`;
    }
  };

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-xl md:text-2xl">Loading book...</h1>
        </div>
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
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
          </div>
          <h1 className="text-xl md:text-2xl mt-6">Loading book content...</h1>
        </div>
      </div>
    );

  if (contentError)
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className={`text-6xl ${togglDark ? "text-red-400" : "text-red-500"}`}>📚</div>
          </div>
          <h1
            className={`text-xl md:text-2xl mb-4 font-semibold ${
              togglDark ? "text-red-400" : "text-red-600"
            }`}
          >
            Error Loading Book
          </h1>
          <p
            className={`mb-6 text-sm md:text-base ${togglDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {contentError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              togglDark
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25"
            }`}
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className={`${togglDark ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {!isFocused && <Navbar />}

      <FocusModeSettings />

      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <Highlighting onClose={handleCloseHighlighting} text={selectedText} />
        </div>
      )}

      <div
        className={`min-h-screen transition-colors duration-300 ${
          togglDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {!isFocused && <Header />}

        <div className={`flex ${isMobile ? 'flex-col' : ''} ${isFocused ? 'h-screen' : isMobile ? 'h-screen' : 'h-[calc(100vh-64px)]'}`}>
          {toggleSidebar && !isFocused && !isMobile && (
            <div className="flex-shrink-0 w-80">
              <ReadingSidebar />
            </div>
          )}

          {toggleSidebar && !isFocused && isMobile && (
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
              <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw]">
                <ReadingSidebar />
              </div>
            </div>
          )}

          <div className={`flex-1 flex justify-center items-start ${
            isMobile ? 'p-0 h-full' : 'p-4 lg:p-6'
          }`}>
            <div
              className={`
                w-full h-full transition-all duration-300 book-reader-container
                ${
                  togglDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-850 text-gray-100 shadow-2xl shadow-black/40"
                    : "bg-gradient-to-br from-white to-gray-50 text-gray-900 shadow-2xl shadow-gray-300/50"
                }
                ${isFocused ? "max-w-4xl mx-auto" : "max-w-6xl"}
                ${isMobile ? 'rounded-none border-0' : 'rounded-xl border border-opacity-30'}
                ${togglDark ? 'border-gray-600' : 'border-gray-300'}
              `}
            >
              <div
                ref={bookContentRef}
                className={`
                  ${isMobile ? 'h-screen' : 'h-[95vh]'} 
                  overflow-auto custom-scrollbar
                  ${theme?.bg || (togglDark ? "bg-gray-800" : "bg-white")}
                  ${theme?.text ||  "text-black"}
                  ${isMobile ? 'px-4 py-6 rounded-none' : isFocused ? 'px-8 lg:px-16 py-8 lg:py-12 rounded-xl' : 'px-6 lg:px-12 py-6 lg:py-10 rounded-xl'}
                  leading-relaxed
                `}
                dangerouslySetInnerHTML={{ __html: bookContent }}
                style={{
                  fontFamily: mapFontFamily(fontFamily),
                  fontSize: mapFontSize(fontSize),
                  letterSpacing: letterSpacing + "px",
                  lineHeight: mapLineHeight(lineHeight),
                  backgroundImage: background.pattern || "none",
                  backgroundSize:
                    background.id === "graph-paper"
                      ? "20px 20px"
                      : background.id === "notebook-paper"
                      ? "80px 25px"
                      : background.id === "canvas"
                      ? "4px 4px"
                      : background.id === "fabric"
                      ? "4px 4px"
                      : background.id === "crosshatch"
                      ? "16px 16px"
                      : background.id === "vintage-dots"
                      ? "14px 14px"
                      : background.id === "stipple"
                      ? "10px 10px"
                      : background.id === "zen-waves"
                      ? "100px 50px"
                      : background.id === "minimalist-lines"
                      ? "100% 42px"
                      : background.id === "dots"
                      ? "10px 10px"
                      : background.id === "diagonal-stripes"
                      ? "30px 30px"
                      : background.id === "rice-paper"
                      ? "16px 16px"
                      : "auto",
                  backgroundRepeat: "repeat",
                  backgroundAttachment: "local",
                }}
              />
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

        /* Enhanced Scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${togglDark ? "#4B5563 #1F2937" : "#CBD5E1 #F8FAFC"};
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: ${isMobile ? "8px" : "12px"};
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${togglDark ? "#1F2937" : "#F8FAFC"};
          border-radius: 10px;
          margin: 20px 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${
            togglDark
              ? "linear-gradient(180deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)"
              : "linear-gradient(180deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)"
          };
          border-radius: 10px;
          border: 2px solid ${togglDark ? "#1F2937" : "#F8FAFC"};
          transition: all 0.3s ease;
          box-shadow: ${
            togglDark 
              ? "0 2px 8px rgba(79, 70, 229, 0.3)" 
              : "0 2px 8px rgba(37, 99, 235, 0.2)"
          };
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${
            togglDark
              ? "linear-gradient(180deg, #7C3AED 0%, #6366F1 50%, #4F46E5 100%)"
              : "linear-gradient(180deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)"
          };
          transform: scaleY(1.05);
          box-shadow: ${
            togglDark 
              ? "0 4px 15px rgba(124, 58, 237, 0.4)" 
              : "0 4px 15px rgba(29, 78, 216, 0.3)"
          };
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: ${togglDark ? "#5B21B6" : "#1E3A8A"};
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${togglDark ? "#1F2937" : "#F8FAFC"};
        }

        /* Enhanced Book Content Styling */
        .book-reader-container h1,
        .book-reader-container h2,
        .book-reader-container h3,
        .book-reader-container h4,
        .book-reader-container h5,
        .book-reader-container h6 {
          color: ${togglDark ? "#F9FAFB" : "#111827"};
          margin-top: ${isMobile ? "1.5em" : "2em"};
          margin-bottom: ${isMobile ? "0.75em" : "1em"};
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .book-reader-container h1 {
          font-size: ${isMobile ? "1.75em" : "2.25em"};
          border-bottom: 3px solid ${togglDark ? "#4338CA" : "#2563EB"};
          padding-bottom: 0.5em;
          background: ${
            togglDark 
              ? "linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)"
              : "linear-gradient(135deg, #111827 0%, #374151 100%)"
          };
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .book-reader-container h2 {
          font-size: ${isMobile ? "1.5em" : "1.875em"};
          color: ${togglDark ? "#A78BFA" : "#3730A3"};
        }

        .book-reader-container h3 {
          font-size: ${isMobile ? "1.25em" : "1.5em"};
          color: ${togglDark ? "#C4B5FD" : "#4338CA"};
        }

        .book-reader-container h4 {
          font-size: ${isMobile ? "1.125em" : "1.25em"};
          color: ${togglDark ? "#DDD6FE" : "#4F46E5"};
        }

        .book-reader-container p {
          margin-bottom: ${isMobile ? "1.25em" : "1.75em"};
          text-align: justify;
          hyphens: auto;
          word-spacing: 0.05em;
          line-height: inherit;
          color: ${togglDark ? "#F3F4F6" : "#374151"};
        }

        .book-reader-container p:first-of-type {
          font-size: 1.05em;
          font-weight: 500;
          color: ${togglDark ? "#F9FAFB" : "#1F2937"};
        }

        .book-reader-container blockquote {
          border-left: 4px solid ${togglDark ? "#7C3AED" : "#3B82F6"};
          padding: ${isMobile ? "1em 1.25em" : "1.5em 2em"};
          margin: ${isMobile ? "1.5em 0" : "2.5em 0"};
          font-style: italic;
          background: ${
            togglDark 
              ? "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)"
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 197, 253, 0.05) 100%)"
          };
          border-radius: ${isMobile ? "0.5em" : "0.75em"};
          position: relative;
          box-shadow: ${
            togglDark 
              ? "0 4px 15px rgba(124, 58, 237, 0.1)" 
              : "0 4px 15px rgba(59, 130, 246, 0.1)"
          };
        }

        .book-reader-container blockquote::before {
          content: '"';
          position: absolute;
          top: -0.2em;
          left: 0.5em;
          font-size: 4em;
          color: ${togglDark ? "#7C3AED" : "#3B82F6"};
          opacity: 0.3;
          font-family: serif;
        }

        .book-reader-container a {
          color: ${togglDark ? "#60A5FA" : "#2563EB"};
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .book-reader-container a:hover {
          border-bottom-color: currentColor;
          background: ${
            togglDark 
              ? "rgba(96, 165, 250, 0.1)" 
              : "rgba(37, 99, 235, 0.05)"
          };
          padding: 0.1em 0.2em;
          border-radius: 0.25em;
          transform: translateY(-1px);
        }

        .book-reader-container img {
          max-width: 100%;
          height: auto;
          border-radius: ${isMobile ? "0.5em" : "0.75em"};
          box-shadow: ${
            togglDark 
              ? "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
              : "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)"
          };
          margin: ${isMobile ? "1.5em 0" : "2.5em 0"};
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .book-reader-container img:hover {
          transform: scale(1.02);
          box-shadow: ${
            togglDark 
              ? "0 15px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)" 
              : "0 15px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)"
          };
        }

        .book-reader-container ul,
        .book-reader-container ol {
          margin-left: ${isMobile ? "1.25em" : "1.75em"};
          margin-bottom: ${isMobile ? "1.25em" : "1.5em"};
        }

        .book-reader-container ul li,
        .book-reader-container ol li {
          margin-bottom: ${isMobile ? "0.5em" : "0.75em"};
          color: ${togglDark ? "#E5E7EB" : "#4B5563"};
          line-height: 1.6;
        }

        .book-reader-container ul li::marker {
          color: ${togglDark ? "#7C3AED" : "#3B82F6"};
        }

        .book-reader-container ol li::marker {
          color: ${togglDark ? "#7C3AED" : "#3B82F6"};
          font-weight: bold;
        }

        .book-reader-container code {
          color: ${togglDark ? "#A78BFA" : "#7C2D12"};
          background: ${
            togglDark 
              ? "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"
          };
          padding: 0.25em 0.5em;
          border-radius: 0.375em;
          font-size: 0.875em;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          border: 1px solid ${togglDark ? "rgba(124, 58, 237, 0.2)" : "rgba(251, 191, 36, 0.2)"};
          box-shadow: ${
            togglDark 
              ? "0 2px 4px rgba(124, 58, 237, 0.1)" 
              : "0 2px 4px rgba(251, 191, 36, 0.1)"
          };
        }

        .book-reader-container pre {
          background: ${togglDark ? "#1E293B" : "#F8FAFC"};
          padding: ${isMobile ? "1em" : "1.5em"};
          border-radius: ${isMobile ? "0.5em" : "0.75em"};
          overflow-x: auto;
          margin: ${isMobile ? "1.5em 0" : "2em 0"};
          border: 1px solid ${togglDark ? "#334155" : "#E2E8F0"};
          box-shadow: ${
            togglDark 
              ? "inset 0 2px 4px rgba(0, 0, 0, 0.3)" 
              : "inset 0 2px 4px rgba(0, 0, 0, 0.05)"
          };
        }

        .book-reader-container pre code {
          background: none;
          padding: 0;
          border: none;
          box-shadow: none;
          color: ${togglDark ? "#F1F5F9" : "#334155"};
        }

        /* Enhanced focus styles for better accessibility */
        .book-reader-container *:focus {
          outline: 2px solid ${togglDark ? "#7C3AED" : "#3B82F6"};
          outline-offset: 2px;
          border-radius: 0.25em;
        }

        /* Better text selection */
        .book-reader-container ::selection {
          background: ${togglDark ? "rgba(124, 58, 237, 0.3)" : "rgba(59, 130, 246, 0.2)"};
          color: ${togglDark ? "#F9FAFB" : "#1F2937"};
        }

        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .book-reader-container {
            font-size: 16px !important;
          }
          
          .book-reader-container p {
            text-align: left;
            hyphens: none;
          }
          
          .book-reader-container blockquote {
            margin-left: -0.5em;
            margin-right: -0.5em;
          }
        }

        /* Dark mode enhancements */
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
          }
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-pulse,
          .animate-ping {
            animation: none;
          }
          
          .book-reader-container img:hover {
            transform: none;
          }
          
          * {
            transition: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .book-reader-container {
            border: 2px solid currentColor;
          }
          
          .book-reader-container h1,
          .book-reader-container h2,
          .book-reader-container h3,
          .book-reader-container h4,
          .book-reader-container h5,
          .book-reader-container h6 {
            border-bottom-width: 3px;
            border-bottom-style: solid;
            border-bottom-color: currentColor;
          }
        }
      `}</style>
    </div>
  );
};

export default BookReader;