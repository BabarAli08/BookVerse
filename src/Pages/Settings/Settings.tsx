import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import supabase from "../../supabase-client";

const tabs = ["Profile", "Notifications", "Privacy", "Reading", "Billing"];

export default function Settings() {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    email: "",
    location: "",
    website: "",
    bio: "",
  });
  const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return alert(error.message);
      setUser((prev) => ({
        ...prev,
        name: data.user.user_metadata?.name || "",
        email: data.user.email || "",
        website: data.user.user_metadata?.website || "",
        location: data.user.user_metadata?.location || "",
        bio: data.user.user_metadata?.bio || ""

      }));
      console.log("user is ", user);
    };
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Settings2 className="text-gray-700" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Tabs */}
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

        {/* Content Box */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          {activeTab === "Profile" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Profile Information
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                  JD
                </div>
                <div className="flex flex-col">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                    Change Avatar
                  </button>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB
                  </span>
                </div>
              </div>

              {/* Form */}
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    defaultValue="San Francisco, CA"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    defaultValue="https://johndoe.com"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Bio
                  </label>
                  <textarea
                    defaultValue="Avid reader and technology enthusiast"
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </form>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                  Save Changes
                </button>
                <button className="px-5 py-2 border border-gray-200 rounded-md hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab !== "Profile" && (
            <p className="text-gray-600">
              Settings for {activeTab} will go here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
