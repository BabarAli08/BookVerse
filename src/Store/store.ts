import { configureStore } from "@reduxjs/toolkit";
import freeBooks  from "./FreeBookSlice";
import PremiumBooks from "./PremiumBookSlice";
import  filteredBooks  from "./FilterSlice";
import PremiumBookClickedSlice from "../Data/PremiumBookClickedSlice";
import PricesSlices from "./PricesSlices";
import UserDetailsSlice from "./UserDetailsSlice";
import BookReadingSlice from "./BookReadingSlice";
import AuthSlice from "./AuthSlice";
const store=configureStore({
    reducer:{
        freeBooks:freeBooks,
        premiumBooks:PremiumBooks,
        filteredBooks:filteredBooks,
        PremiumBookCLick:PremiumBookClickedSlice,
        prices:PricesSlices,
        userDetails:UserDetailsSlice,
        bookReading:BookReadingSlice,
        auth:AuthSlice
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;