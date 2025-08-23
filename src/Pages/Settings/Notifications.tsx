import { useState } from "react";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: true,
    weeklyDigest: false,
    bookRecommendations: true,
    socialActivity: true,
  });

  const handleToggle = (key: string) => {
    setNotifications(prev => ({ 
      ...prev, 
      [key as keyof typeof prev]: !prev[key as keyof typeof prev]
    }));
  };

  const notificationSettings = [
    {
      key: 'emailUpdates',
      title: 'Email Updates',
      description: 'Receive updates about new features and books',
      enabled: notifications.emailUpdates
    },
    {
      key: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Get notified about reading reminders and updates',
      enabled: notifications.pushNotifications
    },
    {
      key: 'weeklyDigest',
      title: 'Weekly Digest',
      description: 'Weekly summary of your reading activity',
      enabled: notifications.weeklyDigest
    },
    {
      key: 'bookRecommendations',
      title: 'Book Recommendations',
      description: 'Personalized book suggestions based on your reading',
      enabled: notifications.bookRecommendations
    },
    {
      key: 'socialActivity',
      title: 'Social Activity',
      description: 'Updates from friends and book clubs',
      enabled: notifications.socialActivity
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-gray-700" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
      </div>
      
      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {setting.title}
              </h3>
              <p className="text-sm text-gray-500">
                {setting.description}
              </p>
            </div>
            
            <button
              onClick={() => handleToggle(setting.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                setting.enabled 
                  ? 'bg-gray-900' 
                  : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={setting.enabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <Bell className="text-blue-500 mt-0.5" size={16} />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                Notification Tips
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                You can always change these preferences later. Email notifications can be managed from your inbox as well.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}