import { createSlice } from "@reduxjs/toolkit";

interface plan {
  yes: string[];
  no: string[];
  title: string;
  name: string;
  price: string;
  yearly: boolean;
  onClick?: () => void;
  color: string;
  heading: string;
  priceTitle: string;
}


interface State {
  plan: plan | null ;
}
const initialState:State = {
  plan: null,
};
const PaymentSlice = createSlice({
  name: "payment Slice",
  initialState,
  reducers: {
    setPlan:(state,action:{payload:plan})=>{
        state.plan=action.payload
    }

  },
});

export const {setPlan}=PaymentSlice.actions

export default PaymentSlice.reducer;