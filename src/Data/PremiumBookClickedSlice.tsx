import { createSlice } from "@reduxjs/toolkit";
import type { book } from "./Interfaces";

interface bookState{
    book:book,
    clicked:boolean
}
const initialState:bookState={
    book:{},
    clicked:false
}
const PremiumBookCLick=createSlice({
    name:"preiumBookClick",
    initialState,
    reducers:{
        setClicked:(state,action)=>{
            state.clicked=true
            
        },
        setBook:(state,action)=>{
            state.book=action.payload
        },
        setClickedFalse:(state)=>{
            state.clicked=false
        }
    }
})

export const {setClicked,setBook,setClickedFalse}=PremiumBookCLick.actions
export default PremiumBookCLick.reducer;

