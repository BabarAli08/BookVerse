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
  X,
  Menu,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import {
  setAnnotationsLoading,
  setFontFamily,
  setFontSize,
  setHighlighted,
  setLetterSpacing,
  setLineHeight,
  setNotes,
  toggleDark,
} from "../../Store/BookReadingSlice";
import { useEffect, useState, useCallback } from "react";
import supabase from "../../supabase-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import {
  HighlightLoadingCard,
  NoteLoadingCard,
  PulseLoader,
} from "./BookReaderLoading";

interface sectionState {
  settings: boolean;
  highlights: boolean;
  bookmarks: boolean;
  notes: boolean;
}

interface ReadingSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ReadingSidebar: React.FC<ReadingSidebarProps> = ({ 
  isOpen = true, 
  onToggle 
}) => {
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
    annotationsLoading,
    letterSpacing,
  } = useSelector((state: RootState) => state.bookReading);

  const [readingProgress, setReadingProgress] = useState<number>(
    parseFloat(localStorage.getItem(`reading-progress-${book.id}`) || "0")
  );

  const [bookCompleted, setBookCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Memoized progress update for better performance
  const updateProgress = useCallback(() => {
    const storedProgress = localStorage.getItem(`reading-progress-${book.id}`);
    if (storedProgress) {
      setReadingProgress(JSON.parse(storedProgress));
    }
  }, [book.id]);

  useEffect(() => {
    const interval = setInterval(updateProgress, 2000); // Reduced frequency
    return () => clearInterval(interval);
  }, [updateProgress]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && isOpen && onToggle) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, isOpen, onToggle]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  useEffect(() => {
    const checkBookCompletionStatus = async () => {
      try {
        setIsCheckingStatus(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) return;

        const { data, error } = await supabase
          .from("completed_books")
          .select("*")
          .eq("user_id", user.id)
          .eq("book_id", book.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Failed to get book completion status:", error);
          return;
        }

        setBookCompleted(!!data);
      } catch (error) {
        console.error("Error checking book completion status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkBookCompletionStatus();
  }, [book.id]);

  const fontFamilies = ["Georgia, serif", "sans-serif", "cursive", "monospace"];

  const toggleSection = useCallback((section: keyof sectionState) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  useEffect(() => {
    dispatch(setAnnotationsLoading(true));
  }, [dispatch]);

  const getAnnotations = useCallback(async () => {
    const {
      data: { user },
      error: UserError,
    } = await supabase.auth.getUser();

    if (!user?.id) {
      dispatch(setAnnotationsLoading(false));
      dispatch(setHighlighted([]));
      dispatch(setNotes([]));
      return;
    }

    if (!book?.id) return;

    if (UserError) {
      dispatch(setAnnotationsLoading(false));
      dispatch(setHighlighted([]));
      dispatch(setNotes([]));
      return;
    }

    try {
      const { data, error } = await supabase
        .from("annotations")
        .select("*")
        .eq("user_id", user?.id)
        .eq("book_id", book?.id);

      if (error) {
        dispatch(setAnnotationsLoading(false));
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
    }
  }, [book?.id, dispatch]);

  useEffect(() => {
    getAnnotations();
  }, [getAnnotations]);

  const getHighlightColor = (color: string) => {
    return togglDark ? `border border-gray-600/30` : `border border-gray-200`;
  };

  const { premiumBookClicked } = useSelector((state: RootState) => state.read);
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
        tier: premiumBookClicked ? "premium" : "free"
      };
      
      const { data, error } = await supabase
        .from("currently_reading")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", book.id);

      if (error) {
        console.error("Error deleting from currently reading:", error);
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

  const sidebarVariants:any = {
    hidden: { 
      x: isMobile ? -320 : 0, 
      opacity: isMobile ? 0 : 1 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 0.8
      }
    },
    exit: { 
      x: isMobile ? -320 : 0, 
      opacity: isMobile ? 0 : 1,
      transition: { 
        duration: 0.3, 
        ease: "easeInOut" 
      }
    }
  };

  const overlayVariants:any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const sectionVariants:any = {
    hidden: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const itemVariants:any = {
    hidden: { 
      x: -20, 
      opacity: 0 
    },
    visible: (index: number) => ({ 
      x: 0, 
      opacity: 1,
      transition: { 
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const progressVariants:any = {
    hidden: { width: 0 },
    visible: { 
      width: `${readingProgress}%`,
      transition: { 
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants:any = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    tap: { scale: 0.98 }
  };

  const chevronVariants:any = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  const MobileOverlay = () => {
    if (!isMobile) return null;
    
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onToggle}
            aria-label="Close sidebar"
          />
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      <MobileOverlay />
      
      <motion.div
        id="reading-sidebar"
        className={`
          ${isMobile ? 'fixed top-0 left-0 z-50 h-screen' : 'relative h-[90vh]'} 
          w-80 border-r transition-colors duration-300
          ${togglDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
          ${isMobile ? 'shadow-2xl' : 'shadow-lg'}
        `}
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <motion.div 
            className="p-4 border-b border-gray-200 dark:border-gray-700"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <BookOpen
                    className={`w-5 h-5 flex-shrink-0 ${
                      togglDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <motion.h1
                    className={`text-lg font-semibold truncate ${
                      togglDark ? "text-gray-100" : "text-gray-900"
                    }`}
                    title={book.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {book.title}
                  </motion.h1>
                  <motion.p
                    className={`text-sm ${
                      togglDark ? "text-gray-400" : "text-gray-600"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Chapter 2
                  </motion.p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  onClick={() => dispatch(toggleDark())}
                  className={`p-2 rounded-lg transition-colors ${
                    togglDark
                      ? "text-yellow-400 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Toggle dark mode"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatePresence mode="wait">
                    {togglDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {isMobile && (
                  <motion.button
                    onClick={onToggle}
                    className={`p-2 rounded-lg md:hidden transition-colors ${
                      togglDark
                        ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                    aria-label="Close sidebar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              className={`w-full rounded-full h-2 overflow-hidden ${
                togglDark ? "bg-gray-700" : "bg-gray-200"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                variants={progressVariants}
                initial="hidden"
                animate="visible"
              />
            </motion.div>
            <motion.p
              className={`text-xs mt-2 ${
                togglDark ? "text-gray-400" : "text-gray-600"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.ceil(readingProgress)}% Complete
            </motion.p>
          </motion.div>

          {/* Settings Section */}
          <motion.div 
            className="p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={() => toggleSection("settings")}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Settings
                    className={`w-4 h-4 ${
                      togglDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </motion.div>
                <h2
                  className={`font-medium ${
                    togglDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Reading Settings
                </h2>
              </div>
              <motion.div
                variants={chevronVariants}
                animate={expandedSections.settings ? "open" : "closed"}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className={`w-4 h-4 ${togglDark ? "text-gray-400" : "text-gray-600"}`}
                />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedSections.settings && (
                <motion.div 
                  className="mt-3 space-y-4 px-3 overflow-hidden"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {/* Font Size */}
                  <motion.div
                    variants={itemVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                  >
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
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12px</span>
                      <motion.span
                        key={fontSize}
                        initial={{ scale: 1.2, color: "#3B82F6" }}
                        animate={{ scale: 1, color: "inherit" }}
                        transition={{ duration: 0.2 }}
                      >
                        {fontSize}px
                      </motion.span>
                      <span>24px</span>
                    </div>
                  </motion.div>

                  
                  <motion.div
                    variants={itemVariants}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                  >
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        togglDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Font Family
                    </label>
                    <motion.select
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
                      className={`w-full p-2 border rounded-lg text-sm transition-all duration-200 ${
                        togglDark
                          ? "bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      }`}
                      whileFocus={{ scale: 1.02 }}
                    >
                      {fontFamilies.map((font: any) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>

              
                  <motion.div
                    variants={itemVariants}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                  >
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
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1.2</span>
                      <motion.span
                        key={lineHeight}
                        initial={{ scale: 1.2, color: "#3B82F6" }}
                        animate={{ scale: 1, color: "inherit" }}
                        transition={{ duration: 0.2 }}
                      >
                        {lineHeight}
                      </motion.span>
                      <span>2.0</span>
                    </div>
                  </motion.div>

                 
                  <motion.div
                    variants={itemVariants}
                    custom={3}
                    initial="hidden"
                    animate="visible"
                  >
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
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-0.5px</span>
                      <motion.span
                        key={letterSpacing}
                        initial={{ scale: 1.2, color: "#3B82F6" }}
                        animate={{ scale: 1, color: "inherit" }}
                        transition={{ duration: 0.2 }}
                      >
                        {letterSpacing}px
                      </motion.span>
                      <span>2px</span>
                    </div>
                  </motion.div>

                
                  <motion.div
                    className={`p-3 border rounded-lg ${
                      togglDark
                        ? "bg-gray-800/50 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                    variants={itemVariants}
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <p
                      className={`text-xs font-medium mb-2 ${
                        togglDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Preview
                    </p>
                    <motion.p
                      style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: fontFamily,
                        lineHeight: lineHeight,
                        letterSpacing: `${letterSpacing}px`,
                      }}
                      className={`${togglDark ? "text-gray-200" : "text-gray-700"}`}
                      key={`${fontSize}-${fontFamily}-${lineHeight}-${letterSpacing}`}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      The practice of mindfulness brings awareness to the present
                      moment.
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

    
          <motion.div 
            className="p-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => toggleSection("highlights")}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <PenTool
                    className={`w-4 h-4 ${
                      togglDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </motion.div>
                <h2
                  className={`font-medium ${
                    togglDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Highlights
                </h2>
                <AnimatePresence>
                  {highlights.length > 0 && (
                    <motion.span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        togglDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      }`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {highlights.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                variants={chevronVariants}
                animate={expandedSections.highlights ? "open" : "closed"}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className={`w-4 h-4 ${togglDark ? "text-gray-400" : "text-gray-600"}`}
                />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedSections.highlights && (
                <motion.div 
                  className="mt-3 space-y-2 px-3 max-h-64 overflow-y-auto custom-scrollbar"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {annotationsLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                          togglDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <PulseLoader isDark={togglDark} size="sm" />
                        Loading your highlights...
                      </div>
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <HighlightLoadingCard isDark={togglDark} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : highlights.length === 0 ? (
                    <motion.p
                      className={`text-sm text-center py-4 ${
                        togglDark ? "text-gray-400" : "text-gray-500"
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      No highlights yet
                    </motion.p>
                  ) : (
                    <motion.div className="space-y-2">
                      {highlights.map((highlight, index) => (
                        <motion.div
                          key={highlight.id || index}
                          className={`p-3 rounded-lg ${getHighlightColor(
                            highlight.color
                          )} hover:opacity-90 transition-opacity cursor-pointer`}
                          style={{
                            backgroundColor: highlight.color
                              ? `${highlight.color}30`
                              : "#fbbf2430",
                          }}
                          variants={itemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            boxShadow: togglDark 
                              ? "0 8px 25px rgba(0, 0, 0, 0.3)" 
                              : "0 8px 25px rgba(0, 0, 0, 0.1)"
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <motion.span
                                className={`text-xs px-2 py-1 rounded ${
                                  togglDark
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                Highlight
                              </motion.span>
                              <motion.div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: highlight.color || "#fbbf24",
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                  delay: 0.2,
                                  type: "spring", 
                                  stiffness: 400, 
                                  damping: 17 
                                }}
                              />
                            </div>
                          </div>
                          <motion.p
                            className={`text-sm leading-relaxed ${
                              togglDark ? "text-gray-200" : "text-gray-700"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {highlight.text}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

  
          <motion.div 
            className="p-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => toggleSection("notes")}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                togglDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <PenTool
                    className={`w-4 h-4 ${
                      togglDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </motion.div>
                <h2
                  className={`font-medium ${
                    togglDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Notes
                </h2>
                <AnimatePresence>
                  {notes.length > 0 && (
                    <motion.span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        togglDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      }`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {notes.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                variants={chevronVariants}
                animate={expandedSections.notes ? "open" : "closed"}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className={`w-4 h-4 ${togglDark ? "text-gray-400" : "text-gray-600"}`}
                />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedSections.notes && (
                <motion.div 
                  className="mt-3 space-y-2 px-3 max-h-64 overflow-y-auto custom-scrollbar"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {annotationsLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                          togglDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <PulseLoader isDark={togglDark} size="sm" />
                        Loading your notes...
                      </div>
                      {[1, 2].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <NoteLoadingCard isDark={togglDark} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : notes.length === 0 ? (
                    <motion.p
                      className={`text-sm text-center py-4 ${
                        togglDark ? "text-gray-400" : "text-gray-500"
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      No notes yet
                    </motion.p>
                  ) : (
                    <motion.div className="space-y-2">
                      {notes.map((note, index) => (
                        <motion.div
                          key={note.id || index}
                          className={`p-3 rounded-lg border hover:opacity-90 transition-opacity cursor-pointer ${
                            togglDark
                              ? "bg-gray-800/50 border-gray-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                          variants={itemVariants}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            boxShadow: togglDark 
                              ? "0 8px 25px rgba(0, 0, 0, 0.3)" 
                              : "0 8px 25px rgba(0, 0, 0, 0.1)"
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div 
                            className="mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                togglDark
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              Note
                            </span>
                          </motion.div>
                          <motion.blockquote
                            className={`text-xs italic mb-2 p-2 rounded ${
                              togglDark
                                ? "bg-gray-700/50 text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            "{note.selectedText}"
                          </motion.blockquote>
                          <motion.p
                            className={`text-sm leading-relaxed ${
                              togglDark ? "text-gray-200" : "text-gray-700"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {note.note}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

       
          <motion.div 
            className="p-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={toggleBookCompleted}
              disabled={isLoading || isCheckingStatus}
              className={`w-full font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isLoading || isCheckingStatus
                  ? "opacity-50 cursor-not-allowed"
                  : bookCompleted
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
              }`}
              variants={buttonVariants}
              initial="idle"
              whileHover={!(isLoading || isCheckingStatus) ? "hover" : "idle"}
              whileTap={!(isLoading || isCheckingStatus) ? "tap" : "idle"}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </motion.div>
                ) : isCheckingStatus ? (
                  <motion.div
                    key="checking"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Checking status...</span>
                  </motion.div>
                ) : bookCompleted ? (
                  <motion.div
                    key="completed"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                    <span>Mark as Unread</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="incomplete"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Mark as Completed</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

       
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
            background: linear-gradient(180deg, 
              ${togglDark ? "#4B5563" : "#CBD5E1"} 0%, 
              ${togglDark ? "#374151" : "#94A3B8"} 100%
            );
            border-radius: 4px;
            border: 2px solid ${togglDark ? "#1F2937" : "#F1F5F9"};
            transition: all 0.3s ease;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, 
              ${togglDark ? "#6B7280" : "#64748B"} 0%, 
              ${togglDark ? "#4B5563" : "#475569"} 100%
            );
            transform: scaleY(1.1);
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:active {
            background: ${togglDark ? "#374151" : "#64748B"};
          }

          /* Range input styling */
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            border-radius: 3px;
            background: ${togglDark ? "#374151" : "#E5E7EB"};
            outline: none;
            transition: background 0.3s ease;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            transition: all 0.2s ease;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }

          input[type="range"]::-webkit-slider-thumb:active {
            transform: scale(0.9);
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            transition: all 0.2s ease;
          }

          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.2);
          }

          /* Reduce motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }

          /* High contrast mode support */
          @media (prefers-contrast: high) {
            input[type="range"]::-webkit-slider-thumb {
              border: 2px solid currentColor;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              border: 2px solid currentColor;
            }
          }

          /* Focus styles for better accessibility */
          button:focus-visible {
            outline: 2px solid ${togglDark ? "#60A5FA" : "#3B82F6"};
            outline-offset: 2px;
          }

          input:focus-visible {
            outline: 2px solid ${togglDark ? "#60A5FA" : "#3B82F6"};
            outline-offset: 2px;
          }

          select:focus-visible {
            outline: 2px solid ${togglDark ? "#60A5FA" : "#3B82F6"};
            outline-offset: 2px;
          }
        `}</style>
      </motion.div>
    </>
  );
};

export default ReadingSidebar;