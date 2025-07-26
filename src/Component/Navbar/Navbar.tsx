
import { IoSearch } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className=" px-[15vw] flex items-center justify-between w-full h-[8vh] bg-white shadow-md">
      
      {/* Logo */}
      <h1 className="text-xl font-bold text-gray-800">Logo</h1>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-6">
        {["Home", "Books", "Premium", "About"].map((item) => (
          <li
            key={item}
            className="relative text-gray-700 font-medium cursor-pointer group"
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
