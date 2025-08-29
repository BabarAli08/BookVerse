import { createSlice } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface initial{
    books:book[]
}
const initialState:initial={
    books:[]
}
const FeaturedBooksSlice=createSlice({
    name:"FeaturedBooks",
    initialState,  
    reducers:{
        setBooks:(state,actions:{payload:book[]})=>{
            state.books=[...state.books,...actions.payload]
        
        }
    }
})

export const {setBooks}=FeaturedBooksSlice.actions
export default FeaturedBooksSlice.reducer