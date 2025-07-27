import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Component/Navbar/Layout";
import Home from "./Pages/Home/Home";
import Books from "./Pages/Books/Books";
import Premium from "./Pages/Premium/Premium";
import About from "./Pages/About/About";
import NotFound from "./Component/NotFound";
import Signup from "./Pages/Signup/Signup";
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
        
        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
