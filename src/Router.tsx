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

const AppRouter = () => {
  return (
    <>
    <Toaster richColors position="top-left" theme="dark" />
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails/>}/>
          <Route path="/premium" element={<Premium />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/library" element={<MyLibrary />}/>
          <Route path="/wishlist" element={<WishList />}/>
          <Route path="/settings" element={<Settings />}/>
        </Route>
          <Route path="*" element={<NotFound />} />
           <Route path="/books/:id/read" element={<BookReader />} />
      </Routes>
    </Router>
    </>
  );
};

export default AppRouter;
