import { useState } from "react";

function Settings() {
  const [settings, setSettings] = useState({
    siteName: "QuizMaster Pro",
    siteDescription: "Test your knowledge with interactive quizzes",
    contactEmail: "admin@quizmaster.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
  });

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your platform configuration and system preferences
        </p>
      </div>

      {/* GENERAL SETTINGS */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4">

        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          General Settings
        </h3>

        <div className="space-y-4">

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Site Description
            </label>
            <textarea
              rows="3"
              value={settings.siteDescription}
              onChange={(e) =>
                handleChange("siteDescription", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

        </div>
      </div>

      {/* SYSTEM SETTINGS */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4">

        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          System Settings
        </h3>

        <div className="space-y-3">

          {/* TOGGLE ITEM */}
          {[
            {
              key: "maintenanceMode",
              label: "Maintenance Mode",
              desc: "Disable access for normal users",
            },
            {
              key: "registrationEnabled",
              label: "Allow New Registrations",
              desc: "Users can sign up freely",
            },
            {
              key: "emailVerification",
              label: "Email Verification",
              desc: "Require email verification for new users",
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-start justify-between gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-500">
                  {item.desc}
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) =>
                  handleChange(item.key, e.target.checked)
                }
                className="w-4 h-4 mt-1"
              />
            </label>
          ))}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}

export default Settings;