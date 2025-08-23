import { useState } from "react";
import { CreditCard, Crown, Plus } from "lucide-react";

export default function Billing() {
  const [currentPlan] = useState({
    name: "Premium",
    price: "$9.99/month",
    nextBilling: "2/22/2024",
    status: "active"
  });

  const [paymentMethod] = useState({
    type: "visa",
    lastFour: "4242",
    expires: "12/25"
  });

  const [billingHistory] = useState([
    {
      id: 1,
      plan: "Premium Plan",
      date: "Jan 22, 2024",
      amount: "$9.99"
    },
    {
      id: 2,
      plan: "Premium Plan", 
      date: "Dec 22, 2023",
      amount: "$9.99"
    }
  ]);

  const handleChangePlan = () => {
    console.log("Opening plan selection...");
    // In a real app, this would open a plan selection modal
  };

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) {
      console.log("Canceling subscription...");
      // In a real app, this would handle subscription cancellation
    }
  };

  const handleUpdatePayment = () => {
    console.log("Opening payment method update...");
    // In a real app, this would open a payment method update form
  };

  const handleAddPayment = () => {
    console.log("Opening add payment method...");
    // In a real app, this would open a form to add a new payment method
  };

  const handleDownloadInvoice = (invoiceId: number) => {
    console.log(`Downloading invoice ${invoiceId}...`);
    // In a real app, this would trigger invoice download
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Billing</h2>
      </div>
      
      {/* Current Plan */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-gray-900">{currentPlan.name}</h4>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {currentPlan.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{currentPlan.price}</p>
            <p className="text-sm text-gray-500 mt-2">
              Next billing date: {currentPlan.nextBilling}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleChangePlan}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Change Plan
          </button>
          <button
            onClick={handleCancelSubscription}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">•••• •••• •••• {paymentMethod.lastFour}</p>
              <p className="text-sm text-gray-500">Expires {paymentMethod.expires}</p>
            </div>
          </div>
          <button
            onClick={handleUpdatePayment}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Update
          </button>
        </div>
        
        <button
          onClick={handleAddPayment}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          <Plus size={16} />
          Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        
        <div className="space-y-4">
          {billingHistory.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{invoice.plan}</p>
                <p className="text-sm text-gray-500">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">{invoice.amount}</span>
                <button
                  onClick={() => handleDownloadInvoice(invoice.id)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {billingHistory.length === 0 && (
          <div className="text-center py-8">
            <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No billing history available</p>
          </div>
        )}
      </div>

      {/* Billing Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCard className="text-blue-500 mt-0.5" size={16} />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              Billing Information
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Your subscription will automatically renew on the next billing date. You can change or cancel your plan at any time. Invoices are sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}