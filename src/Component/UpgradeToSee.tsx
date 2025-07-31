
import type { RootState } from '@reduxjs/toolkit/query';
import { X, Crown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setClicked, setClickedFalse } from '../Data/PremiumBookClickedSlice';

<s></s>

const UpgradeToSee = () => {
    const dispatch=useDispatch()
    const {book}=useSelector((state:RootState)=>state.PremiumBookCLick)

    const mainBook=book[0]
    const cover =mainBook.formats?.['image/jpeg']|| mainBook.formats?.['image/png']|| mainBook.formats?.['image/jpg']
    console.log("imagecover",cover)
    const navigate=useNavigate()
    console.log("Clicked BOoks",book)
    return (
       
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
               
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X onClick={()=>dispatch(setClickedFalse())} size={20} />
                </button>
                
            
                <div className="flex items-center gap-2 mb-6">
                    <Crown className="text-yellow-500" size={20} />
                    <h2 className="text-lg font-semibold text-gray-900">Upgrade Required</h2>
                </div>
                
                
                <div className="w-32 h-40 bg-gray-200 rounded-lg mx-auto mb-6 flex items-center justify-center overflow-hidden">
                    {cover ? (
                        <img src={cover} alt={mainBook.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <div className="w-16 h-20 bg-gray-300 rounded"></div>
                    )}
                </div>
                
               
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{mainBook.title}</h3>
                    <p className="text-gray-600 mb-3">by {mainBook.author}</p>
                    <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                        Premium
                    </span>
                </div>
                
               
                <p className="text-center text-gray-700 mb-4">
                    This book requires a premium subscription to read.
                </p>
                
                <p className="text-center text-gray-600 text-sm mb-6">
                    Upgrade your plan to access this book and thousands more!
                </p>
                
                
                <div className="flex gap-3">
                    <button onClick={()=>navigate('/premium')} className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        <Crown size={16} />
                        Upgrade Plan
                    </button>
                    <button onClick={()=>dispatch(setClickedFalse())}  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Maybe Later
                    </button>
                </div>
            </div>
        
    );
};

export default UpgradeToSee;