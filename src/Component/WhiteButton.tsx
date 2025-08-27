import React from 'react'

interface buttonType {
  title: string
  onClick: () => void
  isBlack?: boolean
}

const WhiteButton = ({ title = "button", onClick, isBlack = false }: buttonType) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${isBlack ? 'bg-black text-white' : 'bg-white text-black'} 

        font-semibold 
        py-2 
        px-4 sm:px-6 md:px-8   
        text-sm sm:text-base 
        border 
        border-gray-300 
        rounded-lg 
        shadow-md 
        hover:bg-gray-100 
        hover:text-black 
        hover:border-gray-800 
        hover:shadow-lg 
        transition 
        duration-300 
        ease-in-out 
        focus:outline-none 
        md:text-sm
        md:py-0
        sm:py-0
        md:text-balance
        focus:ring-2 
        focus:ring-gray-300 
        focus:ring-opacity-50
        w-fit  
        mx-auto 
      `}
    >
      {title}
    </button>
  )
}

export default WhiteButton
