import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Mail, Lock, User, MapPin, FileText } from "lucide-react";
import supabase from "../supabase-client";
import { login } from "../Store/AuthSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    location: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: existingProfile, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (error) {
            await createUserProfile(
              session.user.id,
              session.user.user_metadata?.name || "",
              session.user.email || "",
              session.user.user_metadata?.bio || "",
              session.user.user_metadata?.location || ""
            );
          }
          dispatch(login(session.user));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const createUserProfile = async (
    userId: string,
    name: string,
    email: string,
    bio: string,
    location: string
  ) => {
    await supabase.from("profiles").insert([
      {
        id: userId,
        name,
        email,
        bio,
        location,
        website: "",
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleAuth = async () => {
    setLoading(true);

    if (!isLogin) {
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password,
        options: {
          data: {
            name: details.name,
            bio: details.bio,
            location: details.location,
          },
        },
      });

      if (!error && data.user) {
        dispatch(login(data.user));
      }
    } else {
      await supabase.auth.signInWithPassword({
        email: details.email,
        password: details.password,
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden border border-gray-200">
 
        <div className="py-6 px-8 text-center border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back 👋" : "Create an Account"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin
              ? "Sign in to continue"
              : "Join us and start reading smarter"}
          </p>
        </div>

   
        <div className="p-8">
          {!isLogin && (
            <>
              <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-black">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={details.name}
                  onChange={(e) =>
                    setDetails({ ...details, name: e.target.value })
                  }
                  className="w-full outline-none bg-transparent"
                />
              </div>

              <div className="flex items-start border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-black">
                <FileText className="text-gray-400 mr-2 mt-1" size={18} />
                <textarea
                  placeholder="Bio"
                  value={details.bio}
                  onChange={(e) =>
                    setDetails({ ...details, bio: e.target.value })
                  }
                  className="w-full outline-none bg-transparent resize-none"
                  rows={2}
                />
              </div>

              <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-black">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Location"
                  value={details.location}
                  onChange={(e) =>
                    setDetails({ ...details, location: e.target.value })
                  }
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </>
          )}

          <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-black">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={details.email}
              onChange={(e) =>
                setDetails({ ...details, email: e.target.value })
              }
              className="w-full outline-none bg-transparent"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 mb-6 focus-within:ring-2 focus-within:ring-black">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={details.password}
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
              className="w-full outline-none bg-transparent"
              required
              minLength={6}
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={
              loading ||
              (!isLogin && !details.name) ||
              !details.email ||
              !details.password
            }
            className="w-full bg-black text-white font-semibold py-3 rounded-lg transition hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>

        
          <p className="text-center text-gray-600 mt-6 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-semibold hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
