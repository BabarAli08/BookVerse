import { createSlice } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface userState{
    name:string,
    description:string,
    BooksReadNumber:number,
    BooksRead:book[],
    readingTime:string,
    readingStreak:string,
    averageRating:string,
    achievements:string[]
    currentlyReading:book[],
    wantToRead:book[],
    finishedReading:book[]
}
const initialState:userState={
    name:"Click to add Your Name",
    description:"Click to add the Description",
    BooksReadNumber:0,
    BooksRead:[],
    readingTime:"",
    readingStreak:"",
    averageRating:"",
    achievements:[],
    currentlyReading:[],
    wantToRead:[],
    finishedReading:[]
}
const userDetailsSlice=createSlice({
    name:"user Details Slice",
    initialState,
    reducers: {
        setName: (state, action: { payload: string }) => {
            state.name = action.payload;
        },
        setDescription: (state, action: { payload: string }) => {
            state.description = action.payload;
        },
        editName:(state,action:{payload:string})=>{
            state.name=action.payload
        },
        editDescription:(state,action:{payload:string})=>{
            state.description=action.payload
        },
        setBookRead:(state,action:{payload:book})=>{
            state.BooksRead.push(action.payload)
            state.BooksReadNumber+=1
        },
        setReadingTime:(state,action:{payload:string})=>{
            state.readingTime=action.payload
        },
        setReadingStreak:(state,action:{payload:string})=>{
            state.readingStreak=action.payload
        },
        setAverageRating:(state,action:{payload:string})=>{
            state.averageRating=action.payload
        },
        setAchievements:(state,action:{payload:string[]})=>{
            state.achievements=action.payload
        },
        setCurrentlyReading:(state,action:{payload:book[]})=>{
            state.currentlyReading=action.payload
        },
        setWantToRead:(state,action:{payload:book[]})=>{
            state.wantToRead=action.payload
        },
        setFinishedReading:(state,action:{payload:book[]})=>{
            state.finishedReading=action.payload
        }
    }
})

export const {setName,setDescription,editName,editDescription,setBookRead,setReadingTime,setReadingStreak,setAverageRating,setAchievements,setCurrentlyReading,setWantToRead,setFinishedReading}=userDetailsSlice.actions
export default userDetailsSlice.reducer;