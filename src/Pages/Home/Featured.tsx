import FeaturedBookCard from "../../Component/FeaturedBookCard";
import useFetchData from "../../Data/useFetchData";
import { SkeletonBookCard } from "../../Component/Loading";
import type { book } from "../../Data/Interfaces";
import { useNavigate } from "react-router";
import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import type { RootState } from "../../Store/store";
import { setBooks } from "../../Store/FeaturedBooksSlice";
import { useDispatch, useSelector } from "react-redux";

const Featured = () => {
  const page = useMemo(() => Math.floor(Math.random() * 10), []);
  const dispatch = useDispatch();
  const { books } = useSelector((state: RootState) => state.featuredBooks);

  const {
    data: ShowcaseBooks,
    loading,
    error,
  } = useFetchData(
    books.length === 0
      ? { url: "https://gutendex.com/books", page }
      : { url: "", page: 0 } 
  );

  useEffect(() => {
    if (ShowcaseBooks && books.length === 0) {
      dispatch(setBooks(ShowcaseBooks));
    }
  }, [ShowcaseBooks, books.length, dispatch]);

  const navigate = useNavigate();

  const parentStagger: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  };

  const staggerChild: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 overflow-hidden px-4 sm:px-6 lg:px-8">
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-col text-center items-center mb-7"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          Featured Books
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl">
          Discover our handpicked selection of the most captivating reads
        </p>
      </motion.div>

      <motion.div
        variants={parentStagger}
        initial="hidden"
        animate="visible"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
      >
   
        {loading && books.length === 0 &&
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={i} variants={staggerChild}>
              <SkeletonBookCard />
            </motion.div>
          ))}

        {books.slice(0, 3).map((book: book, i: number) => (
          <motion.div key={i} variants={staggerChild}>
            <FeaturedBookCard
              book={book}
              onClick={() => navigate(`/books/${book.id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Featured;
