import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface premiumBookSlice {
  allBooks: book[];
  displayedBooks: book[];
  currentIndex: number;
  batchSize: number;
  page: number;
}

const initialState: premiumBookSlice = {
  allBooks: [],
  displayedBooks: [],
  currentIndex: 0,
  batchSize: 4,
  page: 10,

};

const premiumBookSlice = createSlice({
  name: "premiumBooks",
  initialState,
  reducers: {
    setPremiumBooks: (state, action: PayloadAction<book[]>) => {
     
        const newBooks = action.payload.filter(
          (book) => !state.allBooks.some((b) => b.id === book.id)
        );

        state.allBooks.push(...newBooks);

        
        if (state.allBooks.length === newBooks.length) {
          state.currentIndex = 0;
        }

        state.displayedBooks = state.allBooks.slice(
          state.currentIndex,
          state.currentIndex + state.batchSize
        );
      
    },
    nextPremiumBatch: (state) => {
      const nextBtachStart = state.currentIndex + state.batchSize;
      const nextBatchEnd = nextBtachStart + state.batchSize;

      state.displayedBooks = state.allBooks.slice(nextBtachStart, nextBatchEnd);
      state.currentIndex = nextBtachStart;
      state.page++;
    },
    prevPremiumBatch: (state) => {
      const prevBatchStart = Math.max(0, state.currentIndex - state.batchSize);
      const prevBatchEnd = prevBatchStart + state.batchSize;
      if (state.displayedBooks.length < state.batchSize) return;

      state.displayedBooks = state.allBooks.slice(prevBatchStart, prevBatchEnd);
      state.currentIndex = prevBatchStart;
      state.page -= 1;
    },
    setInitialPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    resetPremiumBooks: () => {
      return initialState;
    },
  },
});

export const {
  setPremiumBooks,
  nextPremiumBatch,
  prevPremiumBatch,
  setInitialPage,
  resetPremiumBooks,
} = premiumBookSlice.actions;
export default premiumBookSlice.reducer;
