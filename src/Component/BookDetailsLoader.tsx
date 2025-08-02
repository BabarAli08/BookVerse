
const BookDetailsLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          
          {/* Left Panel - Book Cover & Actions */}
          <div className="w-[400px] space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Book Cover Section */}
              <div className="relative p-6 bg-gray-100">
                <div className="relative aspect-[3/4] w-[280px] mx-auto bg-gray-300 rounded-lg animate-pulse">
                  <div className="w-full h-full bg-gray-300 rounded-lg"></div>
                  
                  {/* Free Badge Skeleton */}
                  <div className="absolute top-3 left-3 bg-gray-400 px-3 py-1 rounded-md animate-pulse">
                    <div className="w-8 h-4 bg-gray-500 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-8 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-3">
                <div className="w-full h-12 bg-blue-300 rounded-xl animate-pulse"></div>
                <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse border border-gray-200"></div>
                <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse border border-gray-200"></div>
                <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse border border-gray-200"></div>
              </div>

              {/* Reading Progress */}
              <div className="px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full w-1/12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Book Details */}
          <div className="flex-1 space-y-6">
            
            {/* Book Title & Author */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="w-3/4 h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-1/2 h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="w-1/3 h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="space-y-2 max-w-3xl">
                <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Book Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="w-32 h-6 bg-gray-300 rounded animate-pulse mb-4"></div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-12 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Formats */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                <div className="flex gap-2">
                  <div className="w-16 h-7 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="w-16 h-7 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <div className="px-6 py-4 border-b-2 border-blue-600">
                  <div className="w-16 h-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="px-6 py-4">
                  <div className="w-16 h-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="px-6 py-4">
                  <div className="w-14 h-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="px-6 py-4">
                  <div className="w-20 h-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="w-28 h-6 bg-gray-300 rounded animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsLoader;