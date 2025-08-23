import { useState } from "react";
import { Shield, ChevronDown, Download, Trash2 } from "lucide-react";

export default function Privacy() {
  const [privacySettings, setPrivacySettings] = useState({
    showReadingActivity: true,
    showLibrary: false,
    allowMessages: true,
  });

  const [profileVisibility, setProfileVisibility] = useState<string>("Public");

  const handleToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExportData = () => {
    // Simulate data export
    console.log("Exporting user data...");
    // In a real app, this would trigger a data export process
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion confirmation
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested...");
      // In a real app, this would show a more sophisticated confirmation flow
    }
  };

  const visibilityOptions = ["Public", "Friends Only", "Private"];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Privacy & Security</h2>
      </div>
      
      {/* Profile Visibility */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Profile Visibility</h3>
          <div className="relative">
            <select
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {visibilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Show Reading Activity
            </h3>
            <p className="text-sm text-gray-500">
              Let others see what you're currently reading
            </p>
          </div>
          
          <button
            onClick={() => handleToggle('showReadingActivity')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              privacySettings.showReadingActivity 
                ? 'bg-purple-600' 
                : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={privacySettings.showReadingActivity}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.showReadingActivity ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Show Library
            </h3>
            <p className="text-sm text-gray-500">
              Make your book collection visible to others
            </p>
          </div>
          
          <button
            onClick={() => handleToggle('showLibrary')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              privacySettings.showLibrary 
                ? 'bg-purple-600' 
                : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={privacySettings.showLibrary}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.showLibrary ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Allow Messages
            </h3>
            <p className="text-sm text-gray-500">
              Let other users send you messages
            </p>
          </div>
          
          <button
            onClick={() => handleToggle('allowMessages')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              privacySettings.allowMessages 
                ? 'bg-purple-600' 
                : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={privacySettings.allowMessages}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.allowMessages ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            <Download size={16} />
            Export Data
          </button>
          
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
        
        <div className="mt-4 bg-amber-50 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="text-amber-500 mt-0.5" size={16} />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-amber-900">
                Data Privacy Notice
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Your privacy is important to us. Data exports include your reading history, notes, and profile information. Account deletion is permanent and cannot be reversed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}