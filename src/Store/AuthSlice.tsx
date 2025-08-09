import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

interface authState{
    user:User | null,
    name:string,
    isloggedIn:boolean
}
const initialState:authState={
    user:null,
    name:"",
    isloggedIn:false
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.user=action.payload
            state.isloggedIn=true
        },
        logout:(state)=>{
            state.user=null
            state.isloggedIn=false
        },
        setName:(state,action)=>{
            state.name=action.payload
        }
    
    
    }
})

export const {login,logout,setName}=authSlice.actions
export default authSlice.reducer;