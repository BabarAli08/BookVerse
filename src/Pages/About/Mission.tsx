import { useNavigate } from "react-router";
import WhiteButton from "../../Component/WhiteButton";
import TransparentButton from "../../Component/TransparentButton";

const Mission = () => {
    const navigate=useNavigate()
  return (
    <div className="w-full h-[80vh] bg-gray-50 flex items-center justify-center">
    <div className="flex w-[70%] items-center justify-center gap-5 ">
      <div className="flex items-baseline w-[45%] h-[100%] justify-center flex-col gap-4">
        <h1 className="text-4xl font-bold">Our Mission</h1>
      
        <p className="text-gray-600 text-xl">At BookVerse, we believe that books have the power to transform lives, spark imagination, and connect people across cultures and continents. Our mission is to break down the barriers that prevent people from accessing great literature and create a global community of passionate readers.</p>
        <p className="text-gray-600 text-xl">We're not just a digital library – we're a platform that celebrates the joy of reading, fosters meaningful connections between readers, and uses technology to enhance rather than replace the fundamental human experience of getting lost in a great book.</p>
        <div className="flex items-center gap-4 mb-5">

            <WhiteButton title="Start Reading" onClick={()=>navigate('/books') } isBlack={true}/>
            <TransparentButton title="Get Premium" onClick={()=>navigate('/premium')}/>
        </div>
      </div>
      <div className="w-[50%] overflow-hidden">
        <img src="../../../assets/AboutImage.png" alt="" />
      </div>
    </div>
    </div>
  );
};

export default Mission;
