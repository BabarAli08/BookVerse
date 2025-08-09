import React, { useState } from "react";
import { useDispatch } from "react-redux";
import  supabase  from "../supabase-client";
import { login } from "../Store/AuthSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    if (!isLogin) {
      // --- Sign Up ---
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password,
        options: {
          data: { name: details.name },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          alert("Account already exists. Please sign in instead.");
          setIsLogin(true); // Switch to login mode
        } else {
          alert(error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user && !data.session) {
        alert("Sign-up successful! Please check your email to verify your account.");
      } else if (data?.session) {
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
          <input
            type="text"
            placeholder="Name"
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            className="w-full p-3 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          className="w-full p-3 mb-4 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={details.password}
          onChange={(e) => setDetails({ ...details, password: e.target.value })}
          className="w-full p-3 mb-6 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded transition"
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
