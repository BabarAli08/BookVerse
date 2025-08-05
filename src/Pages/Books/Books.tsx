import FilterComponent from "./Filter";
import Header from "./Header";
import BookCarousel from "./BookCarousal";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../Store/store";
import UpgradeToSee from "../../Component/UpgradeToSee";
const Books = () => {
  const { filters } = useSelector((state: RootState) => state.filteredBooks);
  const { clicked } = useSelector((state: RootState) => state.PremiumBookCLick);

  return (
    <>
      
      <div className="w-full min-h-screen bg-gray-50 flex flex-col relative z-0">
        <Header />
        <FilterComponent />
        {filters.tier === "Free" && (
          <BookCarousel title="free Books" subtitle="Free Books" isPremium={false} />
        )}
        {filters.tier === "Premium" && (
          <BookCarousel title="premium Books" subtitle="Subscription Required:" isPremium={true} />
        )}
        {filters.tier === "All" && (
          <>
            <BookCarousel title="free Books" subtitle="Free Books" isPremium={false} />
            <BookCarousel title="premium Books" subtitle="Subscription Required:" isPremium={true} />
          </>
        )}
      </div>

      
      {clicked && (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-none z-10" />
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <UpgradeToSee />
          </div>
        </>
      )}
    </>
  );
};


export default Books;
