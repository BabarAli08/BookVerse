import { createSlice } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface BookState{
    book:book,
    togglDark:boolean,
    completePercentage:number,
    bookMarks:number[],
    fontSize:string,
    highlited:string[]
    lineHeight:string
    fontFamily:"Georgia, serif" | "sans-serif" | 'cursive' | 'monospace'
    letterSpacing:string
    toggleSidebar:boolean
}
const initialState:BookState={
    book:{},
    togglDark:false,
    completePercentage:0,
    bookMarks:[],
    highlited:[],
    fontSize:"18",
    lineHeight:'1.6',
    fontFamily:"Georgia, serif",
    letterSpacing:"0",
    toggleSidebar:false
    
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
    },
    setLineHeight:(state,action:{payload:string})=>{
        state.lineHeight=action.payload
    },
    setFontFamily:(state,action:{payload:"Georgia, serif" | "sans-serif" | 'cursive' | 'monospace'})=>{
        state.fontFamily=action.payload
    },
    setLetterSpacing:(state,action:{payload:string})=>{
        state.letterSpacing=action.payload
    },
    setSidebar:(state)=>{
        state.toggleSidebar=!state.toggleSidebar
    }
    }  
})


export const {setReadingBook,toggleDark,setCompletePercentage,setBookMark,setFontSize,setHighlighted,setLineHeight,setFontFamily,setLetterSpacing,setSidebar}=BookReadingSlice.actions
export default BookReadingSlice.reducer;