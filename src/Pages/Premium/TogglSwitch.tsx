import { useDispatch, useSelector } from "react-redux";
import { toggleYearly } from "../../Store/PricesSlices";
import type { RootState } from "../../Store/store";

const ToggleSwitch = () => {
   const isYearly = useSelector((state: RootState) => state.prices.Yearly);

  const dispatch=useDispatch()
  const handleToggle = () => {
    
    dispatch(toggleYearly(!isYearly));
  };

  return (
    <div className="flex w-full  items-center justify-center p-8">
      <div className="flex bg-gray-50 rounded-full justify-center px-4 h-[7vh] shadow-md items-center gap-4">
        
        <span 
          className={`text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
            !isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}
          onClick={handleToggle}
        >
          Monthly
        </span>

        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isYearly ? 'bg-gray-800' : 'bg-gray-300'
          }`}
        >
          
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
              isYearly ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        
        <span 
          className={`text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
            isYearly ? 'text-gray-900' : 'text-gray-500'
          }`}
          onClick={handleToggle}
        >
          Yearly
        </span>
        
        {/* Save 20% Badge */}
        <div className={`ml-2 px-2 py-1 rounded-lg transition-all duration-200 ${
          isYearly ? 'bg-green-100 opacity-100' : 'opacity-0'
        }`}>
          <p className="text-xs font-medium text-green-700 whitespace-nowrap">
            Save 20%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;