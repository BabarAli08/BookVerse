import { configureStore } from "@reduxjs/toolkit";
import freeBooks  from "./FreeBookSlice";
import PremiumBooks from "./PremiumBookSlice";
import  filteredBooks  from "./FilterSlice";
import PremiumBookClickedSlice from "../Data/PremiumBookClickedSlice";
import PricesSlices from "./PricesSlices";
const store=configureStore({
    reducer:{
        freeBooks:freeBooks,
        premiumBooks:PremiumBooks,
        filteredBooks:filteredBooks,
        PremiumBookCLick:PremiumBookClickedSlice,
        prices:PricesSlices
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;