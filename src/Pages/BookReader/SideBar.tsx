import { Check, BookOpen, Bookmark, ChevronDown, PenTool, Settings, Sparkles, Moon, Sun, Palette } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Store/store';
import { setFontFamily, setFontSize, setLetterSpacing, setLineHeight,toggleDark } from '../../Store/BookReadingSlice';
import { useState } from 'react';

interface sectionState {
  settings: boolean,
  highlights: boolean,
  bookmarks: boolean
}

interface colorState {
  pink: string,
  green: string,
  yellow: string,
  blue: string,
}

const ReadingSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<sectionState>({
    settings: true,
    highlights: true,
    bookmarks: true
  });

  const dispatch = useDispatch();
  const { fontFamily, fontSize, lineHeight, togglDark, letterSpacing } = useSelector((state: RootState) => state.bookReading);

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
    "Georgia, serif", "sans-serif", 'cursive', 'monospace'
  ];

  const toggleSection = (section: keyof sectionState) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getHighlightColor = (color: string) => {
    const lightColors: colorState = {
      pink: 'from-pink-400/20 to-rose-400/20 border-pink-400/30 shadow-pink-200/20',
      green: 'from-emerald-400/20 to-green-400/20 border-emerald-400/30 shadow-emerald-200/20',
      yellow: 'from-amber-400/20 to-yellow-400/20 border-amber-400/30 shadow-amber-200/20',
      blue: 'from-blue-400/20 to-indigo-400/20 border-blue-400/30 shadow-blue-200/20'
    };
    
    const darkColors: colorState = {
      pink: 'from-pink-500/30 to-rose-500/30 border-pink-500/40 shadow-pink-900/20',
      green: 'from-emerald-500/30 to-green-500/30 border-emerald-500/40 shadow-emerald-900/20',
      yellow: 'from-amber-500/30 to-yellow-500/30 border-amber-500/40 shadow-amber-900/20',
      blue: 'from-blue-500/30 to-indigo-500/30 border-blue-500/40 shadow-blue-900/20'
    };
    
    const colors = togglDark ? darkColors : lightColors;
    return colors[color as keyof colorState] || colors.yellow;
  };

  const toggleComplete = (type: string, id: number) => {
    console.log(`Toggling ${type} completion for id: ${id}`);
  };

  return (
    <div className="w-80 h-screen overflow-hidden relative">
      {/* Background with theme-aware gradients */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        togglDark 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800/90 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60'
      }`}></div>
      
      {/* Glass overlay */}
      <div className={`absolute inset-0 backdrop-blur-xl border-r transition-all duration-500 ${
        togglDark 
          ? 'bg-gray-900/60 border-gray-700/30' 
          : 'bg-white/40 border-white/20'
      }`}></div>
      
      {/* Scrollable content with custom scrollbar */}
      <div className={`relative h-full overflow-y-auto transition-all duration-300 custom-sidebar-scrollbar ${
        togglDark ? 'scrollbar-dark' : 'scrollbar-light'
      }`}>
        
        {/* Header */}
        <div className="p-6 relative">
          <div className={`backdrop-blur-sm rounded-2xl p-5 shadow-lg border transition-all duration-500 ${
            togglDark 
              ? 'bg-gray-800/60 border-gray-700/20 shadow-black/20' 
              : 'bg-white/60 border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className={`text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                    togglDark 
                      ? 'from-gray-100 to-gray-300' 
                      : 'from-slate-800 to-slate-600'
                  }`}>
                    The Science of Mindfulness
                  </h1>
                  <p className={`text-sm font-medium transition-colors duration-500 ${
                    togglDark ? 'text-gray-400' : 'text-slate-500'
                  }`}>Chapter 2</p>
                </div>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleDark())}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  togglDark 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-slate-600/20 text-slate-600 hover:bg-slate-600/30'
                }`}
              >
                {togglDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
            
            <div className={`w-full rounded-full h-2 transition-colors duration-500 ${
              togglDark ? 'bg-gradient-to-r from-gray-700/40 to-gray-600/40' : 'bg-gradient-to-r from-blue-200/40 to-indigo-200/40'
            }`}>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full w-1/3 shadow-sm"></div>
            </div>
            <p className={`text-xs mt-2 font-medium transition-colors duration-500 ${
              togglDark ? 'text-gray-400' : 'text-slate-600'
            }`}>33% Complete</p>
          </div>
        </div>

        {/* Reading Settings */}
        <div className="px-6 pb-6">
          <div className={`backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 ${
            togglDark 
              ? 'bg-gray-800/60 border-gray-700/20 shadow-black/20' 
              : 'bg-white/60 border-white/20'
          }`}>
            <button
              onClick={() => toggleSection('settings')}
              className={`flex items-center justify-between w-full p-5 transition-all duration-300 ${
                togglDark ? 'hover:bg-gray-700/20' : 'hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h2 className={`text-lg font-bold transition-colors duration-500 ${
                  togglDark ? 'text-gray-100' : 'text-slate-800'
                }`}>Reading Settings</h2>
              </div>
              <div className={`transform transition-transform duration-300 ${expandedSections.settings ? 'rotate-180' : ''}`}>
                <ChevronDown className={`w-5 h-5 transition-colors duration-500 ${
                  togglDark ? 'text-gray-400' : 'text-slate-500'
                }`} />
              </div>
            </button>
            
            {expandedSections.settings && (
              <div className="px-5 pb-5 space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Font Size */}
                <div className="space-y-3">
                  <label className={`block text-sm font-semibold transition-colors duration-500 ${
                    togglDark ? 'text-gray-200' : 'text-slate-700'
                  }`}>
                    Font Size
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => dispatch(setFontSize((e.target.value)))}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-300
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                          [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-indigo-600 
                          [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 
                          [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-all
                          ${togglDark ? 'bg-gradient-to-r from-gray-600 to-gray-500' : 'bg-gradient-to-r from-slate-200 to-slate-300'}`}
                      />
                    </div>
                    <div className={`flex justify-between text-xs font-medium transition-colors duration-500 ${
                      togglDark ? 'text-gray-400' : 'text-slate-500'
                    }`}>
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
                  <label className={`block text-sm font-semibold transition-colors duration-500 ${
                    togglDark ? 'text-gray-200' : 'text-slate-700'
                  }`}>
                    Font Family 
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => dispatch(setFontFamily(e.target.value as "Georgia, serif" | "sans-serif" | 'cursive' | 'monospace'))}
                    className={`w-full p-3 backdrop-blur-sm border rounded-xl text-sm 
                      focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300
                      font-medium shadow-sm ${
                        togglDark 
                          ? 'bg-gray-700/80 border-gray-600/30 text-gray-200' 
                          : 'bg-white/80 border-white/30 text-slate-700'
                      }`}
                  >
                    {fontFamilies.map((font: any) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Line Height */}
                <div className="space-y-3">
                  <label className={`block text-sm font-semibold transition-colors duration-500 ${
                    togglDark ? 'text-gray-200' : 'text-slate-700'
                  }`}>
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
                      className={`w-full h-2 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-violet-500 [&::-webkit-slider-thumb]:to-purple-600 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 
                        [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-all
                        ${togglDark ? 'bg-gradient-to-r from-gray-600 to-gray-500' : 'bg-gradient-to-r from-slate-200 to-slate-300'}`}
                    />
                    <div className={`flex justify-between text-xs font-medium transition-colors duration-500 ${
                      togglDark ? 'text-gray-400' : 'text-slate-500'
                    }`}>
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
                  <label className={`block text-sm font-semibold transition-colors duration-500 ${
                    togglDark ? 'text-gray-200' : 'text-slate-700'
                  }`}>
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
                      className={`w-full h-2 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                        [&::-webkit-slider-thumb]:from-emerald-500 [&::-webkit-slider-thumb]:to-green-600 
                        [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 
                        [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-all
                        ${togglDark ? 'bg-gradient-to-r from-gray-600 to-gray-500' : 'bg-gradient-to-r from-slate-200 to-slate-300'}`}
                    />
                    <div className={`flex justify-between text-xs font-medium transition-colors duration-500 ${
                      togglDark ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      <span>-0.5px</span>
                      <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-xs font-bold">
                        {letterSpacing}px
                      </span>
                      <span>2px</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className={`p-4 backdrop-blur-sm border rounded-xl shadow-inner transition-all duration-500 ${
                  togglDark 
                    ? 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 border-gray-600/40' 
                    : 'bg-gradient-to-br from-white/80 to-slate-50/80 border-white/40'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <p className={`text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
                      togglDark ? 'text-gray-400' : 'text-slate-600'
                    }`}>Live Preview</p>
                  </div>
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      fontFamily: fontFamily,
                      lineHeight: lineHeight,
                      letterSpacing: `${letterSpacing}px`
                    }}
                    className={`font-medium transition-colors duration-500 ${
                      togglDark ? 'text-gray-200' : 'text-slate-700'
                    }`}
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
          <div className={`backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 ${
            togglDark 
              ? 'bg-gray-800/60 border-gray-700/20 shadow-black/20' 
              : 'bg-white/60 border-white/20'
          }`}>
            <button
              onClick={() => toggleSection('highlights')}
              className={`flex items-center justify-between w-full p-5 transition-all duration-300 ${
                togglDark ? 'hover:bg-gray-700/20' : 'hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <h2 className={`text-lg font-bold transition-colors duration-500 ${
                  togglDark ? 'text-gray-100' : 'text-slate-800'
                }`}>Your Highlights</h2>
              </div>
              <div className={`transform transition-transform duration-300 ${expandedSections.highlights ? 'rotate-180' : ''}`}>
                <ChevronDown className={`w-5 h-5 transition-colors duration-500 ${
                  togglDark ? 'text-gray-400' : 'text-slate-500'
                }`} />
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
                        <span className={`text-xs font-bold px-2 py-1 rounded-full transition-colors duration-500 ${
                          togglDark ? 'text-gray-300 bg-gray-700/60' : 'text-slate-600 bg-white/60'
                        }`}>
                          {highlight.chapter}
                        </span>
                        <div className={`w-3 h-3 rounded-full shadow-sm ${
                          highlight.color === 'pink' ? 'bg-pink-400' :
                          highlight.color === 'green' ? 'bg-emerald-400' :
                          highlight.color === 'yellow' ? 'bg-amber-400' : 'bg-blue-400'
                        }`}></div>
                      </div>
                      <button
                        onClick={() => toggleComplete('highlight', highlight.id)}
                        className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                          highlight.completed
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                            : togglDark 
                              ? 'bg-gray-700/60 text-gray-400 hover:bg-gray-600/80 hover:text-gray-300'
                              : 'bg-white/60 text-slate-400 hover:bg-white/80 hover:text-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                    <p className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${
                      togglDark ? 'text-gray-200' : 'text-slate-700'
                    }`}>
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
          <div className={`backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 ${
            togglDark 
              ? 'bg-gray-800/60 border-gray-700/20 shadow-black/20' 
              : 'bg-white/60 border-white/20'
          }`}>
            <button
              onClick={() => toggleSection('bookmarks')}
              className={`flex items-center justify-between w-full p-5 transition-all duration-300 ${
                togglDark ? 'hover:bg-gray-700/20' : 'hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                  <Bookmark className="w-4 h-4 text-white" />
                </div>
                <h2 className={`text-lg font-bold transition-colors duration-500 ${
                  togglDark ? 'text-gray-100' : 'text-slate-800'
                }`}>Bookmarks</h2>
              </div>
              <div className={`transform transition-transform duration-300 ${expandedSections.bookmarks ? 'rotate-180' : ''}`}>
                <ChevronDown className={`w-5 h-5 transition-colors duration-500 ${
                  togglDark ? 'text-gray-400' : 'text-slate-500'
                }`} />
              </div>
            </button>
            
            {expandedSections.bookmarks && (
              <div className="px-5 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 
                      group hover:shadow-md backdrop-blur-sm border ${
                        togglDark 
                          ? 'hover:bg-gray-700/40 border-gray-600/20' 
                          : 'hover:bg-white/40 border-white/20'
                      }`}
                  >
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <span className={`text-sm flex-1 font-medium transition-all duration-300 ${
                      bookmark.completed 
                        ? togglDark ? 'line-through text-gray-500' : 'line-through text-slate-400'
                        : togglDark ? 'text-gray-200 group-hover:text-gray-100' : 'text-slate-700 group-hover:text-slate-800'
                    }`}>
                      {bookmark.title}
                    </span>
                    <button
                      onClick={() => toggleComplete('bookmark', bookmark.id)}
                      className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                        bookmark.completed
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                          : togglDark 
                            ? 'bg-gray-700/60 text-gray-400 hover:bg-gray-600/80 hover:text-gray-300'
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

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-sidebar-scrollbar {
          scrollbar-width: thin;
        }

        .scrollbar-light {
          scrollbar-color: #CBD5E1 #F8FAFC;
        }

        .scrollbar-dark {
          scrollbar-color: #4B5563 #1F2937;
        }

        .custom-sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-light::-webkit-scrollbar-track {
          background: rgba(248, 250, 252, 0.3);
          border-radius: 10px;
          margin: 8px 0;
        }

        .scrollbar-dark::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
          margin: 8px 0;
        }

        .scrollbar-light::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #94A3B8 0%, #64748B 100%);
          border-radius: 10px;
          border: 1px solid rgba(248, 250, 252, 0.5);
          transition: all 0.3s ease;
        }

        .scrollbar-dark::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6B7280 0%, #4B5563 100%);
          border-radius: 10px;
          border: 1px solid rgba(31, 41, 55, 0.5);
          transition: all 0.3s ease;
        }

        .scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #64748B 0%, #475569 100%);
          transform: scaleX(1.5);
        }

        .scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%);
          transform: scaleX(1.5);
        }

        .scrollbar-light::-webkit-scrollbar-thumb:active {
          background: #334155;
        }

        .scrollbar-dark::-webkit-scrollbar-thumb:active {
          background: #374151;
        }

        .custom-sidebar-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Smooth animations for all transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced focus styles for accessibility */
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
          border-radius: 8px;
        }

        /* Custom range slider animations */
        input[type="range"]:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
        }

        /* Gradient text animations */
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Subtle pulse animation for active elements */
        .pulse-soft {
          animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Glow effect for interactive elements */
        .glow-on-hover:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        /* Theme transition for smooth color changes */
        .theme-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default ReadingSidebar;