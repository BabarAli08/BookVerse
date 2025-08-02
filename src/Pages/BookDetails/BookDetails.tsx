import { useNavigate, useParams } from "react-router-dom";
import BookDetailsButton from "../../Component/BookDetailsButton";
import { BookOpen, Download, Heart, Share2, Star, Clock, FileText, User, Calendar } from "lucide-react";
import useFetchSingleBook from "../../Data/useFetchSingleBook";
import { DotsLoader } from "../../Component/Loading";
import { toast } from "sonner";
import BookDetailsLoader from "../../Component/BookDetailsLoader";

const BookDetails = () => {
  const { id } = useParams();
  const navigate= useNavigate()
  
  const {book,loading,error}=useFetchSingleBook({id:Number(id)})

  if(loading) return <BookDetailsLoader/>

    const imageUrl=book?.formats?.["image/jpeg"]||book?.formats?.["image/png"]||book?.formats?.["image/jpg"]||""
    
    const pdf=book?.formats?.["application/pdf"]||""
    const epub=book?.formats?.["application/epub+zip"||""]

    const handleBookCopy=()=>{
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link Copied")
    }

    const handleAddWishlist=()=>{
       toast.success("Link Copied")
    }
    console.log("pdf link",pdf)
    console.log("epub link",epub)
    const rating=(Math.random()*2+3).toFixed(1)

  if(loading) return <DotsLoader/>
  if(error) return <h1>{error}</h1>
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          
          <div className="w-[400px] space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              
              <div className="relative p-6 bg-gray-100">
                <div className="relative aspect-[3/4] max-w-[280px] mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full text-gray-400">
                   <img className="w-[100%] h-[100%] object-cover" src={imageUrl} alt={book?.title} />
                  </div>
                  
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    Free
                  </div>
                </div>
              </div>

             
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500 text-sm">(1 reviews)</span>
                </div>
              </div>

              
              <div className="p-6 space-y-3">
                <BookDetailsButton logo={BookOpen} isBlack={true} title="Read Free" onClick={()=>navigate(`/books/${id}/read`)}/>
                
                <button className="w-full flex items-center justify-center gap-3 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200">
                  <Download size={18} />
                  <a href={pdf ===""?epub:pdf} className="font-medium">Download</a>
                </button>

                <button className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200">
                  <Heart size={18} />
                  <span onClick={handleAddWishlist} className="font-medium">Add to Wishlist</span>
                </button>

                <button className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-colors duration-200 border border-gray-200">
                  <Share2 size={18} />
                  <span onClick={handleBookCopy} className="font-medium">Share Book</span>
                </button>
              </div>

             
              <div className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reading Progress</span>
                    <span className="text-gray-900 font-medium">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Book Details */}
          <div className="flex-1 space-y-6">
            {/* Book Title & Author */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900">
                {book?.title}
              </h1>
              <p className="text-lg text-gray-600">
                by <span className="text-gray-900 font-medium">{book?.authors?.map((author)=>author.name).join(", ")}</span>
              </p>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                {book?.summaries?.[0]}
              </p>
            </div>

            {/* Book Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Pages:</span>
                      <span className="ml-2 font-medium text-gray-900">380</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Reading Time:</span>
                      <span className="ml-2 font-medium text-gray-900">5h 45m</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Published:</span>
                      <span className="ml-2 font-medium text-gray-900">{book?.authors?.[0].death_year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">Publisher:</span>
                      <span className="ml-2 font-medium text-gray-900">{book?.authors?.[0]?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Formats */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-sm">Available Formats:</span>
                <div className="flex gap-2 mt-2">
                  <a href={pdf} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium ">PDF {pdf===""?"unabailible":""}</a>
                  <a href={epub} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">EPUB {epub===""?"unabailible":""}</a>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                  Summary
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Chapters
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Reviews
                </button>
                <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium">
                  Similar Books
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Summary</h3>
                <p className="text-gray-600 leading-relaxed">
                 {book?.summaries?.[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;