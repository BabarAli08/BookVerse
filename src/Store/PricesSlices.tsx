import { createSlice } from "@reduxjs/toolkit";

interface Prices {
  free: string;
  premium: string;
  ultimate: string;
}
interface priceState {
  prices: Prices;
  Yearly: boolean;
}

const montlyPrice = {
  free: "$0",
  premium: "$9.99",
  ultimate: "$19.99",
};
const yearlyPrice = {
  free: "$0",
  premium: "$99.99",
  ultimate: "$199.99",
};
const initialState: priceState = {
  prices: {
    free: "$0",
    premium: "$9.99",
    ultimate: "$19.99",
  },
  Yearly: false,
};
const priceSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {
    toggleYearly: (state, action) => {
      state.Yearly = action.payload;
      state.prices = action.payload ? yearlyPrice : montlyPrice;
    },
  },
});

export const { toggleYearly } = priceSlice.actions;
export default priceSlice.reducer;
