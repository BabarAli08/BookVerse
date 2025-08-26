import { createSlice } from "@reduxjs/toolkit";

interface state{
    premiumBookClicked:boolean,
    
}
const initialState:state={
    premiumBookClicked:false,
    
}
const ReadSlice=createSlice({
    name:"ReadSlice",
    initialState,
    reducers:{
       
        setPremiumBookClicked:(state,action:{payload:boolean})=>{
            state.premiumBookClicked=action.payload
        }
    }
})

export const {setPremiumBookClicked}=ReadSlice.actions
export default ReadSlice.reducer