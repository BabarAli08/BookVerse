import { LuSparkles } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
const Bottom = () => {
  return (
    <div className="w-full bg-white py-16 px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-6xl mx-auto text-center">
        {[
          
          { icon: <IoBookOutline size={40} />, value: "50,000+", label: "Books Available" },
          {
            icon: <FiUsers  size={40}/>,
            value: "100,000+",
            label: "Active Readers",
          },
          { icon: <FiDownload size={40}/>, value: "1M+", label: "Downloads" },
          { icon: <LuSparkles size={40}/>, value: "Unlimited", label: "Premium Features" },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-tr from-purple-100 via-white to-purple-50 drop-shadow-md hover:shadow-2xl  transition-transform duration-500"
          >
            <div className=" bg-gray-300 text-pink-500 p-5 rounded-full text-6xl mb-4">{stat.icon}</div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-1">
              {stat.value}
            </h3>
            <p className="text-lg text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bottom;
