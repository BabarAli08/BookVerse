import { configureStore } from "@reduxjs/toolkit";
import freeBooks  from "./FreeBookSlice";
import PremiumBooks from "./PremiumBookSlice";
const store=configureStore({
    reducer:{
        freeBooks:freeBooks,
        premiumBooks:PremiumBooks,
    }
})

export default store