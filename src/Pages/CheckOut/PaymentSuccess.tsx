import  { useState, useEffect } from "react";
import {  useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  Mail, 
  CreditCard, 
  ArrowRight,
  Book,
  Sparkles,
  Star
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import supabase from "../../supabase-client";

const PaymentSuccess = () => {
  const navigate=useNavigate()
  const [animateCheck, setAnimateCheck] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

 
  const { plan } = useSelector((state:RootState)=>state.payment)

  useEffect(() => {
  
    setTimeout(() => setAnimateCheck(true), 300);
    setTimeout(() => setShowConfetti(true), 800);
  }, []);

  const getNextBillingDate = (isYearly:boolean) => {
    const today = new Date();
    const nextBilling = new Date(today);
    
    if (isYearly) {
      nextBilling.setFullYear(today.getFullYear() + 1);
    } else {
      nextBilling.setMonth(today.getMonth() + 1);
    }
    
    return nextBilling.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const email=async()=>{
    const {data:{user},error}=await supabase.auth.getUser()
    if(user){
      return user.email
    }
    else{
      alert("Please sign in to continue")
    }
    if(error){
      alert("error finding the user")
    }
  }
  const subscriptionData = {
    planName: (plan?.name || "Premium") + " Plan",
    billingCycle: plan?.yearly ? "Yearly" : "Monthly",
    amount: plan?.price || "9.99",
    nextBillingDate: getNextBillingDate(plan?.yearly || false), 
    email: email || "user@example.com",
    transactionId: "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase()
  };

  const features =plan?.yes

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-emerald-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-bounce"></div>
      </div>

 
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">

        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div 
              className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl transition-all duration-700 ${
                animateCheck ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Premium!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your payment was successful and your BookVerse Premium subscription is now active. 
            Get ready to explore unlimited literary adventures!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-green-600" />
                Subscription Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <label className="text-sm font-medium text-gray-600">Plan</label>
                    <p className="text-lg font-bold text-gray-900">{subscriptionData.planName}</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <label className="text-sm font-medium text-gray-600">Billing Cycle</label>
                    <p className="text-lg font-bold text-gray-900">{subscriptionData.billingCycle}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                    <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                    <p className="text-lg font-bold text-gray-900">${Number(subscriptionData.amount).toFixed(2)}</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Next Billing Date
                    </label>
                    <p className="text-lg font-bold text-gray-900">{subscriptionData.nextBillingDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                    <p className="text-sm font-mono text-gray-800">{subscriptionData.transactionId}</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Receipt
                  </button>
                </div>
              </div>
            </div>

         
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Your Premium Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features?.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-green-50 rounded-xl transition-all duration-300 hover:bg-green-100"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

       
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Check Your Email</h4>
                    <p className="text-sm text-gray-600">We've sent a confirmation email to {typeof subscriptionData.email === 'string' ? subscriptionData.email : 'your email address'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Reading</h4>
                    <p className="text-sm text-gray-600">Explore thousands of premium books and audiobooks</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Download App</h4>
                    <p className="text-sm text-gray-600">Get the mobile app for offline reading</p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button onClick={()=>navigate("/books")} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center group">
                    Start Exploring
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                    Manage Subscription
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Need help? Contact our{" "}
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                      premium support team
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to dive in?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Your premium journey starts now. Discover bestsellers, hidden gems, and exclusive content curated just for you.
            </p>
            <button onClick={()=>navigate("/books")} className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center">
              Browse Premium Library
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;