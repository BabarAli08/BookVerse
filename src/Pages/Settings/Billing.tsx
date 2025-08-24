import { useEffect, useState } from "react";
import { CreditCard, Crown, Plus, Loader2 } from "lucide-react";
import supabase from "../../supabase-client";
import { toast } from "sonner";

interface planState {
  id: string;
  user_id: string;
  plan_type: string;
  billing_cycle: string;
  status: string;
  card_number: string;
  card_holder_name: string;
  expiry_date: string;
  cvc: string;
  email: string;
  country: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  next_billing_date: string;
  state: string;
  postal_code: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export default function Billing() {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<number | null>(null);

  const [currentPlan, setCurrentPlan] = useState({
    name: "free",
    price: "$0.00/month",
    nextBilling: "lifetime",
    status: "active",
    isYearly:false
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: "visa",
    lastFour: "4242",
    expires: "12/25",
  });

  const [billingHistory, setBillingHistory] = useState<Array<{
    id: string;
    plan: string;
    date: string;
    amount: string;
  }>>([]);

  useEffect(() => {
    const getCurrentPlan = async () => {
      try {
        setIsLoading(true);
        
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          toast.error("Error getting user information");
          return;
        }

        if (user) {
          // Get current subscription
          const { data, error: currentPlanError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (currentPlanError && currentPlanError.code !== 'PGRST116') {
            toast.error("Error fetching current plan");
            console.error("Current plan error:", currentPlanError);
          }

          if (data) {
            setCurrentPlan({
              name: data.plan_type,
              price: `$${data.amount}`,
              nextBilling: new Date(data.next_billing_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              status: data.status,
              isYearly: data.billing_cycle === "yearly",
            });

            setPaymentMethod({
              type: "visa",
              lastFour: data.card_number.slice(-4),
              expires: data.expiry_date, // Fixed typo
            });
          }

          // Get billing history
          const { data: previousPlans, error: previousPlansError } =
            await supabase
              .from("subscription_history")
              .select("*")
              .eq("user_id", user.id)
              .order('created_at', { ascending: false });

          if (previousPlansError) {
            toast.error("Error fetching previous plans");
            console.error("Previous plans error:", previousPlansError);
          }

          if (previousPlans && previousPlans.length > 0) {
            setBillingHistory(
              (previousPlans as planState[]).map((plan: planState) => ({
                id: plan.id, // Keep as string, don't parse as int
                plan: plan.plan_type,
                date: new Date(plan.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                amount: `$${plan.amount}`,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentPlan(); 
  }, []);



  
  

  
  

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Billing</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-gray-900">
                {currentPlan.name}
              </h4>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {currentPlan.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{currentPlan.price.slice(0,7)}/{currentPlan.isYearly ? 'Yearly' : "Monthly"}</p>
            <p className="text-sm text-gray-500 mt-2">
              Next billing date: {currentPlan.nextBilling}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
          
            disabled={isUpdatingPlan}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUpdatingPlan ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Plan"
            )}
          </button>
          <button
       
            disabled={isCanceling}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isCanceling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-gray-700" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">VISA</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                •••• •••• •••• {paymentMethod.lastFour}
              </p>
              <p className="text-sm text-gray-500">
                Expires {paymentMethod.expires}
              </p>
            </div>
          </div>
          <button
       
            disabled={isUpdatingPayment}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isUpdatingPayment ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>

        <button
         
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          <Plus size={16} />
          Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Billing History
        </h3>

        <div className="space-y-4">
          {billingHistory.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{invoice.plan}</p>
                <p className="text-sm text-gray-500">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">
                  {invoice.amount}
                </span>
                <button
                
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

    
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <CreditCard className="text-blue-500 mt-0.5" size={16} />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">
              Billing Information
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Your subscription will automatically renew on the next billing
              date. You can change or cancel your plan at any time. Invoices are
              sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}