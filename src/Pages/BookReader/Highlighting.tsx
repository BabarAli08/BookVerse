import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { PiHighlighterFill } from "react-icons/pi";
import {
  deleteHighlight,
  deleteNote,
  setHighlighted,
  setNotes,
} from "../../Store/BookReadingSlice";
import supabase from "../../supabase-client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface HighlightingProps {
  text: string;
  onClose: () => void;
}

const colors = ["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#a78bfa"];

const Highlighting = ({ text, onClose }: HighlightingProps) => {
  const { highlited, notes } = useSelector(
    (state: RootState) => state.bookReading
  );
  const dispatch = useDispatch();
  const { book } = useSelector((state: RootState) => state.bookReading);
  const [note, setNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showNotesList, setShowNotesList] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'highlight' | 'note';
    id: number;
    text: string; // Add the text to help identify the record in Supabase
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error) setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const onHighlight = async () => {
    if (!currentUser) {
      toast.error("Please log in before adding a highlight.");
      return;
    }

    try {
      const supabaseHighlight = {
        type: "highlight",
        highlight_color: selectedColor,
        highlight_text: text,
        user_id: currentUser.id,
        book_id: book.id,
        text: text
      };

      const { data, error } = await supabase
        .from("annotations")
        .insert([supabaseHighlight])
        .select(); // This returns the inserted record with its ID

      if (error) {
        toast.error("Error adding the highlight: " + error.message);
        return;
      }

      // Use the returned database ID instead of Date.now()
      const dbId = data?.[0]?.id || Date.now();
      
      dispatch(
        setHighlighted([
          ...highlited,
          {
            id: dbId, // Use database ID
            color: selectedColor,
            text: text,
          },
        ])
      );
      
      toast.success("Highlight added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding highlight:", error);
      toast.error("Failed to add highlight");
    }
  };

  const onNoteSubmit = async () => {
    if (!currentUser) {
      toast.error("Please log in before adding a note.");
      return;
    }

    try {
      const supabaseNote = {
        type: "note",
        note_text: note,
        user_id: currentUser.id,
        book_id: book.id,
        text: text
      };

      const { data, error } = await supabase
        .from("annotations")
        .insert([supabaseNote])
        .select(); // This returns the inserted record with its ID

      if (error) {
        toast.error("Error adding new note to database: " + error.message);
        return;
      }

      // Use the returned database ID instead of Date.now()
      const dbId = data?.[0]?.id || Date.now();

      const newNote = {
        id: dbId, // Use database ID
        selectedText: text,
        note: note,
      };

      dispatch(setNotes([...notes, newNote]));
      setNote("");
      setShowNotes(false);
      toast.success("Note added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const onNote = () => setShowNotes(true);

  const handleDeleteClick = (type: 'highlight' | 'note', id: number, text: string) => {
    setDeleteConfirm({ type, id, text });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm || !currentUser) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from Supabase using multiple conditions for safety
      const { error } = await supabase
        .from("annotations")
        .delete()
        .eq("id", deleteConfirm.id) // Primary condition: use the actual database ID
        .eq("user_id", currentUser.id) // Safety: ensure it belongs to current user
        .eq("book_id", book.id) // Safety: ensure it's from current book
        .eq("type", deleteConfirm.type); // Safety: ensure correct type

      if (error) {
        console.error("Error deleting from database:", error);
        toast.error(`Failed to delete ${deleteConfirm.type}`);
        return;
      }

      // Update Redux state
      if (deleteConfirm.type === 'highlight') {
        dispatch(deleteHighlight(deleteConfirm.id));
      } else {
        dispatch(deleteNote(deleteConfirm.id));
      }
      
      toast.success(`${deleteConfirm.type === 'highlight' ? 'Highlight' : 'Note'} deleted successfully!`);
      
    } catch (error) {
      console.error("Error during deletion:", error);
      toast.error(`Failed to delete ${deleteConfirm.type}`);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/40 via-slate-800/50 to-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform scale-100 transition-all duration-300 animate-in zoom-in-95 border border-gray-100/20">
        {/* Icon Container with Glow Effect */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-50 to-red-100 rounded-full shadow-lg ring-4 ring-red-100/50">
          <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full shadow-md">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Title with Better Typography */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-3 tracking-tight">
          Delete {deleteConfirm?.type === 'highlight' ? 'Highlight' : 'Note'}?
        </h3>
        
        {/* Description with Better Spacing */}
        <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
          This action cannot be undone. The {deleteConfirm?.type === 'highlight' ? 'highlight' : 'note'} will be permanently removed from your collection.
        </p>
        
        {/* Enhanced Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={cancelDelete}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={isDeleting}
            className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ring-2 ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className=" z-50 
  p-4 
  w-full max-w-[27rem]   
  sm:w-[27rem]          
  bg-white 
  rounded-xl 
  shadow-xl 
  border border-gray-300
  max-h-[90vh]           
  overflow-y-auto ">
       
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md font-semibold flex items-center justify-center gap-3">
            <PiHighlighterFill size={25} /> Highlight Text
          </h2>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-600 hover:text-black" />
          </button>
        </div>

        
        <blockquote className="text-sm italic text-gray-600 bg-gray-100 p-2 rounded mb-3 max-h-24 overflow-y-auto">
          {text}
        </blockquote>

     
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

       
        {showHighlights && (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {highlited.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No highlights yet
              </p>
            ) : (
              highlited.map((highlight) => (
                <div
                  key={highlight.id}
                  className="group relative flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-300"
                  style={{ backgroundColor: `${highlight.color}15` }}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div
                      className="text-sm font-medium px-3 py-2 rounded-lg shadow-sm border border-gray-200"
                      style={{ backgroundColor: `${highlight.color}40` }}
                    >
                      {truncateText(highlight.text)}
                    </div>
                  </div>
                  
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleDeleteClick('highlight', highlight.id, highlight.text)}
                      className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transform transition-all duration-200 hover:from-red-500 hover:to-red-700 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                      title="Delete highlight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showNotesList && (
          <div className="max-h-64 overflow-y-auto space-y-3">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No notes yet
              </p>
            ) : (
              notes.map((noteItem) => (
                <div
                  key={noteItem.id}
                  className="group relative p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 hover:border-blue-300"
                >
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleDeleteClick('note', noteItem.id, noteItem.selectedText)}
                      className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transform transition-all duration-200 hover:from-red-500 hover:to-red-700 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pr-10">
                    <div className="flex items-center mb-3">
                      <div className="text-xs font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-full shadow-sm">
                        📖 Selected Text
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg mb-3 border border-blue-200">
                      <p className="text-sm text-gray-700 italic font-medium">
                        "{truncateText(noteItem.selectedText, 60)}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                        📝 Your Note
                      </div>
                    </div>
                    
                    <div className="bg-white bg-opacity-80 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-800 leading-relaxed">{noteItem.note}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        
        {!showNotes && !showHighlights && !showNotesList && (
          <>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Choose highlight color:
            </p>
            <div className="flex space-x-2 mb-4">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg ${
                    selectedColor === color
                      ? "border-black scale-110 ring-2 ring-gray-300 ring-offset-2"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </>
        )}

      
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

     
      {deleteConfirm && <DeleteConfirmModal />}
    </>
  );
};

export default Highlighting;