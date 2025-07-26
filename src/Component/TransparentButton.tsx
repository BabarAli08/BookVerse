import type {button} from '../Types'


const TransparentButton = ({ title="button", onClick }:button) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-transparent 
        text-gray-800 
        font-medium 
        py-2 
        px-6 
        text-white
        border 
        border-gray-500 
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
      "
    >
      {title}
    </button>
  )
}

export default TransparentButton
