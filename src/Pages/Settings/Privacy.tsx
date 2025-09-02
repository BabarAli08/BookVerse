import { useEffect, useState } from "react";
import { Shield, ChevronDown, Download, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import {
  resetUserSettings,
  updatePrivacy,
} from "../../Store/UserSettingsSlice";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../supabase-client";
import { toast } from "sonner";

export default function Privacy() {
  const [privacySettings, setPrivacySettings] = useState({
    showReadingActivity: true,
    showLibrary: false,
    allowMessages: true,
  });
  const [profileVisibility, setProfileVisibility] = useState<string>("Public");
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const { reading, privacy } = useSelector(
    (state: RootState) => state.userSettings
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setProfileVisibility(privacy.profileVisibility);
    setPrivacySettings({
      showReadingActivity: privacy.showReadingActivity,
      showLibrary: privacy.showLibrary,
      allowMessages: privacy.allowMessages,
    });
  }, [privacy]);

  const handleToggle = (key: keyof typeof privacySettings) => {
    dispatch(
      updatePrivacy({
        ...privacy,
        [key]: !privacy[key],
      })
    );
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExportData = () => {
    console.log("Exporting user data...");
  };

  const handleDeleteAccount = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      toast.warning("could not delete account" + userError.message);
    }

    try {
      if (user) {
        
        const {  error: userDeleteError } =
          await await supabase.auth.admin.deleteUser(user.id);
        if (userDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting auth user: " +
              userDeleteError.message
          );
        }

        
        const {  error: subscriptionDeleteError } =
          await supabase.from("subscriptions").delete().eq("user_id", user.id);
        if (subscriptionDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from subscriptions: " +
              subscriptionDeleteError.message
          );
        }

       
        const {  error: profileDeleteError } =
          await supabase.from("profiles").delete().eq("id", user.id);
        if (profileDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from profiles: " +
              profileDeleteError.message
          );
        }

        const { error: notesDeleteError } = await supabase
          .from("annotations")
          .delete()
          .eq("user_id", user.id);
        if (notesDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from annotations: " +
              notesDeleteError.message
          );
        }

        const {
          
          error: completedBooksDeleteError,
        } = await supabase
          .from("completed_books")
          .delete()
          .eq("user_id", user.id);
        if (completedBooksDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from completed_books: " +
              completedBooksDeleteError.message
          );
        }

        const {
         
          error: currentlyReadingDeleteError,
        } = await supabase
          .from("currently_reading")
          .delete()
          .eq("user_id", user.id);
        if (currentlyReadingDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from currently_reading: " +
              currentlyReadingDeleteError.message
          );
        }

        const {
         
          error: dailyActivitiesDeleteError,
        } = await supabase
          .from("user_daily_activities")
          .delete()
          .eq("user_id", user.id);
        if (dailyActivitiesDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from user_daily_activities: " +
              dailyActivitiesDeleteError.message
          );
        }

        const {
         
          error: readingPreferencesDeleteError,
        } = await supabase
          .from("reading_preferances")
          .delete()
          .eq("user_id", user.id);
        if (readingPreferencesDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from reading_preferances: " +
              readingPreferencesDeleteError.message
          );
        }

        const {
        
          error: subscriptionHistoryDeleteError,
        } = await supabase
          .from("subscription_history")
          .delete()
          .eq("user_id", user.id);
        if (subscriptionHistoryDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from subscription_history: " +
              subscriptionHistoryDeleteError.message
          );
        }

        const {
        
          error: userPreferencesDeleteError,
        } = await supabase
          .from("user_preferences")
          .delete()
          .eq("user_id", user.id);
        if (userPreferencesDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from user_preferances: " +
              userPreferencesDeleteError.message
          );
        }

        const { error: streaksDeleteError } =
          await supabase.from("user_streaks").delete().eq("user_id", user.id);
        if (streaksDeleteError) {
          toast.warning(
            "[deleteAccount] Failed at deleting from user_streaks: " +
              streaksDeleteError.message
          );
        }

        dispatch(resetUserSettings());
      }
    } catch (err) {
      toast.warning("Could not delete account: " + (err as Error)?.message);
    }
  };

  const handleProfileVisibilityChange = (option: string) => {
    setProfileVisibility(option);
    dispatch(
      updatePrivacy({
        ...privacy,
        profileVisibility: option,
      })
    );
  };
  const visibilityOptions = ["Public", "Friends Only", "Private"];

  return (
    <div className="space-y-8">
      {showDeleteAccountModal && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Delete Account
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account?{" "}
                <span className="font-medium text-red-600">
                  This action cannot be undone.
                </span>
              </p>

              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                ⚠ You will also lose access to your current plan:{" "}
                <span className="font-semibold">
                  {reading.billing.currentPlan.name}
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteAccountModal(false);
                    handleDeleteAccount();
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Privacy & Security
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">
            Profile Visibility
          </h3>
          <div className="relative">
            <select
              value={profileVisibility}
              onChange={(e) => handleProfileVisibilityChange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {visibilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>

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
            onClick={() => handleToggle("showReadingActivity")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              privacySettings.showReadingActivity
                ? "bg-gray-900"
                : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={privacySettings.showReadingActivity}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.showReadingActivity
                  ? "translate-x-6"
                  : "translate-x-1"
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
            onClick={() => handleToggle("showLibrary")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              privacySettings.showLibrary ? "bg-gray-900" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={privacySettings.showLibrary}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.showLibrary ? "translate-x-6" : "translate-x-1"
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
            onClick={() => handleToggle("allowMessages")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              privacySettings.allowMessages ? "bg-gray-900" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={privacySettings.allowMessages}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.allowMessages
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Data Management
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            <Download size={16} />
            Export Data
          </button>

          <button
            onClick={() => setShowDeleteAccountModal(true)}
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
                Your privacy is important to us. Data exports include your
                reading history, notes, and profile information. Account
                deletion is permanent and cannot be reversed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
