// LoadingComponents.tsx - Add these to your components folder

import React from 'react';

// Highlight Loading Card Component
export const HighlightLoadingCard = ({ isDark = false }) => {
  return (
    <div className={`p-4 rounded-lg border mb-3 animate-pulse ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Color indicator */}
      <div className={`w-4 h-4 rounded-full mb-3 ${
        isDark ? 'bg-gray-700' : 'bg-gray-300'
      }`}></div>
      
      {/* Text lines */}
      <div className="space-y-2">
        <div className={`h-4 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-full`}></div>
        <div className={`h-4 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-4/5`}></div>
        <div className={`h-4 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-3/5`}></div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <div className={`h-6 w-16 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
        <div className={`h-6 w-16 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
      </div>
    </div>
  );
};

// Note Loading Card Component
export const NoteLoadingCard = ({ isDark = false }) => {
  return (
    <div className={`p-4 rounded-lg border mb-3 animate-pulse ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Note header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-5 h-5 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
        <div className={`h-4 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-24`}></div>
      </div>
      
      {/* Selected text */}
      <div className="space-y-2 mb-4">
        <div className={`h-3 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-full`}></div>
        <div className={`h-3 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-3/4`}></div>
      </div>
      
      {/* Note content */}
      <div className={`p-3 rounded border-l-4 mb-3 ${
        isDark 
          ? 'bg-gray-750 border-gray-600' 
          : 'bg-gray-100 border-gray-400'
      }`}>
        <div className="space-y-2">
          <div className={`h-3 rounded ${
            isDark ? 'bg-gray-600' : 'bg-gray-400'
          } w-full`}></div>
          <div className={`h-3 rounded ${
            isDark ? 'bg-gray-600' : 'bg-gray-400'
          } w-5/6`}></div>
          <div className={`h-3 rounded ${
            isDark ? 'bg-gray-600' : 'bg-gray-400'
          } w-2/3`}></div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2">
        <div className={`h-6 w-12 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
        <div className={`h-6 w-16 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
      </div>
    </div>
  );
};

// Completed Book Button Loading
export const CompletedBookButtonLoading = ({ isDark = false }) => {
  return (
    <div className={`p-4 rounded-lg border animate-pulse ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Progress circle */}
      <div className="flex items-center justify-center mb-4">
        <div className={`w-16 h-16 rounded-full border-4 ${
          isDark 
            ? 'border-gray-700 border-t-gray-600' 
            : 'border-gray-300 border-t-gray-400'
        }`}></div>
      </div>
      
      {/* Text */}
      <div className="text-center space-y-2">
        <div className={`h-4 rounded mx-auto ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-32`}></div>
        <div className={`h-3 rounded mx-auto ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        } w-24`}></div>
      </div>
      
      {/* Button */}
      <div className={`h-10 rounded-lg mt-4 ${
        isDark ? 'bg-gray-700' : 'bg-gray-300'
      }`}></div>
    </div>
  );
};

// Sidebar Loading State
export const SidebarLoadingState = ({ isDark = false }) => {
  return (
    <div className={`p-6 h-full ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className={`h-6 rounded ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        } w-32 mb-2 animate-pulse`}></div>
        <div className={`h-4 rounded ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        } w-48 animate-pulse`}></div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-8 rounded px-4 flex-1 ${
            isDark ? 'bg-gray-800' : 'bg-gray-200'
          } animate-pulse`}></div>
        ))}
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <HighlightLoadingCard isDark={isDark} />
        <HighlightLoadingCard isDark={isDark} />
        <NoteLoadingCard isDark={isDark} />
      </div>
    </div>
  );
};

// Enhanced Loading Animation Component
export const PulseLoader = ({ isDark = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} rounded-full animate-pulse ${
            isDark ? 'bg-gray-600' : 'bg-gray-400'
          }`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
    </div>
  );
};

// Shimmer Effect Component
export const ShimmerCard = ({ isDark = false, height = 'h-24' }) => {
  return (
    <div className={`${height} rounded-lg overflow-hidden relative ${
      isDark ? 'bg-gray-800' : 'bg-gray-200'
    }`}>
      <div className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r ${
        isDark 
          ? 'from-gray-800 via-gray-700 to-gray-800' 
          : 'from-gray-200 via-gray-100 to-gray-200'
      }`}></div>
    </div>
  );
};

// Usage Example for your BookReader component:
export const BookReaderLoadingStates = ({ togglDark }) => {
  return (
    <>
      {/* Add this CSS to your component or global styles */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite ease-in-out;
        }
      `}</style>
      
      {/* Example implementation in your sidebar */}
      <div className="space-y-4">
        <div className={`text-sm font-medium mb-3 flex items-center gap-2 ${
          togglDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <PulseLoader isDark={togglDark} size="sm" />
          Loading your highlights...
        </div>
        
        {/* Show 3 loading highlight cards */}
        {[1, 2, 3].map((i) => (
          <HighlightLoadingCard key={i} isDark={togglDark} />
        ))}
        
        <div className={`text-sm font-medium mb-3 flex items-center gap-2 ${
          togglDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <PulseLoader isDark={togglDark} size="sm" />
          Loading your notes...
        </div>
        
        {/* Show 2 loading note cards */}
        {[1, 2].map((i) => (
          <NoteLoadingCard key={i} isDark={togglDark} />
        ))}
        
        <div className="mt-6">
          <CompletedBookButtonLoading isDark={togglDark} />
        </div>
      </div>
    </>
  );
};