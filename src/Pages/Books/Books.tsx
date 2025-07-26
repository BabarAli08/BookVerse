import FilterComponent from "./Filter"
import Header from "./Header"
import {premiumBooks} from "./BookData"
import { booksData } from "./BookData"
import BookCarousel from "./BookCarousal"
const Books = () => {
  return (
    <>
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Header/>
        <FilterComponent/>
        <BookCarousel books={booksData} title="free Books" subtitle="Free Books" isPremium={false}/>
        <BookCarousel books={premiumBooks} title="premium Books" subtitle="Subscription Required:" isPremium={true}/>
      
    </div>
    </>
  )
}

export default Books