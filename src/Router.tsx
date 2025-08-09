import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Component/Navbar/Layout";
import Home from "./Pages/Home/Home";
import Books from "./Pages/Books/Books";
import Premium from "./Pages/Premium/Premium";
import About from "./Pages/About/About";
import NotFound from "./Component/NotFound";
import Signup from "./Pages/Signup/Signup";
import BookDetails from "./Pages/BookDetails/BookDetails";
import { Toaster } from "sonner";
import Profile from "./Pages/Profile/Profile";
import MyLibrary from "./Pages/My Library/MyLibrary";
import WishList from "./Pages/Wishlist/WishList";
import Settings from "./Pages/Settings/Settings";
import BookReader from "./Pages/BookReader/BookReader";
import SignIn from "./Pages/SignIn";
import supabase from "./supabase-client";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

const AppRouter = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  if (!user.email_confirmed_at) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          background: "white",
        }}
      >
        <div style={{ textAlign: "center", color: "#6A0DAD" }}>
          <h1>Please Verify Your Email</h1>
          <p>
            We've sent you a verification link. Please verify your email to
            access the site.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-left" theme="dark" />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/library" element={<MyLibrary />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/books/:id/read" element={<BookReader />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
