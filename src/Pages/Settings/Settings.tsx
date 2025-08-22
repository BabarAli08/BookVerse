import { useState } from "react";
import { Settings2 } from "lucide-react";

import Profile from "./Profile";

const tabs = ["Profile", "Notifications", "Privacy", "Reading", "Billing"];

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <>
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
        <div className="w-full max-w-6xl">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Settings2 className="text-gray-700" size={28} />
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="flex rounded-lg overflow-hidden shadow-sm bg-white">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors 
                ${
                  activeTab === tab
                    ? "bg-white border-b-2 border-purple-600 text-gray-900"
                    : "bg-gray-50 text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            {activeTab === "Profile" && (
              <Profile setLoading={() => setLoading} />
            )}

            {activeTab !== "Profile" && (
              <p className="text-gray-600">
                Settings for {activeTab} will go here.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
