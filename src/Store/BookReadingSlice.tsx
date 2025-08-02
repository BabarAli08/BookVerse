import { createSlice } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface BookState{
    book:book,
    togglDark:boolean,
    completePercentage:number,
    bookMarks:number[],
    fontSize:string,
    highlited:string[]
}
const initialState:BookState={
    book:{},
    togglDark:false,
    completePercentage:0,
    bookMarks:[],
    highlited:[],
    fontSize:"18px",
    
}
const BookReadingSlice=createSlice({
    name:"bookReading",
    initialState,
    reducers:{
    setReadingBook:(state,action:{payload:book})=>{
        state.book = action.payload
    },
    toggleDark:(state)=>{
        state.togglDark=!state.togglDark
    },
    setCompletePercentage:(state,action:{payload:number})=>{
        state.completePercentage=action.payload
    
    },
    setBookMark:(state,action:{payload:number})=>{
        state.bookMarks=[...state.bookMarks,action.payload]
    },
    setFontSize:(state,action:{payload:string})=>{
        state.fontSize=action.payload
    },
    setHighlighted:(state,action:{payload:string[]})=>{
        state.highlited=action.payload
    }
    }  
})


export const {setReadingBook,toggleDark,setCompletePercentage,setBookMark,setFontSize,setHighlighted}=BookReadingSlice.actions
export default BookReadingSlice.reducer;