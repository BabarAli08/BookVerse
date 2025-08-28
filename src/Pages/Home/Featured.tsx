import FeaturedBookCard from "../../Component/FeaturedBookCard";
import useFetchData from "../../Data/useFetchData";
import { SkeletonBookCard } from "../../Component/Loading";
import type { book } from "../../Data/Interfaces";
import { useNavigate } from "react-router";
import { useMemo } from "react";

const Featured = () => {
  const page = useMemo(() => Math.floor(Math.random() * 10), []);
  const {
    data: ShowcaseBooks,
    loading,
    error,
  } = useFetchData({
    url: "https://gutendex.com/books",
    page: page,
  });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-6 overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col text-center items-center mb-7">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          Featured Books
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl">
          Discover our handpicked selection of the most captivating reads
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 content-center sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonBookCard key={i} />)}

        {!loading &&
          ShowcaseBooks.slice(0, 3).map((book: book, i: number) => (
            <FeaturedBookCard
              key={i}
              book={book}
              onClick={() => navigate(`/books/${book.id}`)}
            />
          ))}
      </div>
    </div>
  );
};

export default Featured;
