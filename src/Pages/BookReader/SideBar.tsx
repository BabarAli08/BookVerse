import { Check, BookOpen, Bookmark, ChevronDown, PenTool, Settings, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Store/store';
import { setFontFamily, setFontSize, setLetterSpacing, setLineHeight } from '../../Store/BookReadingSlice';
import { useState } from 'react';

interface sectionState{
    settings:boolean,
    highlights:boolean,
    bookmarks:boolean
}
interface colorState{
    pink:string,
    green:string,
    yellow:string,
    blue:string,
}
const ReadingSidebar = () => {
 
  const [expandedSections, setExpandedSections] = useState<sectionState>({
    settings: true,
    highlights: true,
    bookmarks: true
  });

  const dispatch=useDispatch()
  const {fontFamily,fontSize,lineHeight,letterSpacing}=useSelector((state:RootState)=>state.bookReading)

  const [highlights] = useState([
    {
      id: 1,
      chapter: 'Chapter 1',
      color: 'pink',
      text: 'Mindfulness is the practice of purposeful, non-judgmental awareness of the present...',
      completed: false
    },
    {
      id: 2,
      chapter: 'Chapter 1',
      color: 'green',
      text: 'Mindfulness is the practice of purposeful, non-judgmental awareness of the present...',
      completed: true
    },
    {
      id: 3,
      chapter: 'Chapter 2',
      color: 'yellow',
      text: 'The neuroplasticity of the brain allows us to rewire our thought patterns through consistent practice...',
      completed: false
    }
  ]);

  const [bookmarks] = useState([
    { id: 1, title: 'Introduction to Mindfulness', completed: false },
    { id: 2, title: 'The Science Behind Meditation', completed: true },
    { id: 3, title: 'Breathing Techniques', completed: false }
  ]);

  const fontFamilies = [
    "Georgia, serif" , "sans-serif" , 'cursive' , 'monospace'
  ];

  const toggleSection = (section: keyof sectionState) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };


  const getHighlightColor = (color:string) => {
    const colors:colorState = {
      pink: 'from-pink-400/20 to-rose-400/20 border-pink-400/30 shadow-pink-200/20',
      green: 'from-emerald-400/20 to-green-400/20 border-emerald-400/30 shadow-emerald-200/20',
      yellow: 'from-amber-400/20 to-yellow-400/20 border-amber-400/30 shadow-amber-200/20',
      blue: 'from-blue-400/20 to-indigo-400/20 border-blue-400/30 shadow-blue-200/20'
    };
    return colors[color as keyof colorState] || colors.yellow;
  };

  const toggleComplete = (type: string, id:number) => {
    console.log(`Toggling ${type} completion for id: ${id}`);
  };

  return (
    <div className="w-80 h-screen overflow-hidden relative">
     
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60"></div>
      
      
      <div className="absolute inset-0 backdrop-blur-xl bg-white/40 border-r border-white/20"></div>
      
      
      <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent">
        
        {/* Header */}
        <div className="p-6 relative">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  The Science of Mindfulness
                </h1>
                <p className="text-sm text-slate-500 font-medium">Chapter 2</p>
              </div>
            </div>
            <div className="w-full bg-gradient-to-r from-blue-200/40 to-indigo-200/40 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-1/3 shadow-sm"></div>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">33% Complete</p>
          </div>
        </div>

        {/* Reading Settings */}
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <button
              onClick={() => toggleSection('settings')}
              className="flex items-center justify-between w-full p-5 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Reading Settings</h2>
              </div>
              <div className={`transform transition-transform duration-300 ${expandedSections.settings ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </div>
            </button>
            
            {expandedSections.settings && (
              <div className="px-5 pb-5 space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Font Size */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Font Size
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => dispatch( setFontSize((e.target.value)))}
                        className="w-full h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                          [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-indigo-600 
                          [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 
                          [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-all"
                      />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>12px</span>
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-bold">
                        {fontSize}px
                      </span>
                      <span>24px</span>
                    </div>
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Font Family 
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => dispatch(setFontFamily(e.target.value as "Georgia, serif" | "sans-serif" | 'cursive' | 'monospace'))}
                    className="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl text-sm 
                      focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300
                      font-medium text-slate-700 shadow-sm"
                  >
                    {fontFamilies.map((font:any) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Line Height */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Line Height
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="1.2"
                      max="2.0"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => dispatch(setLineHeight((e.target.value)))}
                      className="w-full h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-purple-600 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 
                        [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-all"
                    />
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>1.2</span>
                      <span className="px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full text-xs font-bold">
                        {lineHeight}
                      </span>
                      <span>2.0</span>
                    </div>
                  </div>
                </div>

                {/* Letter Spacing */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Letter Spacing
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="-0.5"
                      max="2"
                      step="0.1"
                      value={letterSpacing}
                      onChange={(e) => dispatch(setLetterSpacing((e.target.value)))}
                      className="w-full h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-emerald-500 [&::-webkit-slider-thumb]:to-green-600 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 
                        [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-all"
                    />
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>-0.5px</span>
                      <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-xs font-bold">
                        {letterSpacing}px
                      </span>
                      <span>2px</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm border border-white/40 rounded-xl shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live Preview</p>
                  </div>
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      fontFamily: fontFamily,
                      lineHeight: lineHeight,
                      letterSpacing: `${letterSpacing}px`
                    }}
                    className="text-slate-700 font-medium"
                  >
                    The practice of mindfulness brings awareness to the present moment with gentle curiosity.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <button
              onClick={() => toggleSection('highlights')}
              className="flex items-center justify-between w-full p-5 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Your Highlights</h2>
              </div>
              <div className={`transform transition-transform duration-300 ${expandedSections.highlights ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </div>
            </button>
            
            {expandedSections.highlights && (
              <div className="px-5 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-300">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className={`p-4 rounded-xl bg-gradient-to-r ${getHighlightColor(highlight.color)} 
                      border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 
                      hover:scale-[1.02] group relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 bg-white/60 px-2 py-1 rounded-full">
                          {highlight.chapter}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          highlight.color === 'pink' ? 'bg-pink-400' :
                          highlight.color === 'green' ? 'bg-emerald-400' :
                          highlight.color === 'yellow' ? 'bg-amber-400' : 'bg-blue-400'
                        } shadow-sm`}></div>
                      </div>
                      <button
                        onClick={() => toggleComplete('highlight', highlight.id)}
                        className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                          highlight.completed
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                            : 'bg-white/60 text-slate-400 hover:bg-white/80 hover:text-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {highlight.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bookmarks */}
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <button
              onClick={() => toggleSection('bookmarks')}
              className="flex items-center justify-between w-full p-5 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                  <Bookmark className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Bookmarks</h2>
              </div>
              <div className={`transform transition-transform duration-300 ${expandedSections.bookmarks ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </div>
            </button>
            
            {expandedSections.bookmarks && (
              <div className="px-5 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/40 transition-all duration-300 
                      group hover:shadow-md backdrop-blur-sm border border-white/20"
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <span className={`text-sm flex-1 font-medium transition-all duration-300 ${
                      bookmark.completed ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-800'
                    }`}>
                      {bookmark.title}
                    </span>
                    <button
                      onClick={() => toggleComplete('bookmark', bookmark.id)}
                      className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                        bookmark.completed
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                          : 'bg-white/60 text-slate-400 hover:bg-white/80 hover:text-slate-600'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mark Chapter Complete */}
        <div className="px-6 pb-8">
          <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 
            hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all 
            duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] 
            group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 
              group-hover:opacity-100 transition-opacity duration-300"></div>
            <Check className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Mark Chapter Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingSidebar;