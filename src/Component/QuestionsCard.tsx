interface Card {
  title: string;
  description: string;
}

const QuestionsCard = ({ title, description }: Card) => {
  return (
    <div className="flex flex-col p-5 w-full max-w-[600px] min-h-[120px] rounded-xl bg-gray-50 border border-gray-300 shadow-md hover:shadow-xl transition-all duration-200">
      <div className="flex flex-col gap-2 w-full h-full">
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
        <p className="text-gray-700 text-sm md:text-base font-medium">
          {description}
        </p>
      </div>
    </div>
  );
};

export default QuestionsCard;
