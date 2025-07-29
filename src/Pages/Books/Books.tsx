import FilterComponent from "./Filter"
import Header from "./Header"
import BookCarousel from "./BookCarousal"
import { useSelector, type TypedUseSelectorHook } from "react-redux"
import type { RootState } from "../../Store/store"
const Books = () => {
  
  const {filters}=useSelector((state:RootState)=>state.filteredBooks)
  console.log("filters",filters)
return (
    <>
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Header/>
        <FilterComponent/>
        {filters.tier==="Free" &&(

       <BookCarousel  title="free Books" subtitle="Free Books" isPremium={false}/>
        )}
        {filters.tier==="Premium" &&(

        <BookCarousel  title="premium Books" subtitle="Subscription Required:" isPremium={true}/> 
        )}
        {filters.tier==="All"&&(
          <>
          <BookCarousel  title="free Books" subtitle="Free Books" isPremium={false}/>
           <BookCarousel  title="premium Books" subtitle="Subscription Required:" isPremium={true}/> 
          </>
        )}
      
    </div>
    </>
  )
}

export default Books