import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Mail,
  LogOut,
  PenLine,
  BookOpen,
  User,
  Calendar,
} from "lucide-react";
import { AuthContext } from "../../Context/Authcontext";
import { apiRequest } from "../../services/api";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=User&background=ec4899&color=fff&size=150";

const Profile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    }

    logout();
    navigate("/");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center py-20 px-4">
        <div className="text-center bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/50 max-w-md">
          <User className="mx-auto h-16 w-16 text-purple-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You must be signed in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 hover:from-rose-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 py-12 px-4 pt-24">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-rose-400 via-purple-400 to-pink-400 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex items-center space-x-6">
              <img
                src={currentUser.avatar || defaultAvatar}
                alt={currentUser.username}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {currentUser.username}
                </h1>
                <p className="text-white/90 text-lg flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {currentUser.email}
                </p>
                <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member since{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Account Details */}
            <div className="mb-8">
              {/* Flex container for Title and Edit Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  Account Details
                </h2>
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium text-sm shadow-sm"
                >
                  <PenLine className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl border border-purple-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Username
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentUser.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-pink-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Mail className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-t pt-6">
                Your Creative Space
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/create-post"
                  className="group p-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-rose-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                      <PenLine className="text-rose-600 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-700 text-lg mb-1">
                        Write New Story
                      </h4>
                      <p className="text-sm text-gray-600">
                        Pour your heart onto the page
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to={`/posts?authorId=${currentUser._id}`}
                  className="group p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-purple-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                      <BookOpen className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-700 text-lg mb-1">
                        My Stories
                      </h4>
                      <p className="text-sm text-gray-600">
                        View all your published work
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <LogOut className="mr-2 w-5 h-5" />
                Sign Out of HeartInk
              </button>
            </div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <p className="text-center text-gray-600 text-sm mt-8 italic">
          "Fill your paper with the breathings of your heart" - William
          Wordsworth
        </p>
      </div>
    </div>
  );
};

export default Profile;
