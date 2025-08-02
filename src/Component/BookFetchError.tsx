import { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, AlertCircle, Home, Search, Sparkles } from 'lucide-react';

export default function BookFetchError({ onRetry, onGoHome, onSearch, errorMessage = "Unable to load books" }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    // Generate floating elements
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2
    }));
    setFloatingElements(elements);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry?.();
    setTimeout(() => setIsRetrying(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 relative overflow-hidden flex items-center justify-center p-6">
      
      {/* Subtle floating shapes */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute w-3 h-3 bg-purple-200/40 rounded-full animate-pulse"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`
          }}
        />
      ))}

      {/* Decorative blur orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative max-w-md w-full">
        {/* Main card with elegant styling */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-100/50 relative overflow-hidden">
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent rounded-3xl"></div>
          
          <div className="relative z-10">
            {/* Error illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Main icon container */}
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-12 h-12 text-purple-600" />
                </div>
                
                {/* Error indicator */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                
                {/* Sparkle effects */}
                <Sparkles className="absolute -top-3 -left-3 w-6 h-6 text-purple-400 animate-pulse" />
                <Sparkles className="absolute -bottom-1 -right-4 w-4 h-4 text-purple-300 animate-pulse" style={{animationDelay: '1s'}} />
              </div>
            </div>

            {/* Error message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{errorMessage}</p>
              
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium border border-red-100">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                Connection failed
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              {/* Primary retry button */}
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="group w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <RefreshCw className={`w-5 h-5 relative z-10 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="relative z-10">{isRetrying ? 'Retrying...' : 'Try Again'}</span>
              </button>

              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onGoHome}
                  className="group bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 hover:scale-[1.02]"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Home</span>
                </button>
                
                <button
                  onClick={onSearch}
                  className="group bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-purple-200 hover:border-purple-300 hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Help text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Check your internet connection or try again in a moment
              </p>
            </div>
          </div>
        </div>

        {/* Floating decorative elements around the card */}
        <div className="absolute -top-6 -left-6 w-4 h-4 bg-purple-300 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute -top-4 -right-8 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -bottom-6 -right-6 w-5 h-5 bg-purple-200 rounded-full animate-bounce opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-4 -left-8 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.5s'}}></div>
      </div>
    </div>
  );
}

// Demo component
function App() {
  const [showError, setShowError] = useState(true);

  if (!showError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📚 Welcome to Your Library</h1>
          <p className="text-gray-600 mb-6">Your books are loading successfully!</p>
          <button
            onClick={() => setShowError(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          >
            Simulate Error
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookFetchError
      errorMessage="We couldn't load your book collection right now. Please check your connection and try again."
      onRetry={() => {
        console.log('Retrying...');
        setTimeout(() => setShowError(false), 2000);
      }}
      onGoHome={() => {
        console.log('Going home...');
        setShowError(false);
      }}
      onSearch={() => {
        console.log('Opening search...');
        alert('Search functionality would open here');
      }}
    />
  );
}