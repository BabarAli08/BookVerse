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

  const { togglDark, toggleSidebar, completePercentage, bookMarks, lineHeight, fontFamily, fontSize, highlited } = useSelector((state: RootState) => state.bookReading);
  
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
    <div className={`min-h-screen flex items-center justify-center ${togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
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
    <div className={`min-h-screen flex items-center justify-center ${togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <h1 className="text-2xl">Loading book content...</h1>
    </div>
  );

  if (contentError) return (
    <div className={`min-h-screen flex items-center justify-center ${togglDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="text-center">
        <h1 className={`text-2xl mb-4 ${togglDark ? "text-red-400" : "text-red-600"}`}>Error Loading Book</h1>
        <p className={`mb-4 ${togglDark ? "text-gray-300" : "text-gray-600"}`}>{contentError}</p>
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
    <div className={`min-h-screen transition-colors duration-300 ${togglDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]"> {/* Assuming header is 64px high */}
        {/* Sidebar */}
        {toggleSidebar && (
          <div className="flex-shrink-0">
            <ReadingSidebar />
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex justify-center items-start p-6">
          <div 
            className={`
              w-full max-w-5xl h-full rounded-xl shadow-2xl transition-all duration-300
              book-reader-container
              ${togglDark 
                ? "bg-gradient-to-br from-gray-800 to-gray-850 text-gray-100 shadow-black/30 border border-gray-700/50" 
                : "bg-gradient-to-br from-white to-gray-50 text-gray-900 shadow-gray-300/40 border border-gray-200/50"
              }
            `}
          >
            {/* Book content with custom scrollbar */}
            <div 
              className={`
                h-full overflow-auto px-12 py-10 rounded-xl
                custom-scrollbar
                ${togglDark ? "text-gray-100" : "text-gray-800"}
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

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${togglDark ? '#4B5563 #1F2937' : '#CBD5E1 #F1F5F9'};
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${togglDark ? '#1F2937' : '#F1F5F9'};
            border-radius: 10px;
            margin: 8px 0;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${togglDark ? 
              'linear-gradient(180deg, #6B7280 0%, #4B5563 100%)' : 
              'linear-gradient(180deg, #94A3B8 0%, #64748B 100%)'
            };
            border-radius: 10px;
            border: 2px solid ${togglDark ? '#1F2937' : '#F1F5F9'};
            transition: all 0.3s ease;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${togglDark ? 
              'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)' : 
              'linear-gradient(180deg, #64748B 0%, #475569 100%)'
            };
            transform: scaleY(1.1);
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:active {
            background: ${togglDark ? '#374151' : '#334155'};
          }

          .custom-scrollbar::-webkit-scrollbar-corner {
            background: ${togglDark ? '#1F2937' : '#F1F5F9'};
          }

          /* Enhanced book content styling */
          .book-reader-container h1,
          .book-reader-container h2,
          .book-reader-container h3,
          .book-reader-container h4,
          .book-reader-container h5,
          .book-reader-container h6 {
            color: ${togglDark ? '#F3F4F6' : '#1F2937'};
            margin-top: 2em;
            margin-bottom: 1em;
            font-weight: 600;
            letter-spacing: -0.025em;
          }

          .book-reader-container h1 {
            font-size: 2em;
            border-bottom: 2px solid ${togglDark ? '#374151' : '#E5E7EB'};
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
            border-left: 4px solid ${togglDark ? '#6366F1' : '#3B82F6'};
            padding-left: 1.5em;
            margin: 2em 0;
            font-style: italic;
            background: ${togglDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
            padding: 1em 1.5em;
            border-radius: 0.5em;
          }

          .book-reader-container a {
            color: ${togglDark ? '#60A5FA' : '#2563EB'};
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
            box-shadow: 0 4px 12px ${togglDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
            margin: 2em auto;
            display: block;
          }

          .book-reader-container ul,
          .book-reader-container ol {
            margin: 1.5em 0;
            padding-left: 2em;
          }

          .book-reader-container li {
            margin-bottom: 0.5em;
          }

          .book-reader-container code {
            background: ${togglDark ? '#374151' : '#F3F4F6'};
            padding: 0.2em 0.4em;
            border-radius: 0.25em;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9em;
          }

          .book-reader-container pre {
            background: ${togglDark ? '#1F2937' : '#F9FAFB'};
            padding: 1.5em;
            border-radius: 0.5em;
            overflow-x: auto;
            margin: 2em 0;
            border: 1px solid ${togglDark ? '#374151' : '#E5E7EB'};
          }

          .book-reader-container table {
            width: 100%;
            border-collapse: collapse;
            margin: 2em 0;
            border-radius: 0.5em;
            overflow: hidden;
            box-shadow: 0 2px 8px ${togglDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
          }

          .book-reader-container th,
          .book-reader-container td {
            padding: 1em;
            text-align: left;
            border-bottom: 1px solid ${togglDark ? '#374151' : '#E5E7EB'};
          }

          .book-reader-container th {
            background: ${togglDark ? '#374151' : '#F9FAFB'};
            font-weight: 600;
          }

          .book-reader-container tr:hover {
            background: ${togglDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(249, 250, 251, 0.8)'};
          }

          /* Selection styling */
          .book-reader-container ::selection {
            background: ${togglDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(59, 130, 246, 0.2)'};
            color: inherit;
          }

          /* Focus indicators for accessibility */
          .custom-scrollbar:focus {
            outline: 2px solid ${togglDark ? '#6366F1' : '#3B82F6'};
            outline-offset: 2px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookReader;