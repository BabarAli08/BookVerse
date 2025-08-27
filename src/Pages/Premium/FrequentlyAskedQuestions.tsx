import QuestionsCard from "../../Component/QuestionsCard";

const Questions = [
  {
    title: "Can I cancel my subscription anytime?",
    description:
      "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.",
  },
  {
    title: "Do you offer a free trial?",
    description:
      "Yes! New users get a 14-day free trial of our Premium plan. No credit card required to start your trial.",
  },
  {
    title: "Can I switch between plans?",
    description:
      "You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
];

const FrequentlyAskedQuestions = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col w-full px-4 py-12">
        {/* Heading */}
        <div className="max-w-2xl text-center mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {Questions.map((ques, i: number) => (
            <div key={i} className="w-full">
              <QuestionsCard {...ques} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FrequentlyAskedQuestions;
