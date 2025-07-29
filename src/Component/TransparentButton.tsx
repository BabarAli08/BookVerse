import type {button} from '../Types'


const TransparentButton = ({ title="button", onClick,isBlack=false }:button) => {
  return (
    <button
      onClick={onClick}
      className=
       {` 
        ${isBlack?'text-black':'text-white'}
        bg-transparent 
        font-medium 
        py-2 
        px-6 
       
        
        border-gray-200
        border-1 
        rounded-lg 
        hover:bg-gray-100 
        hover:text-black
        hover:border-gray-800 
        transition 
        duration-300 
        ease-in-out 
        focus:outline-none 
        focus:ring-2 
        focus:ring-gray-300 
        focus:ring-opacity-50
      `}
    >
      {title}
    </button>
  )
}

export default TransparentButton
