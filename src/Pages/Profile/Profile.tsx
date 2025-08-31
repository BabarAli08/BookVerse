import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../../supabase-client";
import {
  BookOpen,
  Clock,
  Flame,
  Edit,
  Calendar,
  Star,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
 
  const [booksRead, setBooksRead] = useState<number>(0);
  const [booksCurrentlyReading, setBooksCurrentlyReading] = useState<number>(0);
  const [streaks, setStreaks] = useState<number>(0);

  const {profile}=useSelector((state:RootState)=>state.userSettings)
  const {streaks:supabaseStreaks,completedBooks:supabaseBooksRead,currentlyReading:supabaseBooksCurrentlyReading}=useSelector((state:RootState)=>state.userSettings)
  
  useEffect(()=>{
    setUser(profile)
    setStreaks(supabaseStreaks.streaks)
    setBooksRead(supabaseBooksRead.length)
    setBooksCurrentlyReading(supabaseBooksCurrentlyReading.length)

    
  },[])
  const navigate = useNavigate();
 
  const handleEditProfile = () => {
    navigate("settings");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      navigate("/login");
    }
  };

 

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-700"></div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative">
                  <img
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className=" md:mt-20 sm:mb-4">
                  <h1 className="text-2xl  font-bold text-slate-900 mb-1">
                    {user?.name || "Anonymous User"}
                  </h1>
                  <p className="text-slate-600 mb-2">{user?.email}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={14} />
                    <span>
                      Joined{" "}
                      {new Date(user?.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ">
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {booksRead}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Books Read
                </div>
              </div>
              <div className="text-center border-l border-r border-slate-100">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {booksCurrentlyReading}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Reading Now
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{streaks}</div>
                <div className="text-sm text-slate-600 font-medium">
                  Day Streak
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {booksRead}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Completed
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">This year</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">156</div>
                <div className="text-xs text-slate-600 font-medium">Hours</div>
              </div>
            </div>
            <p className="text-xs text-slate-500">Reading time</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Flame className="text-orange-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{streaks}</div>
                <div className="text-xs text-slate-600 font-medium">Days</div>
              </div>
            </div>
            <p className="text-xs text-slate-500">Current streak</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Star className="text-emerald-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {booksCurrentlyReading}
                </div>
                <div className="text-xs text-slate-600 font-medium">Active</div>
              </div>
            </div>
            <p className="text-xs text-slate-500">In progress</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-slate-600" size={16} />
            </div>
            Reading Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-slate-900 mb-1">
                2.5 hrs
              </div>
              <div className="text-sm text-slate-600">Daily average</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-slate-900 mb-1">
                Fiction
              </div>
              <div className="text-sm text-slate-600">Top genre</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-slate-900 mb-1">4.2 ★</div>
              <div className="text-sm text-slate-600">Avg rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/library")}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="text-blue-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    My Library
                  </h3>
                  <p className="text-sm text-slate-600">
                    Track reading progress
                  </p>
                </div>
              </div>
              <ChevronRight
                className="text-slate-400 group-hover:text-slate-600 transition-colors"
                size={20}
              />
            </div>
          </button>

          <button
            onClick={() => navigate("/books")}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Star className="text-emerald-600" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Discover Books
                  </h3>
                  <p className="text-sm text-slate-600">Find your next read</p>
                </div>
              </div>
              <ChevronRight
                className="text-slate-400 group-hover:text-slate-600 transition-colors"
                size={20}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
