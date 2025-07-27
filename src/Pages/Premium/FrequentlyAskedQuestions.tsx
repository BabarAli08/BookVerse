import QuestionsCard from "../../Component/QuestionsCard";

const Questions=[
    {
        title:"Can I cancel my subscription anytime?",
        description:"Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period."
    },
      {
        title:"Do you offer a free trial?",
        description:"Yes! New users get a 14-day free trial of our Premium plan. No credit card required to start your trial."
    },
      {
        title:"Can I switch between plans?",
        description:"You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
   

]
const FrequentlyAskedQuestions = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col w-full h-[56vh]">
        <div className="w-[60%] h-[5rem] items-center text-center justify-center gap-5 ">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        </div>
        <div className="gird grid-rows-3 items-center   justify-center grid-cols-1">

        {Questions.map((ques,i:number)=>(
            <div key={i} className="mb-5">

                <QuestionsCard  {...ques}/>
            </div>
        
        ))}
            
        </div>
      </div>
    </>
  );
};

export default FrequentlyAskedQuestions;
