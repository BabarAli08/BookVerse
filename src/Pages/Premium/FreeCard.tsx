
import { Check } from "lucide-react";
import { FcCancel } from "react-icons/fc";
import { useState } from "react";
import PurchaseButton from "../../Component/PurchaseButton";

interface Card {
  yes: string[];
  no: string[];
  title: string;
  price: string;
  onClick: () => void;
  color: "gray" | "purple" | "yellow" | "default";
  heading: string;
  priceTitle: string;
}

const getColorClasses = (color: string, selected: boolean) => {
  if (!selected) {
    return {
      border: "border-gray-300", 
      background: "bg-white",     
    };
  }

  switch (color) {
    case "purple":
      return {
        border: "border-[#9333ea]",
        background: "bg-purple-50",
      };
    case "yellow":
      return {
        border: "border-[#ca8a04]",
        background: "bg-yellow-50",
      };
    case "gray":
      return {
        border: "border-[#4b5563]",
        background: "bg-gray-50",
      };
    default:
      return {
        border: "border-black",
        background: "bg-gray-100",
      };
  }
};


const FreeCard = ({
  yes,
  no,
  title,
  price,
  onClick,
  color,
  heading,
  priceTitle,
}: Card) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected); 
    onClick();
  };

  const { border, background } = getColorClasses(color, selected);

  return (
    <div
      onClick={handleClick}
      className={`flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border ${background} ${border}  cursor-pointer transition duration-200`}
    >
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">{priceTitle}</h1>
        <p className="text-md text-gray-600">{heading}</p>
        <h2 className="text-4xl font-bold text-black">{price}</h2>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {yes.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Check className="text-green-400" />
            <h2>{item}</h2>
          </div>
        ))}
        {no.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <FcCancel />
            <h2 className="text-gray-500">{item}</h2>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <PurchaseButton title={title} color={color} onClick={onClick} />
      </div>
    </div>
  );
};

export default FreeCard;
