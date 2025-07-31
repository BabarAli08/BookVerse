import type { LucideIcon } from 'lucide-react';

interface ButtonState {
  title: string;
  logo: LucideIcon;
  isBlack?: boolean;
}

const BookDetailsButton = ({ title, logo: Logo, isBlack = false }: ButtonState) => {
  return (
    <button className={`
      group relative w-[100%] h-[5vh] min-h-[48px] 
      ${isBlack 
        ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg shadow-gray-900/25 hover:shadow-gray-900/40' 
        : 'bg-gradient-to-r from-white to-gray-50 text-gray-800 shadow-lg shadow-gray-200/50 hover:shadow-gray-300/60'
      }
      rounded-2xl border transition-all duration-300 ease-out
      ${isBlack 
        ? 'border-gray-700 hover:border-gray-600' 
        : 'border-gray-200 hover:border-gray-300'
      }
      flex items-center justify-center gap-3 px-6
      hover:scale-[1.02] hover:-translate-y-0.5
      active:scale-[0.98] active:translate-y-0
      overflow-hidden
    `}>
      
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${isBlack 
          ? 'bg-gradient-to-r from-gray-800/20 to-transparent' 
          : 'bg-gradient-to-r from-blue-50/30 to-transparent'
        }
      `} />
      
      
      <Logo 
        size={24} 
        className={`
          ${isBlack ? 'text-white' : 'text-gray-700'}
          transition-all duration-300 ease-out
          group-hover:scale-110 group-hover:rotate-3
          drop-shadow-sm
        `} 
      />
      
      {/* Title with improved typography */}
      <span className={`
        font-semibold text-sm tracking-wide
        ${isBlack ? 'text-white' : 'text-gray-800'}
        transition-all duration-300
        group-hover:tracking-wider
        relative z-10
      `}>
        {title}
      </span>
      
      {/* Subtle shine effect */}
      <div className="
        absolute top-0 -left-4 w-6 h-full 
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        transform -skew-x-12 translate-x-[-100%]
        group-hover:translate-x-[calc(100%+90%)]
        transition-transform duration-700 ease-out
      " />
    </button>
  );
};

export default BookDetailsButton;