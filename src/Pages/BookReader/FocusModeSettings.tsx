import { useState } from 'react';
import { X, Settings, Clock, Volume2, VolumeX, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Store/store';
import { setFontSize, setIsFocused, setLineHeight, setTheme } from '../../Store/BookReadingSlice';

const FocusModeSettings = () => {
  const dispatch = useDispatch();
  const { isFocused, lineHeight, fontSize, theme, togglDark } = useSelector((state: RootState) => state.bookReading);
  
  const [focusSettingsOpen, setFocusSettingsOpen] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);
  const [focusTime, setFocusTime] = useState(1800);
  const [isHovered, setIsHovered] = useState(false);

  const themes = [
          {
            id: "light",
            name: "Light",
            bg: "bg-white",
            text: "text-gray-900",
            hex: { bg: "#FFFFFF", text: "#111827" }, 
          },
          {
            id: "sepia",
            name: "Sepia",
            bg: "bg-amber-50",
            text: "text-amber-900",
            hex: { bg: "#FFFBEB", text: "#78350F" }, 
          },
          {
            id: "dark",
            name: "Dark",
            bg: "bg-slate-800",
            text: "text-white",
            hex: { bg: "#1E293B", text: "#FFFFFF" }, 
          },
          {
            id: "forest",
            name: "Forest",
            bg: "bg-green-50",
            text: "text-green-800",
            hex: { bg: "#ECFDF5", text: "#065F46" }, 
          },
          {
            id: "ocean",
            name: "Ocean",
            bg: "bg-blue-50",
            text: "text-blue-800",
            hex: { bg: "#EFF6FF", text: "#1E40AF" }, 
          },
          {
            id: "lavender",
            name: "Lavender",
            bg: "bg-purple-50",
            text: "text-purple-800",
            hex: { bg: "#FAF5FF", text: "#5B21B6" }, 
          },
        ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTheme = theme || themes[0];
  
  const handleThemeChange = (id: string) => {
    const selectedTheme = themes.find(t => t.id === id);
    if (selectedTheme) {
      dispatch(setTheme(selectedTheme));
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFontSize(e.target.value));
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLineHeight(e.target.value));
  };

  const exitFocusMode = () => {
    dispatch(setIsFocused(false));
  };

  if (!isFocused) return null;

  return (
    <>
      {/* Minimal Focus Mode Controls - Fixed Position, Top Right */}
      <div 
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`${currentTheme?.bg} ${currentTheme?.text} rounded-lg shadow-lg backdrop-blur-sm border border-white/20`}>
          {/* Compact Status Bar */}
          <div className="px-3 py-2 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 opacity-60" />
              <span className="text-xs opacity-80">Focus Mode</span>
            </div>
            <div className="flex items-center gap-1 text-xs opacity-60">
              <Clock className="w-3 h-3" />
              <span>{formatTime(focusTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setFocusSettingsOpen(true)}
                className="p-1 hover:bg-black/10 rounded-md transition-colors"
                title="Focus Settings"
              >
                <Settings className="w-3 h-3" />
              </button>
              <button 
                onClick={exitFocusMode}
                className="p-1 hover:bg-black/10 rounded-md transition-colors"
                title="Exit Focus Mode"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

     
      {focusSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-full max-w-sm animate-in slide-in-from-top-4 duration-300 ${
            togglDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${
              togglDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`font-semibold ${togglDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Focus Settings
              </h2>
              <button
                onClick={() => setFocusSettingsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  togglDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Reading Theme */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${togglDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Reading Theme
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption.id)}
                      className={`${themeOption.bg} p-3 rounded-lg text-center transition-all duration-200 ${
                        currentTheme?.id === themeOption.id 
                          ? 'ring-2 ring-blue-500 scale-105' 
                          : 'hover:ring-1 hover:ring-gray-300 hover:scale-102'
                      }`}
                    >
                      <div className={`${themeOption.text}`}>
                        <div className="font-medium text-sm">{themeOption.name}</div>
                        <div className="text-xs opacity-70 mt-1">Aa</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${togglDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Font Size
                </h3>
                <div className="px-1">
                  <input
                    type="range"
                    min="16"
                    max="32"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className={`flex justify-between text-xs mt-2 ${
                    togglDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>16px</span>
                    <span className={`font-medium ${togglDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {fontSize}px
                    </span>
                    <span>32px</span>
                  </div>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${togglDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Line Height
                </h3>
                <div className="px-1">
                  <input
                    type="range"
                    min="1.4"
                    max="2.2"
                    step="0.1"
                    value={lineHeight}
                    onChange={handleLineHeightChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className={`flex justify-between text-xs mt-2 ${
                    togglDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span>1.4</span>
                    <span className={`font-medium ${togglDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {lineHeight}
                    </span>
                    <span>2.2</span>
                  </div>
                </div>
              </div>

              {/* Ambient Sound */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${togglDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Ambient Sound
                </h3>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-sm ${
                    togglDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>Soft background noise</span>
                  </div>
                  <button
                    onClick={() => setAmbientSound(!ambientSound)}
                    className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                      ambientSound
                        ? togglDark 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : togglDark 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {ambientSound ? 'On' : 'Off'}
                  </button>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setFocusSettingsOpen(false)}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${
                  togglDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-from-top-4 {
          from { transform: translateY(-16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .slide-in-from-top-4 {
          animation: slide-in-from-top-4 0.3s ease-out;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .slider {
          background: ${togglDark ? '#374151' : '#E5E7EB'};
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563EB;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          background: #2563EB;
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default FocusModeSettings;