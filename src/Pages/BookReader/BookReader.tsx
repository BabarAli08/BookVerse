// src/Pages/BookReader/BookReader.tsx
import { useNavigate, useParams } from "react-router-dom";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import BookFetchError from "../../Component/BookFetchError";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReadingBook } from "../../Store/BookReadingSlice";
import Header from "./Header";
import type { RootState } from "../../Store/store";
import ReadingSidebar from "./SideBar";

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { book, loading, error } = useFetchSingleBook({ id: Number(id) });
  
  const [bookContent, setBookContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  const {togglDark,toggleSidebar,completePercentage,bookMarks,lineHeight,fontFamily,fontSize,highlited}=useSelector((state:RootState)=>state.bookReading)
  const getBookUrl = () => {
    if (!book?.formats) return "";
    
    return book.formats["text/html"] || 
           book.formats["text/html; charset=utf-8"] || 
           book.formats["text/plain; charset=utf-8"] || 
           book.formats["text/plain"] || 
           "";
  };

  const htmlUrl = getBookUrl();

  useEffect(() => {
    if (book) dispatch(setReadingBook(book));
  }, [book, dispatch]);

  // CORS proxy to bypass restrictions
  const fetchWithProxy = async (url: string): Promise<string> => {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    return data.contents;
  };

  // Clean HTML content
  const processBookHtml = (html: string): string => {
    return html
      // Remove script tags for security
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove conflicting styles
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove html/body tags but keep content
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '');
  };

  // Fetch book content
  useEffect(() => {
    if (!htmlUrl) return;

    const fetchContent = async () => {
      setContentLoading(true);
      setContentError(null);

      try {
        const html = await fetchWithProxy(htmlUrl);
        const processedHtml = processBookHtml(html);
        setBookContent(processedHtml);
      } catch (error) {
        setContentError('Failed to load book content');
        console.error('Error fetching book:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [htmlUrl]);

  // Loading states
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">Loading book...</h1>
    </div>
  );

  if (error) return (
    <BookFetchError
      onRetry={() => window.location.reload()} 
      onGoHome={() => navigate('/')} 
      onSearch={() => navigate('/books')} 
    />
  );

  if (contentLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">Loading book content...</h1>
    </div>
  );

  if (contentError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl text-red-600 mb-4">Error Loading Book</h1>
        <p className="text-gray-600 mb-4">{contentError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      {toggleSidebar && <ReadingSidebar />}
      <div className={`min-h-screen w-full flex items-center ${togglDark? "bg-gray-800 text-gray-50":"bg-gray-50"} justify-center p-6 bg-white`}>
        <div 
          className={`w-3/4 max-w-8xl h-screen overflow-auto p-8 ${togglDark?"bg-gray-900 text-gray-50":"bg-gray-50"} rounded-lg shadow-lg bg-gray-50 rounded-lg shadow-lg transition-colors duration-300`}
          dangerouslySetInnerHTML={{ __html: bookContent }}
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize+"px",
            lineHeight: lineHeight,
            
          }}
        />
      </div>
    </>
  );
};

export default BookReader;