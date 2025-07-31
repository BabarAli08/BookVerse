import { useSelector } from "react-redux";
import FreeCard from "./FreeCard";
import type { RootState } from "../../Store/store";


interface cardState{
  yes:string[],
  no:string[],
  title:string,
  price:string,
  onClick:()=>void,
  color:string,
  heading:string,
  priceTitle:string
}
const Pricing = () => {
  const {prices}=useSelector((state:RootState)=>state.prices)
  const cards = [
  {
    yes: [
      "Access to 1,000+ free books",
      "Basic reading features",
      "Mobile app access",
      "Community discussions",
    ],
    no: [
      "Limited book selection",
      "Ads between chapters",
      "No offline downloads",
      "No premium features",
    ],
    title: "Get Started Free",
    price: prices.free,
    color: "gray",
    heading: "Perfect for casual readers",
    onClick: () => console.log("Free Card Clicked"),
    priceTitle: "Free",
  },
  {
    yes: [
      "Access to 50,000+ books",
      "Ad-free reading experience",
      "Unlimited offline downloads",
      "Premium reading features",
      "Audiobook access (5 per month)",
      "Priority customer support",
      "Reading analytics & insights",
      "Text highlighting & notes",
    ],
    no: [],
    title: "Go Premium",
    price: prices.premium,
    color: "purple",
    heading: "For avid readers who want more",
    onClick: () => console.log("Premium Card Clicked"),
    priceTitle: "Premium",
  },
  {
    yes: [
      "Everything in Premium",
      "Unlimited audiobook access",
      "Early access to new releases",
      "Exclusive author content",
      "Advanced AI recommendations",
      "Multi-device sync",
      "Family sharing (up to 6 members)",
      "Personal reading coach",
      "Advanced highlighting & annotations",
      "Export notes & highlights",
    ],
    no: [],
    title: "Choose Ultimate",
    price: prices.ultimate,
    color: "yellow",
    heading: "The complete reading experience",
    onClick: () => console.log("Ultimate Clicked"),
    priceTitle: "Ultimate",
  }
];

  return (
    <div className="flex items-center gap-4 justify-center p-4 w-full h-[50%]">
      {cards.map((card:cardState,i:number)=>(
          <FreeCard {...card} key={i} />
      ))}
    </div>
  );
};

export default Pricing;
