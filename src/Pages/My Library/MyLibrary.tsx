import { useEffect, useState } from "react"
import supabase from "../../supabase-client"
import { useNavigate } from "react-router"
import { PiBookOpenBold } from "react-icons/pi"
import { BookOpen, Clock, CheckCircle, Star } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../Store/store"
import { toast } from "sonner"

interface book{
  id:number,
  user_id:string,
  title:string,
  description:string,
  cover:string,
  published_at:string,
  authors:string,
  tier:string,
  created_at:string
}

const MyLibrary = () => {
  const [user,setUser]=useState<any>(null)
  const [currentlyReading,setCurrentlyReading]=useState<book[]>([])
  const [completedReading,setCompletedReading]=useState<book[]>([])
  const [activeTab, setActiveTab] = useState('currently-reading')
  const [loading, setLoading] = useState(true)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {boughtPremium}=useSelector((state:RootState)=>state.premiumBooks)


  useEffect(()=>{
    const getUser=async ()=>{
      setLoading(true)
      const {data,error}=await supabase.auth.getUser()
      if(error){
        alert("login to see the books in your library ")
        navigate('/login')
        return 
      }else{
        const userId = data.user?.id
        setUser(userId)
        
        await fetchCurrentlyReading(userId)
        await fetchCompletedBooks(userId)
      }
      setLoading(false)
    }

    const fetchCurrentlyReading=async(userId: string)=>{
      const {data,error}=await supabase
        .from('currently_reading')
        .select('*')
        .eq('user_id',userId)
      
      if(error){
        console.error("Error fetching currently reading books:", error.message)
        return 
      }else{
        setCurrentlyReading(data || [])
      }
    }

    const fetchCompletedBooks=async(userId: string)=>{
      const {data,error}=await supabase
        .from('completed_books')
        .select('*')
        .eq('user_id',userId)
      
      if(error){
        console.error("Error fetching completed books:", error.message)
        return 
      }else{
        setCompletedReading(data || [])
      }
    }

    getUser()
  },[navigate])

  const handleNavigate=(status:string,book:book)=>{
    console.log(`book clicke is ${status} and bought premium is ${boughtPremium}`)
    if(status==="free"){

      navigate(`/books/${book?.id}`)
    }
    if(status!=="free" && boughtPremium){
      navigate(`/books/${book?.id}`)
    }
    if(status!=="free" && !boughtPremium){
     toast.warning("buy premium to read this book")
      navigate('/premium')
    }
    
  }
  const BookCard = ({ book,bookStatus="free" }: { book: book,bookStatus:string } ) => (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      
      onClick={()=> handleNavigate(bookStatus,book)}
    >
      <div className="flex gap-4">
        <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <BookOpen size={20} className="text-blue-500" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 truncate">
            by {book.authors}
          </p>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {book.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              book.tier === 'free' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {book.tier}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center gap-3 mb-8">
          <PiBookOpenBold size={32} className="text-blue-600"/>
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Reading</p>
                <p className="text-2xl font-bold text-gray-900">{currentlyReading.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Books Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedReading.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

     
        <div className="flex justify-between items-center space-x-1 w-full bg-gray-100 p-1 rounded-xl mb-6 ">
          <button
            onClick={() => setActiveTab('currently-reading')}
            className={`px-6 w-[50%] py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'currently-reading'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Currently Reading ({currentlyReading.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 w-[50%] py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed ({completedReading.length})
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'currently-reading' && (
            <>
              {currentlyReading.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {currentlyReading.map((book) => (
                    <BookCard bookStatus={book.tier} key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books currently reading</h3>
                  <p className="text-gray-600 mb-4">Start reading a book to see it here</p>
                  <button 
                    onClick={() => navigate('/books')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Books
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedReading.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {completedReading.map((book) => (
                    <BookCard bookStatus={book.tier} key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed books</h3>
                  <p className="text-gray-600 mb-4">Books you finish will appear here</p>
                  <button 
                    onClick={() => navigate('/books')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Books
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyLibrary