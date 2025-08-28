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

const WhyChooseUs = () => {
  return (
    <div className="flex flex-col items-center mt-8 w-full h-auto px-4 sm:px-6 py-10">
      {/* Heading Section */}
      <div className="flex flex-col items-center text-center gap-3 sm:gap-4 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
          Why Choose BookVerse Premium?
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2">
          Unlock the full potential of your reading experience with our premium
          features
        </p>
      </div>

    
      <div
        className="grid w-full max-w-6xl mt-10 gap-6 
             grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 
             justify-items-center"
      >
        {Offers.map((offer: offer, i: number) => (
          <FeatureCard key={i} {...offer} />
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
