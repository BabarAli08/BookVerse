import type { LucideIcon } from "lucide-react";
interface CardState {
  title:string
  description:string
  logo:LucideIcon
}
const FeatureCard = ({ title, description, logo:Logo }: CardState) => {
  return (
    <div className="flex flex-col p-5 rounded-xl items-center justify-around w-[27rem] bg-white border-gray-300 border shadow-md hover:shadow-xl h-[15rem]">
      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
        <Logo size={30} className="text-purple-600" /> {/* Use it like a component */}
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};


export default FeatureCard