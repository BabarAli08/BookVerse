import { IoSearch } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState } from "react";
import ProfileDropdown from "./ProfileSettings";

const Navbar = () => {
  const [profileClicked, setProfileClicked] = useState<boolean>(false);

  const icons = [
    { component: IoSearch, onClick: undefined },
    { component: LuShoppingCart, onClick: undefined },
    { component: FaUser, onClick: () => setProfileClicked(!profileClicked) },
  ];
  const links = [
    { name: "Home", url: "/" },
    { name: "Books", url: "/books" },
    { name: "Premium", url: "/premium" },
    { name: "About", url: "/about" },
  ];

  const navigate = useNavigate();
  return (
    <div className=" px-[15vw] flex items-center justify-between w-full h-[6vh] border border-b-2 border-gray-200  bg-white shadow-md">
      {/* Logo */}
      <div onClick={()=>navigate('/')} className="flex items-center space-x-2 cursor-pointer">
        <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
          <IoBookOutline
            size={30}
            className="text-white group-hover:rotate-12 transition-transform duration-300 ease-out"
          />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          BookVerse
        </h1>
      </div>
      
      <div>
        <ul className="flex items-center space-x-8 text-gray-500" id="links">
          {links.map((link, i) => (
            <li 
              onClick={() => navigate(link.url)} 
              key={i}
              className="relative py-2 cursor-pointer transition-colors duration-300 hover:text-purple-600 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 ease-out group-hover:w-full"></span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4 relative">
        {icons.map((Icon, index) => (
          <div
            onClick={() => Icon.onClick?.()}
            key={index}
            className="relative p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <Icon.component />
            {Icon.component === FaUser && profileClicked && (
              <ProfileDropdown
                isOpen={profileClicked}
                setIsOpen={setProfileClicked}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;