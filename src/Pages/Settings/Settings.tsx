import { useState } from "react";
import { Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Profile from "./Profile";
import Notifications from "./Notifications";
import Privacy from "./Privacy";
import ReadingPreferences from "./Reading";
import Billing from "./Billing";

const tabs = ["Profile", "Notifications", "Privacy", "Reading", "Billing"];

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <>
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </motion.div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="text-gray-700" size={28} />
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Manage your account preferences and settings
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex whitespace-nowrap relative">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex-1 py-2.5 px-4 text-sm font-medium transition-colors
                    ${
                      activeTab === tab
                        ? "text-purple-700 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-600 rounded"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === "Profile" && (
                  <Profile setLoading={() => setLoading} />
                )}
                {activeTab === "Notifications" && <Notifications />}
                {activeTab === "Privacy" && <Privacy />}
                {activeTab === "Reading" && <ReadingPreferences />}
                {activeTab === "Billing" && <Billing />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
