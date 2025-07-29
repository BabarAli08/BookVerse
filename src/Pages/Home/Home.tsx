
import { useNavigate } from "react-router";
import Bottom from "./Bottom";
import Featured from "./Featured";
import Hero from "./Hero";
import JoinSection from "./JoinSection";

const Home = () => {
  const navigate=useNavigate()
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Hero />
      <Bottom />
      <Featured />
      <div className="w-full h-40  flex items-center justify-center">
        <button onClick={()=>navigate('/books')} className=" px-5 py-2 rounded-md border  border-gray-500 bg-gray-50 hover:bg-gray-200">
          View All Books
        </button>
      </div>
      <JoinSection/>
   
    </div>
  );
};

export default Home;
