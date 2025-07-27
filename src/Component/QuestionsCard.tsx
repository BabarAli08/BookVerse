
interface Card{
    title:string,
    description:string
}
const QuestionsCard = ({title,description}:Card) => {
  return (
    <div className="flex items-baseline flex-col justify-baseline p-5 w-[80vh] h-[13vh] rounded-xl bg-gray-50 border-gray-300 border-1 shadow-md hover:shadow-xl transition-all duration-200">
        <div className="flex items-baseline justify-center gap-2 w-[100%] h-[100%] flex-col text-balance ">
        <h1 className="text-[18px] font-bold">{title}</h1>
            <p className="text-gray-700 font-medium">{description}</p>
        </div>
                
    </div>
  )
}

export default QuestionsCard