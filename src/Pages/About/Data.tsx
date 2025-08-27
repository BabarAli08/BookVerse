interface dataState {
  number: string;
  description: string;
}

const Data = () => {
  const data = [
    { number: "50000+", description: "Books Available" },
    { number: "100,000+", description: "Active Readers" },
    { number: "1M+", description: "Books Read" },
    { number: "150+", description: "Countries Served" },
  ];

  return (
    <div className="w-full py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:px-[15%] place-items-center">
      {data.map((item: dataState, i: number) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center text-center gap-2"
        >
          <h1 className="text-4xl md:text-5xl text-purple-600 font-bold">
            {item.number}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Data;
