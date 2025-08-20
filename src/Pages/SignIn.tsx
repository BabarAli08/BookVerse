import React, { useState } from "react";
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

  const createUserProfile = async (
    userId: string,
    name: string,
    email: string,
    bio: string,
    location: string
  ) => {
    try {
      const { error } = await supabase.from("profiles").insert([
        {
          id: userId,
          name,
          email,
          bio,
          location,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error creating profile:", error);
      }
    } catch (err) {
      console.error("Unexpected error creating profile:", err);
    }
  };

  const handleAuth = async () => {
    setLoading(true);

    if (!isLogin) {
      // --- Sign Up ---
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
        if (error.message.includes("User already registered")) {
          alert("Account already exists. Please sign in instead.");
          setIsLogin(true);
        } else {
          alert(error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user && !data.session) {
        alert("Sign-up successful! Please check your email to verify your account.");
      } else if (data?.session && data?.user) {
        await createUserProfile(
          data.user.id,
          details.name,
          details.email,
          details.bio,
          details.location
        );
        dispatch(login(data.user));
      }
    } else {
      // --- Sign In ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email: details.email,
        password: details.password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
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
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
