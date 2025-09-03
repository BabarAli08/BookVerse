import { useNavigate, useParams } from "react-router-dom";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import BookFetchError from "../../Component/BookFetchError";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetHighlights,
  resetNotes,
  setAnnotationsFetched,
  setAnnotationsLoading,
  setBackground,
  setFontFamily,
  setFontSize,
  setHighlighted,
  setLineHeight,
  setNotes,
  setReadingBook,
  setTheme,
} from "../../Store/BookReadingSlice";
import Header from "./Header";
import type { RootState } from "../../Store/store";
import ReadingSidebar from "./SideBar";
import Highlighting from "./Highlighting";
import Navbar from "../../Component/Navbar/Navbar";
import FocusModeSettings from "./FocusModeSettings";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../supabase-client";

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
    letterSpacing,
    isFocused,
    fontSize,
    fontFamily,
    lineHeight,
    theme,
    background,
  } = useSelector((state: RootState) => state.bookReading);

  const { readingTheme, backgroundPattern } = useSelector(
    (state: RootState) => state.userSettings.reading.appearanceSettings
  );

  const {
    fontSize: supabaseFontSize,
    fontFamily: supabaseFontFamily,
    lineSpacing: supabaseLineHeight,
  } = useSelector(
    (state: RootState) => state.userSettings.reading.typographySettings
  );

  useEffect(() => {
    console.log("Initializing reading preferences from user settings...");

    dispatch(setFontSize(mapFontSize(supabaseFontSize)));
    dispatch(setFontFamily(mapFontFamily(supabaseFontFamily) as any));
    dispatch(setLineHeight(mapLineHeight(supabaseLineHeight)));
    dispatch(setTheme(readingTheme));
    dispatch(setBackground(backgroundPattern));
  }, [
    supabaseFontSize,
    dispatch,
    supabaseFontFamily,
    supabaseLineHeight,
    readingTheme,
    backgroundPattern,
  ]);

  const { annotationsFetched } = useSelector(
    (state: RootState) => state.bookReading
  );

  const getAnnotations = useCallback(async () => {
    if (annotationsFetched) return;

    const {
      data: { user },
      error: UserError,
    } = await supabase.auth.getUser();

    if (!user?.id) {
      dispatch(setAnnotationsLoading(false));
      dispatch(setHighlighted([]));
      dispatch(setNotes([]));
      dispatch(setAnnotationsFetched(true));
      return;
    }

    if (!book?.id) return;

    if (UserError) {
      dispatch(setAnnotationsLoading(false));
      dispatch(resetHighlights());
      dispatch(resetNotes());
      dispatch(setAnnotationsFetched(true));
      return;
    }

    try {
      dispatch(setAnnotationsLoading(true));

      const { data, error } = await supabase
        .from("annotations")
        .select("*")
        .eq("user_id", user?.id)
        .eq("book_id", book?.id);

      if (error) {
        console.error("Error fetching annotations:", error);
        dispatch(setAnnotationsLoading(false));
        dispatch(setAnnotationsFetched(true));
        return;
      }

      const highlights =
        data
          ?.filter((item) => item.type === "highlight")
          ?.map((item) => ({
            id: item.id,
            color: item.highlight_color,
            text: item.highlight_text,
          })) || [];

      const notes =
        data
          ?.filter((item) => item.type === "note")
          ?.map((item) => ({
            id: item.id,
            selectedText: item.text,
            note: item.note_text,
          })) || [];

      dispatch(setHighlighted(highlights));
      dispatch(setNotes(notes));
    } catch (error: any) {
      console.error("Error fetching annotations:", error);
      dispatch(setHighlighted([]));
      dispatch(setNotes([]));
    } finally {
      dispatch(setAnnotationsLoading(false));
      dispatch(setAnnotationsFetched(true));
    }
  }, [book?.id, dispatch, annotationsFetched]);

  useEffect(() => {
    if (book?.id && !annotationsFetched) {
      getAnnotations();
    }
  }, [book?.id, annotationsFetched, getAnnotations]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [
    togglDark,
    toggleSidebar,
    letterSpacing,
    isFocused,
    fontSize,
    fontFamily,
    lineHeight,
    theme,
    background,
  ]);

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
    switch (fontFamily.toLowerCase()) {
      case "sans serif":
      case "sans-serif":
      case "system-ui, -apple-system, blinkmacsystemfont, 'segoe ui', roboto, 'helvetica neue', arial, sans-serif":
        return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
      case "monospace":
      case "'sf mono', monaco, 'cascadia code', 'roboto mono', consolas, 'courier new', monospace":
        return "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace";
      case "dyslexic":
        return "OpenDyslexic, sans-serif";
      case "serif":
      case "georgia, serif":
      case "ui-serif, georgia, cambria, 'times new roman', times, serif":
        return "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
      default:
        if (fontFamily.includes(",")) {
          return fontFamily;
        }
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
        return lineHeight;
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

  const mapFontSize = (fontSize: string | number) => {
    const baseSize = isMobile ? 16 : 18;

    if (typeof fontSize === "number" || !isNaN(Number(fontSize))) {
      return `${fontSize}px`;
    }

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

  const getTextColor = () => {
    if (theme?.hex?.text) {
      return theme.hex.text;
    }

    if (theme?.text) {
      return theme.text;
    }

    return togglDark ? "#F3F4F6" : "#374151";
  };

  const containerVariants: any = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const sidebarVariants: any = {
    hidden: { x: -320, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: -320,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const overlayVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  if (loading)
    return (
      <motion.div
        className={`min-h-screen flex items-center justify-center ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h1
            className="text-xl md:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading book...
          </motion.h1>
        </div>
      </motion.div>
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
      <motion.div
        className={`min-h-screen flex items-center justify-center ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <motion.div className="animate-pulse">
            <motion.div
              className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-4 bg-gray-300 rounded w-5/6 mx-auto"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>
          <motion.h1
            className="text-xl md:text-2xl mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Loading book content...
          </motion.h1>
        </div>
      </motion.div>
    );

  if (contentError)
    return (
      <motion.div
        className={`min-h-screen flex items-center justify-center px-4 ${
          togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-md">
          <motion.div
            className="mb-6"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateY: { duration: 2, repeat: Infinity },
              scale: { duration: 1, repeat: Infinity },
            }}
          >
            <div
              className={`text-6xl ${
                togglDark ? "text-red-400" : "text-red-500"
              }`}
            >
              📚
            </div>
          </motion.div>
          <motion.h1
            className={`text-xl md:text-2xl mb-4 font-semibold ${
              togglDark ? "text-red-400" : "text-red-600"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Error Loading Book
          </motion.h1>
          <motion.p
            className={`mb-6 text-sm md:text-base ${
              togglDark ? "text-gray-300" : "text-gray-600"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {contentError}
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              togglDark
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      className={`${togglDark ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {!isFocused && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Navbar />
        </motion.div>
      )}

      <FocusModeSettings />

      <AnimatePresence>
        {showOptions && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Highlighting
                onClose={handleCloseHighlighting}
                text={selectedText}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`min-h-screen transition-colors duration-300 ${
          togglDark ? "bg-gray-900" : "bg-gray-50"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!isFocused && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Header />
          </motion.div>
        )}

        <div
          className={`flex ${isMobile ? "flex-col" : ""} ${
            isFocused
              ? "h-screen"
              : isMobile
              ? "h-screen"
              : "h-[calc(100vh-64px)]"
          }`}
        >
          <AnimatePresence>
            {toggleSidebar && !isFocused && !isMobile && (
              <motion.div
                className="flex-shrink-0 w-80"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ReadingSidebar />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {toggleSidebar && !isFocused && isMobile && (
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="absolute left-0 top-0 h-full w-80 max-w-[85vw]"
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ReadingSidebar />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={`flex-1 flex justify-center items-start ${
              isMobile ? "p-0 h-full" : "p-4 lg:p-6"
            }`}
            variants={contentVariants}
          >
            <motion.div
              className={`                 
      w-full transition-all duration-300 book-reader-container                
      ${
        togglDark
          ? "bg-gradient-to-br from-gray-800 to-gray-850 text-gray-100 shadow-2xl shadow-black/40"
          : "bg-gradient-to-br from-white to-gray-50 text-gray-900 shadow-2xl shadow-gray-300/50"
      }                 
      ${isFocused ? "max-w-4xl mx-auto" : "max-w-6xl"}                 
      ${
        isMobile
          ? "rounded-none border-0 h-full"
          : "rounded-xl border border-opacity-30 h-full"
      }                 
      ${togglDark ? "border-gray-600" : "border-gray-300"}               
    `}
              whileHover={{
                boxShadow: togglDark
                  ? "0 25px 50px rgba(0, 0, 0, 0.6)"
                  : "0 25px 50px rgba(0, 0, 0, 0.15)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                ref={bookContentRef}
                className={`                   
        h-full overflow-auto custom-scrollbar                   
        ${
          isMobile
            ? "px-4 py-6 rounded-none"
            : isFocused
            ? "px-8 lg:px-16 py-8 lg:py-12 rounded-xl"
            : "px-6 lg:px-12 py-6 lg:py-10 rounded-xl"
        }                   
        leading-relaxed break-words                   
        ${theme?.bg}                                 
      `}
                dangerouslySetInnerHTML={{ __html: bookContent }}
                style={{
                  fontFamily: fontFamily,
                  fontSize: mapFontSize(fontSize),
                  letterSpacing: letterSpacing + "px",
                  lineHeight: mapLineHeight(lineHeight),
                  color: theme?.hex.text,
                  backgroundColor: theme?.hex.bg,
                  backgroundImage: background?.pattern || "none",
                  backgroundSize:
                    background?.id === "graph-paper"
                      ? "20px 20px"
                      : background?.id === "notebook-paper"
                      ? "80px 25px"
                      : background?.id === "canvas"
                      ? "4px 4px"
                      : background?.id === "fabric"
                      ? "4px 4px"
                      : background?.id === "crosshatch"
                      ? "16px 16px"
                      : background?.id === "vintage-dots"
                      ? "14px 14px"
                      : background?.id === "stipple"
                      ? "10px 10px"
                      : background?.id === "zen-waves"
                      ? "100px 50px"
                      : background?.id === "minimalist-lines"
                      ? "100% 42px"
                      : background?.id === "dots"
                      ? "10px 10px"
                      : background?.id === "diagonal-stripes"
                      ? "30px 30px"
                      : background?.id === "rice-paper"
                      ? "16px 16px"
                      : "auto",
                  backgroundRepeat: "repeat",
                  backgroundAttachment: "local",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

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

        .book-reader-container h1,
        .book-reader-container h2,
        .book-reader-container h3,
        .book-reader-container h4,
        .book-reader-container h5,
        .book-reader-container h6 {
          color: ${
            theme?.text || (togglDark ? "#F9FAFB" : "#111827")
          } !important;
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
        }

        .book-reader-container h2 {
          font-size: ${isMobile ? "1.5em" : "1.875em"};
          color: ${
            theme?.text || (togglDark ? "#A78BFA" : "#3730A3")
          } !important;
        }

        .book-reader-container h3 {
          font-size: ${isMobile ? "1.25em" : "1.5em"};
          color: ${
            theme?.text || (togglDark ? "#C4B5FD" : "#4338CA")
          } !important;
        }

        .book-reader-container h4 {
          font-size: ${isMobile ? "1.125em" : "1.25em"};
          color: ${
            theme?.text || (togglDark ? "#DDD6FE" : "#4F46E5")
          } !important;
        }

        .book-reader-container p {
          margin-bottom: ${isMobile ? "1.25em" : "1.75em"};
          text-align: justify;
          hyphens: auto;
          word-spacing: 0.05em;
          line-height: inherit;
          color: ${getTextColor()}; 
        }

        .book-reader-container p:first-of-type {
          font-size: 1.05em;
          font-weight: 500;
          color: ${getTextColor()} !important;
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
          color: ${getTextColor()} !important;
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
          color: ${togglDark ? "#60A5FA" : "#2563EB"} !important;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .book-reader-container a:hover {
          border-bottom-color: currentColor;
          background: ${
            togglDark ? "rgba(96, 165, 250, 0.1)" : "rgba(37, 99, 235, 0.05)"
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
          color: ${getTextColor()} !important;
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
          color: ${togglDark ? "#A78BFA" : "#7C2D12"} !important;
          background: ${
            togglDark
              ? "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"
          };
          padding: 0.25em 0.5em;
          border-radius: 0.375em;
          font-size: 0.875em;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          border: 1px solid ${
            togglDark ? "rgba(124, 58, 237, 0.2)" : "rgba(251, 191, 36, 0.2)"
          };
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
          color: ${togglDark ? "#F1F5F9" : "#334155"} !important;
        }

        /* Override any inherited text colors */
        .book-reader-container * {
          color: inherit !important;
        }

        .book-reader-container div,
        .book-reader-container span,
        .book-reader-container em,
        .book-reader-container strong,
        .book-reader-container i,
        .book-reader-container b {
          color: ${getTextColor()} !important;
        }

        /* Enhanced focus styles for better accessibility */
        .book-reader-container *:focus {
          outline: 2px solid ${togglDark ? "#7C3AED" : "#3B82F6"};
          outline-offset: 2px;
          border-radius: 0.25em;
        }

        /* Better text selection */
        .book-reader-container ::selection {
          background: ${
            togglDark ? "rgba(124, 58, 237, 0.3)" : "rgba(59, 130, 246, 0.2)"
          };
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
    </motion.div>
  );
};

export default BookReader;
