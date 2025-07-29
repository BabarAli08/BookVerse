const OurJourney = () => {
  const journeyData = [
    {
      year: "2020",
      title: "BookVerse Founded",
      description: "Started with a simple mission: make reading more accessible and enjoyable for everyone.",
      side: "left"
    },
    {
      year: "2021", 
      title: "10,000 Books",
      description: "Reached our first major milestone with 10,000 books in our digital library.",
      side: "right"
    },
    {
      year: "2022",
      title: "100,000 Users", 
      description: "Welcomed our 100,000th reader to the BookVerse community.",
      side: "left"
    },
    {
      year: "2023",
      title: "Premium Features",
      description: "Launched premium subscriptions with advanced reading features and audiobooks.",
      side: "right"
    }
  ];

  return (
    <div className=" mx-auto py-16 bg-gray-50 w-full px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h1>
        <p className="text-lg text-gray-600">From a simple idea to a global reading platform</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-purple-200 h-full"></div>

        {/* Timeline Items */}
        <div className="space-y-16">
          {journeyData.map((item, index) => (
            <div key={index} className="relative flex items-center">
              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>

              {item.side === "left" ? (
                <>
                  {/* Left Side Card */}
                  <div className="w-1/2 pr-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 ml-auto max-w-md hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {/* Empty Right Side */}
                  <div className="w-1/2 pl-8"></div>
                </>
              ) : (
                <>
                  {/* Empty Left Side */}
                  <div className="w-1/2 pr-8"></div>
                  {/* Right Side Card */}
                  <div className="w-1/2 pl-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 mr-auto max-w-md hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurJourney;