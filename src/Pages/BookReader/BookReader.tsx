// src/Pages/BookReader/BookReader.tsx
import { useNavigate, useParams } from "react-router-dom";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import BookFetchError from "../../Component/BookFetchError";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReadingBook } from "../../Store/BookReadingSlice";
import Header from "./Header";
import type { RootState } from "../../Store/store";

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {book,loading,error}=useFetchSingleBook({id:Number(id)})

  const {togglDark}=useSelector((state:RootState)=>state.bookReading)

  const htmlUrl=book?.formats?.["text/html"]||""

  useEffect(()=>{
    if (book) dispatch(setReadingBook(book))
  },[book])

    if(loading) return <h1>Loading</h1>
    if(error) return (
      <BookFetchError
        onRetry={() => window.location.reload()} 
        onGoHome={() => navigate('/')} 
        onSearch={() => navigate('/books')} 
      />
    );
  return (
    <>
    <Header/>
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
      {/* The iframe content is loaded from an external URL, so direct CSS styling from the parent React app won't affect its internal content. */}
      <iframe className={`w-[65%] scroll-auto h-screen ${togglDark ? "bg-gray-700" : "bg-gray-50"} `} src={htmlUrl} ></iframe>
    </div>
    </>
  );
};

export default BookReader;
