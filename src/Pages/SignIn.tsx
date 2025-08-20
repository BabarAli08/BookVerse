import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
        console.log("Auth state change:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("✅ User signed in, checking for profile...");
          
          
          const { data: existingProfile, error: checkError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (checkError) {
            console.log(" Profile check error:", checkError.message);
            
            
            if (session.user.user_metadata && Object.keys(session.user.user_metadata).length > 0) {
              console.log(" Creating profile from metadata:", session.user.user_metadata);
              
              await createUserProfile(
                session.user.id,
                session.user.user_metadata.name || "",
                session.user.email || "",
                session.user.user_metadata.bio || "",
                session.user.user_metadata.location || ""
              );
            } else {
              console.log(" No user_metadata available for profile creation");
            }
          } else {
            console.log("Profile already exists:", existingProfile);
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
    try {
      console.log(" Creating profile with data:", {
        userId,
        name,
        email,
        bio,
        location
      });

      const { data, error } = await supabase.from("profiles").insert([
        {
          id: userId,
          name,
          email,
          bio,
          location,
          website: "",
          avatar: "",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error creating profile:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
      
        if (error.code === '42501' || error.message.includes('permission')) {
          console.error("🔒 This looks like a Row Level Security issue!");
          console.error("💡 Make sure your profiles table has the correct RLS policies");
        }
      } else {
        console.log(" Profile created successfully:", data);
      }
    } catch (err) {
      console.error("Unexpected error creating profile:", err);
    }
  };

  
  const handleAuth = async () => {
    setLoading(true);

    if (!isLogin) {
     
      console.log("Starting sign up process...");
      
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

      if (error) {
        console.error(" Sign up error:", error);
        if (error.message.includes("User already registered")) {
          alert("Account already exists. Please sign in instead.");
          setIsLogin(true);
        } else {
          alert(error.message);
        }
        setLoading(false);
        return;
      }

      console.log("Sign up success:", {
        user: data.user?.email,
        session: !!data.session,
        user_metadata: data.user?.user_metadata
      });

      if (data?.user) {
        if (data.session) {
         
          console.log(" User signed in immediately, creating profile...");
          await createUserProfile(
            data.user.id,
            details.name,
            details.email,
            details.bio,
            details.location
          );
          dispatch(login(data.user));
          alert("Account created successfully!");
        } else {
          alert("Sign-up successful! Please check your email to verify your account. Your profile will be created when you confirm your email.");
        }
      }
    } else {
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email: details.email,
        password: details.password,
      });

      if (error) {
        console.error(" Sign in error:", error);
        alert(error.message);
        setLoading(false);
        return;
      }

      console.log("Sign in success:", data.user?.email);

      if (data?.user) {
    
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          console.log("No profile found, creating one...");
          
          await createUserProfile(
            data.user.id,
            data.user.user_metadata?.name || "",
            data.user.email || "",
            data.user.user_metadata?.bio || "",
            data.user.user_metadata?.location || ""
          );
        } else if (existingProfile) {
          console.log("Profile already exists");
        }

        dispatch(login(data.user));
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

   
        

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              className="w-full p-3 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <textarea
              placeholder="Bio"
              value={details.bio}
              onChange={(e) => setDetails({ ...details, bio: e.target.value })}
              className="w-full p-3 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
            <input
              type="text"
              placeholder="Location"
              value={details.location}
              onChange={(e) =>
                setDetails({ ...details, location: e.target.value })
              }
              className="w-full p-3 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          className="w-full p-3 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={details.password}
          onChange={(e) => setDetails({ ...details, password: e.target.value })}
          className="w-full p-3 mb-6 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          minLength={6}
        />

        <button
          onClick={handleAuth}
          disabled={
            loading ||
            (!isLogin && !details.name) ||
            !details.email ||
            !details.password
          }
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white p-3 rounded transition"
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:underline cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsLogin(!isLogin);
              }
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;