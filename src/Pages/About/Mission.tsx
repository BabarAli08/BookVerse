import { useNavigate } from "react-router";
import WhiteButton from "../../Component/WhiteButton";
import TransparentButton from "../../Component/TransparentButton";

const Mission = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-auto bg-gray-50 flex items-center justify-center py-10">
      <div className="flex flex-col md:flex-row w-[90%] md:w-[70%] items-center justify-center gap-10">
        <div className="flex flex-col w-full md:w-[45%] gap-4 text-center md:text-left items-center md:items-start">
          <h1 className="text-3xl md:text-4xl font-bold">Our Mission</h1>
          <p className="text-gray-600 text-base md:text-xl">
            At BookVerse, we believe that books have the power...
          </p>
          <p className="text-gray-600 text-base md:text-xl">
            We're not just a digital library – we're a platform...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <WhiteButton
              title="Start Reading"
              onClick={() => navigate("/books")}
              isBlack={true}
            />
            <TransparentButton
              title="Get Premium"
              isBlack={true}
              onClick={() => navigate("/premium")}
            />
          </div>
        </div>

        <div className="w-full md:w-[50%]">
          <img
            src="../../../assets/AboutImage.png"
            alt="About BookVerse"
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Mission;
