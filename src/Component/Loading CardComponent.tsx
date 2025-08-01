
// Loader 1: Shimmer Text Loading
export const LoaderCard1 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent animate-pulse">
          Loading Plan...
        </h1>
        <p className="text-md text-gray-400 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent animate-pulse">
          Please wait...
        </p>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent animate-pulse">
          $--.-
        </h2>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(4)].map((_, i) => (
          <div key={`feature-${i}`} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
            <h2 className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent animate-pulse">
              Loading feature...
            </h2>
          </div>
        ))}
        
        {[...Array(3)].map((_, i) => (
          <div key={`unavailable-${i}`} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
            <h2 className="text-gray-300 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-clip-text text-transparent animate-pulse">
              Loading feature...
            </h2>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-400 font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

// Loader 2: Skeleton Bars
export const LoaderCard2 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded-md w-40 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-md w-24 animate-pulse"></div>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="h-12 bg-gray-200 rounded-lg w-full max-w-xs animate-pulse"></div>
      </div>
    </div>
  );
};

// Loader 3: Pulse Wave Effect
export const LoaderCard3 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[23rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <div className="h-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-md w-32 animate-pulse"></div>
        <div className="h-5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-md w-40 animate-pulse"></div>
        <div className="h-12 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-md w-24 animate-pulse"></div>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 animate-pulse" style={{animationDelay: `${i * 100}ms`}}>
            <div className="w-5 h-5 bg-gradient-to-r from-green-100 via-green-200 to-green-100 rounded"></div>
            <div className="h-5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-48"></div>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="h-12 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 rounded-lg w-full max-w-xs animate-pulse"></div>
      </div>
    </div>
  );
};

// Loader 4: Dots Loading
export const LoaderCard4 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-400">Loading</h1>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <h2 className="text-4xl font-bold text-gray-300">$__.___</h2>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-gray-300">• • • • • • • • • • • •</h2>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

// Loader 5: Spinning Loader
export const LoaderCard5 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
        <h1 className="text-2xl font-bold text-gray-400">Loading...</h1>
        <p className="text-md text-gray-300">Fetching plan details</p>
        <h2 className="text-4xl font-bold text-gray-300">$--</h2>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 opacity-50">
            <div className="w-5 h-5 border-2 border-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-48 animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-gray-400 font-medium">Please wait</span>
        </div>
      </div>
    </div>
  );
};

// Loader 6: Blinking Effect
export const LoaderCard6 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-400 animate-pulse">Premium Plan</h1>
        <p className="text-md text-gray-400 animate-pulse">Loading details...</p>
        <h2 className="text-4xl font-bold text-gray-400 animate-pulse">$▒▒.▒▒</h2>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
            <h2 className="text-gray-400 animate-pulse">▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒</h2>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500 font-medium">▒▒▒▒▒▒▒▒▒</span>
        </div>
      </div>
    </div>
  );
};

// Loader 7: Gradient Wave
export const LoaderCard7 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <div className="text-2xl font-bold bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 bg-clip-text text-transparent animate-pulse">
          Loading Plan
        </div>
        <div className="text-md bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 bg-clip-text text-transparent animate-pulse">
          Please wait while we fetch your plan
        </div>
        <div className="text-4xl font-bold bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-clip-text text-transparent animate-pulse">
          $__.___
        </div>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2" style={{animationDelay: `${i * 150}ms`}}>
            <div className="w-5 h-5 bg-gradient-to-r from-green-200 to-green-400 rounded animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

// Loader 8: Typewriter Effect
export const LoaderCard8 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Loading Plan<span className="animate-ping">|</span></h1>
        <p className="text-md text-gray-500">Setting up your experience<span className="animate-pulse">...</span></p>
        <h2 className="text-4xl font-bold text-gray-600">$<span className="animate-bounce">_</span><span className="animate-bounce">_</span>.<span className="animate-bounce">_</span><span className="animate-bounce">_</span></h2>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-400 rounded animate-bounce" style={{animationDelay: `${i * 100}ms`}}></div>
            <h2 className="text-gray-500">Loading feature {i + 1}<span className="animate-ping text-gray-400">...</span></h2>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 font-medium">Get Started<span className="animate-ping">|</span></span>
        </div>
      </div>
    </div>
  );
};

// Loader 9: Morphing Shapes
export const LoaderCard9 = () => {
  return (
    <div className="flex items-start hover:shadow-md justify-baseline p-4 w-[27rem] rounded-xl h-[45rem] flex-col border bg-white border-gray-300 cursor-pointer transition duration-200">
      <div className="flex items-center w-full h-[30%] justify-center flex-col gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
        <h1 className="text-2xl font-bold text-gray-600">Initializing...</h1>
        <p className="text-md text-gray-500">Preparing your plan</p>
        <div className="flex items-center gap-1">
          <span className="text-4xl font-bold text-gray-600">$</span>
          <div className="flex gap-1">
            <div className="w-4 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="w-4 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <span className="text-4xl font-bold text-gray-600">.</span>
            <div className="w-4 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
            <div className="w-4 h-8 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </div>

      <div className="flex items-start pl-3.5 justify-center gap-4 flex-col">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-green-300 to-blue-300 rounded-full animate-pulse transform scale-75 hover:scale-100 transition-transform" style={{animationDelay: `${i * 200}ms`}}></div>
            <div className="flex gap-1">
              {[...Array(20)].map((_, j) => (
                <div key={j} className="w-2 h-5 bg-gray-200 rounded animate-pulse" style={{animationDelay: `${(i * 200) + (j * 50)}ms`}}></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <div className="w-full max-w-xs h-12 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 rounded-lg animate-pulse border-2 border-transparent bg-clip-padding"></div>
      </div>
    </div>
  );
};

