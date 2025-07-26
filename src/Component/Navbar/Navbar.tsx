import { IoSearch } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className=" px-[15vw] flex items-center justify-between w-full h-[6vh] border border-b-2 border-gray-200  bg-white shadow-md">
      {/* Logo */}
       <div className="flex items-center space-x-2 cursor-pointer">
      <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
        <IoBookOutline size={30} className="text-white group-hover:rotate-12 transition-transform duration-300 ease-out" />
      </div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
        BookVerse
      </h1>
    </div>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-8">
        {["Home", "Books", "Premium", "About"].map((item) => (
          <li
            key={item}
            className="relative hover:text-purple-600 text-gray-500 font-medium cursor-pointer group"
          >
            {item}
            <span className="absolute left-0 bottom-[-2px] w-0 h-[2px] bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        {[<IoSearch />, <LuShoppingCart />, <FaUser />].map((Icon, index) => (
          <div
            key={index}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            {Icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
