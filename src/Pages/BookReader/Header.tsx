import { Menu, Bookmark, Search, MessageSquare, Moon, Sun, FocusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Store/store';
import { setIsFocused, setSidebar, toggleDark } from '../../Store/BookReadingSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { togglDark: isDarkMode, book, isFocused } = useSelector(
    (state: RootState) => state.bookReading
  );

  const toggleTheme = () => {
    dispatch(toggleDark());
  };

  const handleFocus = () => {
    dispatch(setIsFocused(!isFocused));
  };

  const headerVariants: any = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants: any = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const titleVariants: any = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconRotateVariants: any = {
    hover: { rotate: 360, transition: { duration: 0.6 } }
  };

  const focusVariants: any = {
    focused: { 
      scale: 1.1,
      boxShadow: isDarkMode 
        ? "0 0 20px rgba(59, 130, 246, 0.5)" 
        : "0 0 20px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 }
    },
    unfocused: { 
      scale: 1,
      boxShadow: "none",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`
        ${isDarkMode 
          ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border-gray-700/50' 
          : 'bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95 border-gray-200/50'
        } 
        backdrop-blur-md border-b shadow-lg px-4 sm:px-6 py-3 sm:py-4 transition-all duration-500 ease-in-out
        ${isFocused ? 'py-4 sm:py-6' : 'py-3 sm:py-4'}
        overflow-hidden
      `}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto min-w-0">
        
        {/* Menu Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => dispatch(setSidebar())}
          className={`
            p-2 sm:p-3 rounded-xl backdrop-blur-sm flex-shrink-0
            ${isDarkMode 
              ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-300 hover:text-white shadow-lg shadow-gray-900/20' 
              : 'bg-white/70 hover:bg-white/90 text-gray-600 hover:text-gray-800 shadow-lg shadow-gray-200/50'
            } 
            transition-all duration-300 border border-opacity-20
            ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
          `}
        >
          <motion.div variants={iconRotateVariants} whileHover="hover">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </motion.button>

        {/* Title Section */}
        <motion.div 
          variants={titleVariants}
          className="flex-1 text-center px-2 sm:px-8 min-w-0 mx-2 sm:mx-4"
        >
          <AnimatePresence mode="wait">
            {book?.title && (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="min-w-0"
              >
                <motion.h1 
                  className={`
                    text-base sm:text-xl font-bold bg-gradient-to-r 
                    ${isDarkMode 
                      ? 'from-white via-gray-100 to-gray-200 text-transparent' 
                      : 'from-gray-800 via-gray-900 to-gray-800 text-transparent'
                    } 
                    bg-clip-text mb-1 sm:mb-2 leading-tight
                    truncate max-w-full
                  `}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  title={book.title} // Show full title on hover
                >
                  {book.title}
                </motion.h1>
                
                {book.authors && (
                  <motion.p 
                    className={`
                      text-xs sm:text-sm font-medium
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                      truncate max-w-full
                    `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    title={book.authors.map((author) => author.name).join(', ')} // Show full authors on hover
                  >
                    {book.authors.map((author) => author.name).join(', ')}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex items-center gap-1 sm:gap-2 flex-shrink-0"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          {/* Bookmark Button - Hidden on mobile */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`
              hidden sm:flex p-3 rounded-xl backdrop-blur-sm relative overflow-hidden group
              ${isDarkMode 
                ? 'bg-gray-700/50 hover:bg-yellow-600/20 text-gray-300 hover:text-yellow-400 shadow-lg shadow-gray-900/20' 
                : 'bg-white/70 hover:bg-yellow-100/80 text-gray-600 hover:text-yellow-600 shadow-lg shadow-gray-200/50'
              } 
              transition-all duration-300 border border-opacity-20
              ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
            `}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Bookmark className="w-5 h-5" />
            </motion.div>
          </motion.button>

          {/* Search Button - Hidden on mobile */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`
              hidden sm:flex p-3 rounded-xl backdrop-blur-sm
              ${isDarkMode 
                ? 'bg-gray-700/50 hover:bg-blue-600/20 text-gray-300 hover:text-blue-400 shadow-lg shadow-gray-900/20' 
                : 'bg-white/70 hover:bg-blue-100/80 text-gray-600 hover:text-blue-600 shadow-lg shadow-gray-200/50'
              } 
              transition-all duration-300 border border-opacity-20
              ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
            `}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
          </motion.button>

          {/* Focus Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={isFocused ? "focused" : "unfocused"}
            variants={focusVariants}
            onClick={handleFocus}
            className={`
              p-2 sm:p-3 rounded-xl backdrop-blur-sm relative
              ${isDarkMode 
                ? `${isFocused 
                    ? 'bg-blue-600/30 text-blue-400 border-blue-500/50' 
                    : 'bg-gray-700/50 hover:bg-purple-600/20 text-gray-300 hover:text-purple-400'
                  } shadow-lg shadow-gray-900/20` 
                : `${isFocused 
                    ? 'bg-blue-100/80 text-blue-600 border-blue-400/50' 
                    : 'bg-white/70 hover:bg-purple-100/80 text-gray-600 hover:text-purple-600'
                  } shadow-lg shadow-gray-200/50`
              } 
              transition-all duration-300 border border-opacity-20
              ${!isFocused && (isDarkMode ? 'border-gray-600' : 'border-gray-300')}
            `}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              animate={isFocused ? { rotate: [0, 360] } : { rotate: 0 }}
              transition={{ 
                duration: isFocused ? 0.8 : 0.2,
                ease: "easeInOut"
              }}
            >
              <FocusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`
                    absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full
                    ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}
                  `}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-full h-full rounded-full bg-current"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Theme Toggle Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleTheme}
            className={`
              p-2 sm:p-3 rounded-xl backdrop-blur-sm relative overflow-hidden
              ${isDarkMode 
                ? 'bg-gray-700/50 hover:bg-orange-600/20 text-gray-300 hover:text-orange-400 shadow-lg shadow-gray-900/20' 
                : 'bg-white/70 hover:bg-indigo-100/80 text-gray-600 hover:text-indigo-600 shadow-lg shadow-gray-200/50'
              } 
              transition-all duration-300 border border-opacity-20
              ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
            `}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.div>
            </AnimatePresence>
            
            <motion.div
              className={`
                absolute inset-0 rounded-xl opacity-20
                ${isDarkMode 
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400' 
                  : 'bg-gradient-to-r from-indigo-400 to-purple-400'
                }
              `}
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Focus Progress Bar */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 4 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className={`
              w-full bg-gradient-to-r 
              ${isDarkMode 
                ? 'from-blue-600 via-purple-600 to-blue-600' 
                : 'from-blue-500 via-purple-500 to-blue-500'
              }
              overflow-hidden
            `}
          >
            <motion.div
              animate={{ x: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/3 bg-white/30 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;