import { Menu, Bookmark, Search, MessageSquare, Moon, Sun } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Store/store';
import { setSidebar, toggleDark } from '../../Store/BookReadingSlice';

const Header = () => {
  
    const dispatch=useDispatch()
    const {togglDark: isDarkMode}=useSelector((state:RootState)=>state.bookReading)

  const toggleTheme = () => {
    dispatch(toggleDark());
  };

 

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
     
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100/80 border-gray-200'} backdrop-blur-sm border-b px-6 py-4 transition-colors duration-300`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          
          
          <button onClick={()=>dispatch(setSidebar())} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Center section - Book info */}
          <div className="flex-1 text-center px-8">
            <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
              The Art of Mindfulness
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              by Emma Watson
            </p>
          </div>

          
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}>
              <Bookmark className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}>
              <Search className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}>
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100/60 border-gray-200'} border-b px-6 py-3 transition-colors duration-300`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          
          {/* Chapter info */}
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Chapter 1 of 2
          </div>

          {/* Progress info */}
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            50% complete
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-6xl mx-auto mt-3">
          <div className={`w-full h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `67%` }}
            ></div>
          </div>
        </div>
      </div>

      
      
    </div>
  );
};

export default Header;