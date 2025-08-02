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
      state.allBooks = [...action.payload];
      state.currentIndex = 0;
      state.displayedBooks = state.allBooks.slice(0, state.batchSize);
    },
    
    nextPremiumBatch: (state) => {
      const nextIndex = state.currentIndex + state.batchSize;
      state.currentIndex = nextIndex;
      
      // Update displayed books with what we have
      const availableBooks = state.allBooks.slice(
        nextIndex,
        nextIndex + state.batchSize
      );
      state.displayedBooks = availableBooks;
    },
    
    prevPremiumBatch: (state) => {
      const prevIndex = Math.max(0, state.currentIndex - state.batchSize);
      state.currentIndex = prevIndex;
      state.displayedBooks = state.allBooks.slice(
        prevIndex,
        prevIndex + state.batchSize
      );
      // Don't modify page here - let the component handle it
    },
    
    setInitialPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    
    resetPremiumBooks: () => initialState,
    
    fetchMore: (state, action: PayloadAction<book[]>) => {
      const startIndex = state.allBooks.length;
      state.allBooks = [...state.allBooks, ...action.payload];
      
      // If we're at the end and new data came in, update displayed books
      if (state.currentIndex + state.batchSize >= startIndex) {
        const newDisplayedBooks = state.allBooks.slice(
          state.currentIndex,
          state.currentIndex + state.batchSize
        );
        state.displayedBooks = newDisplayedBooks;
      }
    }
  },
});

export const {
  setPremiumBooks,
  nextPremiumBatch,
  prevPremiumBatch,
  setInitialPage,
  fetchMore,
  resetPremiumBooks,
} = premiumBookSlice.actions;
export default premiumBookSlice.reducer;