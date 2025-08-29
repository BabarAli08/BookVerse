import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, MapPin, FileText, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import supabase from "../supabase-client";
import { login } from "../Store/AuthSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    location: "",
  });
  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: existingProfile, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .maybeSingle();

          if (error && error.code !== "PGRST116") {
            console.error("Error checking profile:", error);
            toast.error("Error checking user profile");
            return;
          }

          if (!existingProfile) {
            try {
              await createUserProfile(
                session.user.id,
                session.user.user_metadata?.name || details.name || "",
                session.user.email || "",
                session.user.user_metadata?.bio || details.bio || "",
                session.user.user_metadata?.location || details.location || ""
              );
            } catch (profileError) {
              console.error("Error creating profile:", profileError);
              toast.error("Error creating user profile");
            }
          }
          
          dispatch(login(session.user));
          toast.success(`Welcome ${isLogin ? 'back' : 'to BookVerse'}!`);
          
          // Navigate to home page after successful authentication
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch, navigate, isLogin, details]);

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!details.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(details.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!details.password) {
      newErrors.password = "Password is required";
    } else if (details.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!details.name.trim()) {
        newErrors.name = "Full name is required";
      } else if (details.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUserProfile = async (
    userId: string,
    name: string,
    email: string,
    bio: string,
    location: string
  ) => {
    const { error } = await supabase.from("profiles").insert([
      {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        bio: bio.trim(),
        location: location.trim(),
        website: "",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (!isLogin) {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: details.email.trim().toLowerCase(),
          password: details.password,
          options: {
            data: {
              name: details.name.trim(),
              bio: details.bio.trim(),
              location: details.location.trim(),
            },
          },
        });

        if (error) {
          console.error("Sign up error:", error);
          if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists. Please sign in instead.");
            setIsLogin(true);
          } else if (error.message.includes("Invalid email")) {
            toast.error("Please enter a valid email address");
          } else if (error.message.includes("Password should be at least")) {
            toast.error("Password should be at least 6 characters");
          } else {
            toast.error(error.message || "Failed to create account");
          }
        } else if (data.user) {
          if (!data.user.email_confirmed_at) {
            toast.success("Account created! Please check your email to verify your account.");
          } else {
            dispatch(login(data.user));
            toast.success("Account created successfully!");
          }
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: details.email.trim().toLowerCase(),
          password: details.password,
        });

        if (error) {
          console.error("Sign in error:", error);
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please check your credentials.");
          } else if (error.message.includes("Email not confirmed")) {
            toast.error("Please verify your email address before signing in.");
          } else if (error.message.includes("Too many requests")) {
            toast.error("Too many attempts. Please try again later.");
          } else {
            toast.error(error.message || "Failed to sign in");
          }
        } else if (data.user) {
          dispatch(login(data.user));
          toast.success("Signed in successfully!");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <motion.div 
          className="py-6 px-8 text-center border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin
              ? "Sign in to continue your reading journey"
              : "Join us and start reading smarter"}
          </p>
        </motion.div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Name Field */}
                  <div>
                    <div className={`flex items-center border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors`}>
                      <User className={`${errors.name ? 'text-red-400' : 'text-gray-400'} mr-2`} size={18} />
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={details.name}
                        onChange={(e) => {
                          setDetails({ ...details, name: e.target.value });
                          if (errors.name) {
                            const newErrors = { ...errors };
                            delete newErrors.name;
                            setErrors(newErrors);
                          }
                        }}
                        className="w-full outline-none bg-transparent placeholder-gray-500"
                        disabled={loading}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Bio Field */}
                  <div className="flex items-start border border-gray-300 bg-gray-50 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                    <FileText className="text-gray-400 mr-2 mt-1" size={18} />
                    <textarea
                      placeholder="Bio (optional)"
                      value={details.bio}
                      onChange={(e) =>
                        setDetails({ ...details, bio: e.target.value })
                      }
                      className="w-full outline-none bg-transparent resize-none placeholder-gray-500"
                      rows={2}
                      disabled={loading}
                    />
                  </div>

                  {/* Location Field */}
                  <div className="flex items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      value={details.location}
                      onChange={(e) =>
                        setDetails({ ...details, location: e.target.value })
                      }
                      className="w-full outline-none bg-transparent placeholder-gray-500"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <div className={`flex items-center border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors`}>
                <Mail className={`${errors.email ? 'text-red-400' : 'text-gray-400'} mr-2`} size={18} />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={details.email}
                  onChange={(e) => {
                    setDetails({ ...details, email: e.target.value });
                    if (errors.email) {
                      const newErrors = { ...errors };
                      delete newErrors.email;
                      setErrors(newErrors);
                    }
                  }}
                  className="w-full outline-none bg-transparent placeholder-gray-500"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className={`flex items-center border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors`}>
                <Lock className={`${errors.password ? 'text-red-400' : 'text-gray-400'} mr-2`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password *"
                  value={details.password}
                  onChange={(e) => {
                    setDetails({ ...details, password: e.target.value });
                    if (errors.password) {
                      const newErrors = { ...errors };
                      delete newErrors.password;
                      setErrors(newErrors);
                    }
                  }}
                  className="w-full outline-none bg-transparent placeholder-gray-500"
                  required
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6 shadow-md"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              <span>
                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </span>
            </motion.button>
          </form>

          {/* Toggle Mode */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 font-semibold hover:underline cursor-pointer transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>

          {/* Additional Info */}
          {!isLogin && (
            <motion.p 
              className="text-xs text-gray-500 text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
