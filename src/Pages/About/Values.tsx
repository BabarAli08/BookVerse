import FeatureCard from "../../Component/FeatureCard";
import {
  Download,
  Phone,
  Cloud,
  User2,
  type LucideIcon,
  Headphones,
  BookAIcon,
} from "lucide-react";

interface offer {
  title: string;
  description: string;
  logo: LucideIcon;
}
const Offers = [
  {
    title: "Vast Library",
    description: "Access to over 50,000 books across all genres",
    logo: BookAIcon,
  },
  {
    title: "Offline Reading",
    description: "Download books and read anywhere, anytime",
    logo: Download,
  },
  {
    title: "Audiobooks",
    description: "Professional narrations for immersive listening",
    logo: Headphones,
  },
  {
    title: "Multi-Platform",
    description: "Read on any device with seamless sync",
    logo: Phone,
  },
  {
    title: "Cloud Sync",
    description: "Your library and progress synced across devices",
    logo: Cloud,
  },
  {
    title: "Community",
    description: "Connect with fellow readers and book clubs",
    logo: User2,
  },
];

const Values = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-2 justify-baseline w-full h-[83vh]">
        <div className="flex flex-col items-center text-center gap-5 justify-center w-[35vw] h-[18vh]">
          <h1 className="text-4xl font-bold">Why Choose BookVerse Premium?</h1>
          <p className="text-gray-600 text-xl">
            Unlock the full potential of your reading experience with our
            premium features
          </p>
        </div>
        <div className="grid w-[80%] h-[60vh] place-items-center  grid-cols-3">
          {Offers.map((offer: offer, i: number) => (
            <FeatureCard key={i} {...offer} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Values;
