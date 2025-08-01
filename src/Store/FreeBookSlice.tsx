import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface freeBookState {
  allBooks: book[];
  displayedBooks: book[];
  currentIndex: number;
  batchSize: number;
  page: number;
  filteredData: boolean;
}

const initialState: freeBookState = {
  allBooks: [],
  displayedBooks: [],
  currentIndex: 0,
  batchSize: 5,
  page: 1,
 
};
const dataSlice = createSlice({
  name: "freeBooks",
  initialState,
  reducers: {
    setFreeBooks: (state, action: PayloadAction<book[]>) => {
      const isFirstLoad = state.allBooks.length === 0;

    
        
        const newBooks = action.payload.filter(
          (book) => !state.allBooks.some((b) => b.id === book.id)
        );
        state.allBooks = [...state.allBooks, ...newBooks];

        if (isFirstLoad || action.payload.length !== state.allBooks.length) {
          state.currentIndex = 0;
          state.page = 1;
          state.displayedBooks = state.allBooks.slice(0, state.batchSize);
        }
      
    },

    nextFreeBatch: (state) => {
      const nextIndex = state.currentIndex + state.batchSize;
      if (nextIndex < state.allBooks.length) {
        state.displayedBooks = state.allBooks.slice(
          nextIndex,
          nextIndex + state.batchSize
        );
        state.currentIndex = nextIndex;
        state.page++;
      }
    },
    prevFreeBatch: (state) => {
      state.currentIndex = Math.max(0, state.currentIndex - state.batchSize);

      state.displayedBooks = state.allBooks.slice(
        state.currentIndex,
        state.currentIndex + state.batchSize
      );
      state.page--;
    },
    resetFreeBooks:()=>{
      return initialState
    },
    fetchMore:(state,action:PayloadAction<book[]>)=>{
      state.allBooks=[...state.allBooks,...action.payload]
    },
    setFreePage:(state,action )=>{
      state.page=action.payload
    }
  }
});

export const { setFreeBooks, nextFreeBatch, prevFreeBatch, resetFreeBooks,setFreePage,fetchMore } =
  dataSlice.actions;
export default dataSlice.reducer;
