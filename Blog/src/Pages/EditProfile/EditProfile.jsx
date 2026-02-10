import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authcontext";
import { apiRequest } from "../../services/api";
import {
  FaUser,
  FaLock,
  FaSave,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const EditProfile = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tabs: 'profile' or 'password'
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [profileData, setProfileData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Visibility State (Toggles)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await apiRequest.patch("/users/update", profileData);

      // Update local context/storage with new user data
      // Preserve existing properties like 'id' or 'token' if not returned
      const updatedUser = { ...currentUser, ...res.data.user };
      updateUser(updatedUser);

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      await apiRequest.patch("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
      <div className="container mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Profile
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-purple-100">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUser className="inline mr-2" /> Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "password"
                  ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaLock className="inline mr-2" /> Change Password
            </button>
          </div>

          <div className="p-8">
            {message.text && (
              <div
                className={`p-4 rounded-xl mb-6 text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {activeTab === "profile" ? (
              /* --- Profile Form --- */
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={profileData.avatar}
                    onChange={(e) =>
                      setProfileData({ ...profileData, avatar: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity flex justify-center items-center"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* --- Password Form --- */
              <form onSubmit={handlePasswordChange} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                      placeholder="Min 6 chars"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={passwordData.confirmNewPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmNewPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium shadow-lg hover:bg-gray-900 transition-colors flex justify-center items-center"
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      <FaLock className="mr-2" /> Update Password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
