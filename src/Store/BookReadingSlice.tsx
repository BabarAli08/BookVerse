import { createSlice } from "@reduxjs/toolkit";
import type { book } from "../Data/Interfaces";

interface highlightState {
  id: number;
  color: string;
  text: string;
}
interface notesState {
  id: number;
  selectedText: string;
  note: string;
}
interface themeState {
  id: string;
  name: string;
  bg: string;
  text:string
  hex:{bg:string,text:string}
}
interface backgroundState{
  id:string
  name:string
  pattern:string
  preview:string
}
interface BookState {
  book: book;
  togglDark: boolean;
  completePercentage: number;
  bookMarks: number[];
  fontSize: string;
  background:backgroundState,
  highlited: highlightState[];
  notes: notesState[];
  lineHeight: string;
  fontFamily: "Georgia, serif" | "sans-serif" | "cursive" | "monospace";
  letterSpacing: string;
  toggleSidebar: boolean;
  highlights: string[];
  theme?: themeState;
  isFocused: boolean;
  annotationsLoading: boolean;
}
const initialState: BookState = {
  book: {},
  theme: {
    id: "sepia",
    name: "Sepia",
    bg: "bg-amber-50",
    text:"text-amber-900",
    hex:{bg:"#FFFBEB",text:"#78350F"}
  },
  background: { id: "none", name: "None", pattern: "", preview: "bg-transparent" },
  togglDark: false,
  completePercentage: 0,
  bookMarks: [],
  highlited: [],
  notes: [],
  fontSize: "18",
  lineHeight: "1.6",
  fontFamily: "Georgia, serif",
  letterSpacing: "0",
  toggleSidebar: false,
  highlights: [],
  isFocused: false,
  annotationsLoading: true,
};
const BookReadingSlice = createSlice({
  name: "bookReading",
  initialState,
  reducers: {
    setReadingBook: (state, action: { payload: book }) => {
      state.book = action.payload;
    },
    toggleDark: (state) => {
      state.togglDark = !state.togglDark;
    },
    setCompletePercentage: (state, action: { payload: number }) => {
      state.completePercentage = action.payload;
    },
    setBookMark: (state, action: { payload: number }) => {
      state.bookMarks = [...state.bookMarks, action.payload];
    },
    setFontSize: (state, action: { payload: string }) => {
      state.fontSize = action.payload;
    },
    setHighlighted: (state, action: { payload: highlightState[] }) => {
      state.highlited = action.payload;
    },
    setNotes: (state, action: { payload: notesState[] }) => {
      state.notes = action.payload;
    },
    setLineHeight: (state, action: { payload: string }) => {
      state.lineHeight = action.payload;
    },
    setAnnotationsLoading: (state, action: { payload: boolean }) => {
      state.annotationsLoading = action.payload;
    },
    setTheme: (state, action: { payload: themeState }) => {
      state.theme = action.payload;
    },
    setIsFocused: (state, action: { payload: boolean }) => {
      state.isFocused = action.payload;
    },
    setBackground:(state,action:{payload:backgroundState})=>{
      state.background=action.payload
    },
    setFontFamily: (
      state,
      action: {
        payload: "Georgia, serif" | "sans-serif" | "cursive" | "monospace";
      }
    ) => {
      state.fontFamily = action.payload;
    },
    setLetterSpacing: (state, action: { payload: string }) => {
      state.letterSpacing = action.payload;
    },
    setSidebar: (state) => {
      state.toggleSidebar = !state.toggleSidebar;
    },
    setPreferances:(state,action:{payload:any})=>{
        const prefs=action.payload
        
        state.theme=prefs.readingTheme
        state.background=prefs.background
        state.fontFamily=prefs.fontFamily
        state.fontSize=prefs.fontSize
        state.lineHeight=prefs.lineSpacing
        state.letterSpacing=prefs.letterSpacing
    },
    deleteHighlight: (state, action: { payload: number }) => {
      state.highlited = state.highlited.filter((h) => h.id !== action.payload);
    },
    deleteNote: (state, action: { payload: number }) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  setReadingBook,
  toggleDark,
  setCompletePercentage,
  setBookMark,
  setFontSize,
  setHighlighted,
  setNotes,
  deleteNote,
  setPreferances,
  deleteHighlight,
  setLineHeight,
  setFontFamily,
  setBackground,
  setLetterSpacing,
  setSidebar,
  setIsFocused,
  setTheme,
  setAnnotationsLoading,
} = BookReadingSlice.actions;
export default BookReadingSlice.reducer;
