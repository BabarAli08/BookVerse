import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface State{
    filteredBooks:book[]
    filters:{
        category:string,
        tier:string,
        sort:string,
        search:string
    }
}
const initialState:State={
    filteredBooks:[],
    filters:{
        category:"All",
        tier:"All",
        sort:"Sort by Title",
        search:""
    
    }
  
}

const filterSlice=createSlice({
    name:"filteredBooks",
    initialState,
    reducers:{
        setFilters:(state,action:PayloadAction<typeof state.filters>)=>{
            state.filters=action.payload
        },
        setFilteredBooks:(state,action:PayloadAction<book[]>)=>{
            state.filteredBooks=action.payload
        },
        clearFilters:()=>{
            return initialState
        }
    }
})


export const {setFilters,setFilteredBooks,clearFilters}=filterSlice.actions
export default filterSlice.reducer

