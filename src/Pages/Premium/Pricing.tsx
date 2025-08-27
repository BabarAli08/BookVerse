import { useDispatch, useSelector } from "react-redux";
import FreeCard from "./FreeCard";
import type { RootState } from "../../Store/store";
import { useNavigate } from "react-router";
import { setPlan } from "../../Store/PaymentSlice";

interface cardState {
  yes: string[];
  no: string[];
  title: string;
  name: string;
  price: string;
  yearly: boolean;
  onClick?: () => void;
  color: string;
  heading: string;
  priceTitle: string;
}

const Pricing = () => {
  const { prices, Yearly } = useSelector((state: RootState) => state.prices);
  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const handlePayment = (plan: cardState) => {
    console.log("plan Clicked");
    const originalPrice = parseFloat(plan.price.replace("$", ""));
    const taxed_price = originalPrice * 1.08;

    dispatch(setPlan({ ...plan, price: String(taxed_price) }));
    navigate("/checkout");
  };
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
      name: "free",
      yearly: Yearly,
      title: "Get Started Free",
      price: prices.free,
      color: "gray",
      heading: "Perfect for casual readers",
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
      name: "premium",
      title: "Go Premium",
      yearly: Yearly,
      price: prices.premium,
      color: "purple",
      heading: "For avid readers who want more",
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
      yearly: Yearly,
      name: "ultimate",
      title: "Choose Ultimate",
      price: prices.ultimate,
      color: "yellow",
      heading: "The complete reading experience",
      priceTitle: "Ultimate",
    },
  ];

  return (
    <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-4 p-4 w-full   overflow-x-auto">
      {cards.map((card, i: number) => (
        <FreeCard {...card} key={i} onClick={() => handlePayment(card)} />
      ))}
    </div>
  );
};

export default Pricing;
