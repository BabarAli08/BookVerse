import { X, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {  RootState } from "../../Store/store";
import { PiHighlighterFill } from "react-icons/pi";
import { deleteHighlight, deleteNote, setHighlighted, setNotes } from "../../Store/BookReadingSlice";

interface HighlightingProps {
  text: string;
  onClose: () => void;
}

const colors = ["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#a78bfa"];

const Highlighting = ({ text, onClose }: HighlightingProps) => {
  const { highlited, notes } = useSelector((state: RootState) => state.bookReading);
  const dispatch = useDispatch();

  const [note, setNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showNotesList, setShowNotesList] = useState(false);

  const onHighlight = () => {
    const newHighlight = {
      id: Date.now(),
      color: selectedColor,
      text: text,
    };
    dispatch(setHighlighted([...highlited, newHighlight]));
    onClose();
  };

  const onNoteSubmit = () => {
    const newNote = {
      id: Date.now(),
      selectedText: text,
      note: note,
    };
    dispatch(setNotes([...notes, newNote]));
    setNote("");
    setShowNotes(false);
    onClose();
  };

  const onNote = () => setShowNotes(true);

  const deleteHighlights = (id: number) => {
    dispatch(deleteHighlight(id))
  };

  const deleteNotes = (id: number) => {
    dispatch(deleteNote(id));
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="z-50 p-4 w-[27rem] max-w-[40rem] bg-white rounded-xl shadow-xl border border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold flex items-center justify-center gap-3"><PiHighlighterFill size={25}/> Highlight Text</h2>
        <button onClick={onClose}>
          <X className="w-4 h-4 text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* Selected Text */}
      <blockquote className="text-sm italic text-gray-600 bg-gray-100 p-2 rounded mb-3 max-h-24 overflow-y-auto">
        {text}
      </blockquote>

      {/* Navigation Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={() => {
            setShowNotes(false);
            setShowHighlights(false);
            setShowNotesList(false);
          }}
          className={`px-3 py-2 text-sm font-medium border-b-2 ${
            !showNotes && !showHighlights && !showNotesList
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Add New
        </button>
        <button
          onClick={() => {
            setShowHighlights(true);
            setShowNotes(false);
            setShowNotesList(false);
          }}
          className={`px-3 py-2 text-sm font-medium border-b-2 ${
            showHighlights
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Highlights ({highlited.length})
        </button>
        <button
          onClick={() => {
            setShowNotesList(true);
            setShowNotes(false);
            setShowHighlights(false);
          }}
          className={`px-3 py-2 text-sm font-medium border-b-2 ${
            showNotesList
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Notes ({notes.length})
        </button>
      </div>

      {/* Highlights List */}
      {showHighlights && (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {highlited.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No highlights yet</p>
          ) : (
            highlited.map((highlight) => (
              <div
                key={highlight.id}
                className="group flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200"
                style={{ backgroundColor: `${highlight.color}20` }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: highlight.color }}
                  >
                    {truncateText(highlight.text)}
                  </div>
                </div>
                <button
                  onClick={() => deleteHighlights(highlight.id)}
                  className="ml-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete highlight"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Notes List */}
      {showNotesList && (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
          ) : (
            notes.map((noteItem) => (
              <div
                key={noteItem.id}
                className="group p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 bg-blue-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    Selected Text
                  </div>
                  <button
                    onClick={() => deleteNotes(noteItem.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">
                  "{truncateText(noteItem.selectedText)}"
                </p>
                <div className="text-xs font-medium text-gray-700 mb-1">Note:</div>
                <p className="text-sm text-gray-800">{noteItem.note}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Color Picker */}
      {!showNotes && !showHighlights && !showNotesList && (
        <>
          <p className="text-sm font-medium text-gray-700 mb-2">Choose highlight color:</p>
          <div className="flex space-x-2 mb-4">
            {colors.map((color) => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedColor === color ? "border-black scale-110" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </>
      )}

      {/* Action Buttons or Note Input */}
      {!showNotes && !showHighlights && !showNotesList ? (
        <div className="flex gap-2">
          <button
            onClick={onHighlight}
            className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm font-medium transition-colors duration-200"
          >
            Add Highlight
          </button>
          <button
            onClick={onNote}
            className="flex-1 border border-gray-300 text-sm rounded-lg px-3 py-2 hover:bg-gray-50 font-medium transition-colors duration-200"
          >
            Add Note
          </button>
        </div>
      ) : showNotes ? (
        <div className="flex flex-col space-y-3">
          <textarea
            className="border border-gray-300 rounded-lg p-3 text-sm resize-none h-24 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            placeholder="Write your note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={onNoteSubmit}
              disabled={!note.trim()}
              className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
            >
              Save Note
            </button>
            <button
              onClick={() => {
                setShowNotes(false);
                setNote("");
              }}
              className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Highlighting;