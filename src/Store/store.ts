import { configureStore } from "@reduxjs/toolkit";
import freeBooks  from "./FreeBookSlice";
import PremiumBooks from "./PremiumBookSlice";
import  filteredBooks  from "./FilterSlice";
const store=configureStore({
    reducer:{
        freeBooks:freeBooks,
        premiumBooks:PremiumBooks,
        filteredBooks:filteredBooks,
    }
})

export default store