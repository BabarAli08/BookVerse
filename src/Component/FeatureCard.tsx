import type { LucideIcon } from "lucide-react";

interface CardState {
  title: string;
  description: string;
  logo: LucideIcon;
}

const FeatureCard = ({ title, description, logo: Logo }: CardState) => {
  return (
    <div className="flex flex-col p-5 rounded-xl items-center justify-around bg-white border border-gray-300 shadow-md hover:shadow-xl w-full max-w-sm h-auto">
      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
        <Logo size={30} className="text-purple-600" /> 
      </div>
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <p className="text-gray-500 text-center">{description}</p>
    </div>
  );
};

export default FeatureCard;
