import { createSlice } from "@reduxjs/toolkit";
interface highlightState{
    highlightText:string
    highlightColor:string 
    
}

interface notesState{
    noteText:string
    text:string
}

interface initial{
    highlights:highlightState[]
    notes:notesState[]
}

const initialState:initial={
    highlights:[],
    notes:[]
}

const highlightAndNotesSlice=createSlice({
    name:"highlightAndNotes",
    initialState,
    reducers:{
        addHighlight(state,action){
            state.highlights=[...state.highlights,action.payload]
        },
        addNote(state,action){
            state.notes = [...state.notes,action.payload]
        
        },
        resetState:()=>{
            return initialState
        }

    }

    
})


export const {addHighlight,resetState,addNote}=highlightAndNotesSlice.actions
export default highlightAndNotesSlice.reducer