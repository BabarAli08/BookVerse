interface dataState{
    number:string,
    description:string
}
const Data = () => {
    const data=[
        {number:"50000+",description:"Books Availible"},
        {number:"100,000+",description:"Active Readers"},
        {number:"1M+",description:"Books Read"},
        {number:"150+",description:"Countries Served"}
    ]
  return (
    <>
    <div className="w-full h-[20vh] flex items-center justify-center gap-[10%]">
        {data.map((item:dataState,i:number)=>(
        <div key={i} className="flex w-[10rem] h-[10rem] items-center gap-2 text-center justify-center flex-col ">
                <h1 className="text-4xl text-purple-600 font-bold">{item.number}</h1>
                <p className="text-gray-600">{item.description}</p>
        </div> 
        ))}
    </div>
    
    </>
  )
}

export default Data