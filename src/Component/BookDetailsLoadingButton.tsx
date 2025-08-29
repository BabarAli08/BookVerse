import { Loader2 } from "lucide-react";

interface LoadingButtonState {
  title?: string;
  isBlack?: boolean;
}

const BookDetailsLoadingButton = ({ title = "Loading...", isBlack = false }: LoadingButtonState) => {
  return (
    <button
      disabled
      className={`
        group relative w-[100%] h-[5vh] min-h-[48px] cursor-not-allowed
        ${isBlack 
          ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg shadow-gray-900/25' 
          : 'bg-gradient-to-r from-white to-gray-50 text-gray-800 shadow-lg shadow-gray-200/50'
        }
        rounded-2xl border transition-all duration-300 ease-out
        ${isBlack ? 'border-gray-700' : 'border-gray-200'}
        flex items-center justify-center gap-3 px-6
        overflow-hidden
        opacity-90
      `}
    >
      <Loader2 
        size={22} 
        className={`
          animate-spin
          ${isBlack ? 'text-white' : 'text-gray-700'}
        `} 
      />

     
      <span
        className={`
          font-semibold text-sm tracking-wide
          ${isBlack ? 'text-white' : 'text-gray-800'}
        `}
      >
        {title}
      </span>
    </button>
  );
};

export default BookDetailsLoadingButton;
