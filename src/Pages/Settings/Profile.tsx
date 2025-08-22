import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { toast } from "sonner";
import { Check, Loader2, Save } from "lucide-react";

interface profileState{
    setLoading:(loading:boolean)=>void
}
const Profile = ({setLoading}:profileState) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    website: "",
    bio: "",
  });
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); 

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          alert("Auth error:" + authError.message);
          return;
        }

        if (!authUser) {
          console.log(" No authenticated user found");
          return;
        }

        console.log(" Auth user found:", {
          id: authUser.id,
          email: authUser.email,
          user_metadata: authUser.user_metadata,
        });

        setUserId(authUser.id);

        console.log(" Fetching profile from database...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          console.error(" Profile fetch error:", {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
          });

          if (profileError.code === "PGRST116") {
            const newProfile = {
              id: authUser.id,
              name: authUser.user_metadata?.name || "",
              email: authUser.email || "",
              website: authUser.user_metadata?.website || "",
              location: authUser.user_metadata?.location || "",
              bio: authUser.user_metadata?.bio || "",
              created_at: new Date().toISOString(),
            };

            const { data: createData, error: createError } = await supabase
              .from("profiles")
              .insert([newProfile])
              .select()
              .single();

            if (createError) {
              alert("Could not create profile: " + createError.message);

              setUser({
                name: authUser.user_metadata?.name || "",
                email: authUser.email || "",
                website: authUser.user_metadata?.website || "",
                location: authUser.user_metadata?.location || "",
                bio: authUser.user_metadata?.bio || "",
              });
            } else {
              setUser({
                name: createData.name || "",
                email: createData.email || authUser.email || "",
                website: createData.website || "",
                location: createData.location || "",
                bio: createData.bio || "",
              });
            }
          } else {
            alert("Profile fetch error: " + profileError?.message);

            setUser({
              name: authUser.user_metadata?.name || "",
              email: authUser.email || "",
              website: authUser.user_metadata?.website || "",
              location: authUser.user_metadata?.location || "",
              bio: authUser.user_metadata?.bio || "",
            });
          }
        } else {
          setUser({
            name: profile.name || "",
            email: profile.email || authUser.email || "",
            website: profile.website || "",
            location: profile.location || "",
            bio: profile.bio || "",
          });
        }
      } catch (err) {
        console.error(" Unexpected error:", err);
        alert("Unexpected error fetching user:" + err);
      } finally {
        setLoading(false);
      } // Pass false to setLoading
    };

    fetchUser();
  }, []);

  const updateProfile = async () => {
    try {
      setUpdating(true);
      setSaveSuccess(false);

      if (!userId) {
        alert("User ID not found");
        return;
      }

      const { error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (checkError && checkError.code === "PGRST116") {
        console.log("📝 Profile doesn't exist, creating it first...");

        const { data: createData, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: userId,
              name: user.name,
              email: user.email,
              location: user.location,
              website: user.website,
              bio: user.bio,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error("❌ Profile creation error:", createError);
          alert("Error creating profile: " + createError.message);
          return;
        }

        console.log("✅ Profile created during update:", createData);
        toast.success("Profile created successfully!");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: user.name,
          email: user.email,
          location: user.location,
          website: user.website,
          bio: user.bio,
        })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("❌ Update error:", error);
        alert("There was an error updating the profile: " + error.message);
      } else {
        console.log("✅ Profile updated successfully:", data);
        toast.success("Profile updated successfully!");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error("💥 Unexpected update error:", err);
      alert("Unexpected error updating profile: " + (err as Error)?.message);
    } finally {
      setUpdating(false);
    }
  };

  return  <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Profile Information
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <button 
                    disabled={updating}
                    className={`px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-700 transition-colors ${
                      updating 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Change Avatar
                  </button>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB
                  </span>
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter your full name"
                    disabled={updating}
                    className={`w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      updating ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Enter your email"
                    disabled={updating}
                    className={`w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      updating ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={user.location}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Enter your location"
                    disabled={updating}
                    className={`w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      updating ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={user.website}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, website: e.target.value }))
                    }
                    placeholder="Enter your website"
                    disabled={updating}
                    className={`w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      updating ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={user.bio}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Tell us about yourself"
                    disabled={updating}
                    className={`w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      updating ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    rows={3}
                  />
                </div>
              </form>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={updateProfile}
                  disabled={updating}
                  className={`px-5 py-2 rounded-md transition-all duration-200 flex items-center gap-2 font-medium ${
                    updating
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : saveSuccess 
                      ? 'bg-green-500 text-white'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button 
                  disabled={updating}
                  className={`px-5 py-2 border border-gray-200 rounded-md transition-colors ${
                    updating 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
};

export default Profile;
