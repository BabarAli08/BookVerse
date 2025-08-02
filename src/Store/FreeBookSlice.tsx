import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface freeBookState {
  allBooks: book[];
  displayedBooks: book[];
  currentIndex: number;
  batchSize: number;
  page: number;
}

const initialState: freeBookState = {
  allBooks: [],
  displayedBooks: [],
  currentIndex: 0,
  batchSize: 5,
  page: 1,
};

const FreeBooks = createSlice({
  name: "freeBooks",
  initialState,
  reducers: {
    setFreeBooks: (state, action: PayloadAction<book[]>) => {
      state.allBooks = [...action.payload];
      state.currentIndex = 0;
      state.displayedBooks = state.allBooks.slice(0, state.batchSize);
    },
    
    nextFreeBatch: (state) => {
      const nextIndex = state.currentIndex + state.batchSize;
      state.currentIndex = nextIndex;
      
      // Update displayed books with what we have
      const availableBooks = state.allBooks.slice(
        nextIndex,
        nextIndex + state.batchSize
      );
      state.displayedBooks = availableBooks;
    },
    
    prevFreeBatch: (state) => {
      const prevIndex = Math.max(0, state.currentIndex - state.batchSize);
      state.currentIndex = prevIndex;
      state.displayedBooks = state.allBooks.slice(
        prevIndex,
        prevIndex + state.batchSize
      );
      // Don't modify page here - let the component handle it
    },
    
    resetFreeBooks: () => initialState,
    
    fetchMore: (state, action: PayloadAction<book[]>) => {
      const startIndex = state.allBooks.length;
      state.allBooks = [...state.allBooks, ...action.payload];
      
      // If we're waiting for more data at current position, update displayed books
      const currentEnd = state.currentIndex + state.batchSize;
      if (currentEnd > startIndex) {
        const newDisplayedBooks = state.allBooks.slice(
          state.currentIndex,
          state.currentIndex + state.batchSize
        );
        state.displayedBooks = newDisplayedBooks;
      }
    },
    
    setFreePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  setFreeBooks,
  nextFreeBatch,
  prevFreeBatch,
  resetFreeBooks,
  setFreePage,
  fetchMore,
} = FreeBooks.actions;
export default FreeBooks.reducer;
