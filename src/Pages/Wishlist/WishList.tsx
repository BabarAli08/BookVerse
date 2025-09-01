import {  useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import WishlistBook from "../../Component/WishlistedBook";
import { BookHeart, Library, Plus, Sparkles, TrendingUp, } from "lucide-react";
import { useNavigate } from "react-router";
import {  useSelector } from "react-redux";
import type { RootState } from "../../Store/store";

const WishList = () => {
  const navigate = useNavigate();

  const [showPremium, setShowPremium] = useState(false);
  const { wishlistedBook:books } = useSelector((state: RootState) => state.userSettings);





  const containerVariants:any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants:any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const statsVariants:any = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const emptyStateVariants:any = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };


  if (books.length === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookHeart className="h-6 w-6 text-blue-600" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Wishlist
              </h1>
            </motion.div>
            <p className="text-gray-600 max-w-md mx-auto">
              Your collection of books to read
            </p>
          </motion.div>

          {/* Empty State */}
          <motion.div 
            variants={emptyStateVariants}
            className="max-w-sm mx-auto text-center py-16"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Library className="h-10 w-10 text-blue-500" />
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-xl font-bold text-gray-900 mb-3"
            >
              No books in your wishlist yet
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 mb-8"
            >
              Start adding books you want to read later and create your perfect reading list.
            </motion.p>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/books")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={16} />
              Browse Books
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const freeBooks = books.filter(book => book.tier?.toLowerCase() !== "premium");
  const premiumBooks = books.filter(book => book.tier?.toLowerCase() === "premium");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
    >
      
      <AnimatePresence>
        {showPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPremium(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-200/50"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="h-8 w-8 text-yellow-600" />
                </motion.div>

                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                  Upgrade to Premium
                </h1>
                
                <p className="text-gray-600 mb-6">
                  Unlock exclusive premium books and enhance your reading experience.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 w-full"
                  onClick={() => navigate("/premium")}
                >
                  Buy Premium
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 py-12">
      
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookHeart className="h-6 w-6 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </motion.div>
          
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Your curated collection of books to read
          </p>

          {/* Legend */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">Premium</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-12">
          <motion.div 
            variants={statsVariants}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50"
          >
            <div className="grid grid-cols-3 gap-6 text-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100"
              >
                <div className="flex items-center justify-center mb-2">
                  <Library className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {books.length}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600">Total Books</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100"
              >
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {freeBooks.length}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600">Free</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-100"
              >
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {premiumBooks.length}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600">Premium</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12"
        >
          <AnimatePresence>
            {books.map((book, i) => (
              <motion.div
                key={book.bookId || i}
                variants={itemVariants}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="w-full max-w-sm mx-auto"
              >
                <WishlistBook
                  book={book}
                  setShowPremium={setShowPremium}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 15px 35px rgba(59, 130, 246, 0.3)",
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/books")}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Plus size={20} />
            </motion.div>
            Add More Books
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WishList;