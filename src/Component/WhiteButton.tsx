import React from 'react'
interface buttonType{
    title:string
    onClick:()=>void
}
const WhiteButton = ({ title="button",onClick}:buttonType) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-white 
        text-gray-800 
        font-semibold 
        py-2 
        px-8 
        border 
        border-gray-300 
        rounded-lg 
        shadow-md 
        hover:bg-gray-100 
        hover:shadow-lg 
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

export default WhiteButton
