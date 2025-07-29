import FilterComponent from "./Filter"
import Header from "./Header"
import BookCarousel from "./BookCarousal"
const Books = () => {
  
  return (

    <>
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Header/>
        <FilterComponent/>
       <BookCarousel  title="free Books" subtitle="Free Books" isPremium={false}/>
        <BookCarousel  title="premium Books" subtitle="Subscription Required:" isPremium={true}/> 
      
    </div>
    </>
  )
}

export default Books