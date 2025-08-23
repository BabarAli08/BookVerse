import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

export default function ReadingPreferences() {
  const [preferences, setPreferences] = useState({
    readingTheme: "Light",
    fontFamily: "Serif",
    fontSize: "Medium",
    lineSpacing: "Normal",
    autoBookmark: true,
    offlineDownloads: true,
  });

  const handleSelectChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const themeOptions = ["Light", "Dark", "Sepia", "High Contrast"];
  const fontFamilyOptions = ["Serif", "Sans Serif", "Monospace", "Dyslexic"];
  const fontSizeOptions = ["Small", "Medium", "Large", "Extra Large"];
  const lineSpacingOptions = ["Tight", "Normal", "Relaxed", "Double"];

  const SelectField = ({ label, value, options, onChange }:{label:string,value:string,options:string[],onChange:(value:string)=>void}) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Reading Preferences</h2>
      </div>
      
      <div className="space-y-6">
      
        <div className="flex flex-col md:flex-row gap-6">
          <SelectField
            label="Reading Theme"
            value={preferences.readingTheme}
            options={themeOptions}
            onChange={(value) => handleSelectChange('readingTheme', value)}
          />
          
          <SelectField
            label="Font Size"
            value={preferences.fontSize}
            options={fontSizeOptions}
            onChange={(value) => handleSelectChange('fontSize', value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <SelectField
            label="Font Family"
            value={preferences.fontFamily}
            options={fontFamilyOptions}
            onChange={(value) => handleSelectChange('fontFamily', value)}
          />
          
          <SelectField
            label="Line Spacing"
            value={preferences.lineSpacing}
            options={lineSpacingOptions}
            onChange={(value) => handleSelectChange('lineSpacing', value)}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Auto Bookmark
              </h3>
              <p className="text-sm text-gray-500">
                Automatically save your reading position
              </p>
            </div>
            
            <button
              onClick={() => handleToggle('autoBookmark')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                preferences.autoBookmark 
                  ? 'bg-purple-600' 
                  : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={preferences.autoBookmark}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.autoBookmark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                Offline Downloads
              </h3>
              <p className="text-sm text-gray-500">
                Allow downloading books for offline reading
              </p>
            </div>
            
            <button
              onClick={() => handleToggle('offlineDownloads')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                preferences.offlineDownloads 
                  ? 'bg-purple-600' 
                  : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={preferences.offlineDownloads}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.offlineDownloads ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

   
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        
        <div className={`p-6 rounded-lg border-2 border-gray-200 ${
          preferences.readingTheme === 'Dark' ? 'bg-gray-900 text-white' :
          preferences.readingTheme === 'Sepia' ? 'bg-amber-50 text-amber-900' :
          preferences.readingTheme === 'High Contrast' ? 'bg-black text-yellow-400' :
          'bg-white text-gray-900'
        }`}>
          <p className={`${
            preferences.fontFamily === 'Sans Serif' ? 'font-sans' :
            preferences.fontFamily === 'Monospace' ? 'font-mono' :
            preferences.fontFamily === 'Dyslexic' ? 'font-sans' :
            'font-serif'
          } ${
            preferences.fontSize === 'Small' ? 'text-sm' :
            preferences.fontSize === 'Large' ? 'text-lg' :
            preferences.fontSize === 'Extra Large' ? 'text-xl' :
            'text-base'
          } ${
            preferences.lineSpacing === 'Tight' ? 'leading-tight' :
            preferences.lineSpacing === 'Relaxed' ? 'leading-relaxed' :
            preferences.lineSpacing === 'Double' ? 'leading-loose' :
            'leading-normal'
          }`}>
            The quick brown fox jumps over the lazy dog. This is a sample of how your reading experience will look with the current settings. You can adjust the theme, font, and spacing to match your preferences.
          </p>
        </div>
      </div>
    </div>
  );
}