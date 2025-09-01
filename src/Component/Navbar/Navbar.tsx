import { IoSearch } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileSettings";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
  const [profileClicked, setProfileClicked] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const desktopIcons = [
    { component: IoSearch, onClick: undefined },
    { component: LuShoppingCart, onClick: undefined },
    { component: FiUser, onClick: () => setProfileClicked(!profileClicked) },
  ];

  const links = [
    { name: "Home", url: "/" },
    { name: "Books", url: "/books" },
    { name: "Premium", url: "/premium" },
    { name: "About", url: "/about" },
  ];

  const navigate = useNavigate();

  const handleMobileNavClick = (url: string) => {
    navigate(url);
    setMobileMenuOpen(false);
  };

  // Animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const linkVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    }
  };

  const mobileItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-[10vw] lg:px-[15vw] h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
            >
              <IoBookOutline size={24} className="text-white" />
              
              {/* Glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-md -z-10"
              />
            </motion.div>
            
            <motion.h1
              whileHover={{ scale: 1.02 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              BookVerse
            </motion.h1>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {/* Navigation Links */}
              <motion.div
                variants={linkVariants}
                className="flex items-center space-x-8"
              >
                {links.map((link, i) => (
                  <motion.div
                    key={i}
                    variants={linkVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => navigate(link.url)}
                      className="relative py-2 px-4 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 group"
                    >
                      {link.name}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Desktop Icons */}
              <motion.div
                variants={linkVariants}
                className="flex items-center space-x-3"
              >
                {desktopIcons.map((Icon, index) => (
                  <motion.div
                    key={index}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => Icon.onClick?.()}
                    className="relative p-3 rounded-xl bg-gray-100/50 hover:bg-white/80 backdrop-blur-sm cursor-pointer border border-gray-200/30 hover:border-gray-300/50 transition-all duration-300"
                  >
                    <Icon.component
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      size={20}
                    />
                    
                    {/* Profile Dropdown */}
                    {Icon.component === FiUser && profileClicked && (
                      <ProfileDropdown
                        isOpen={profileClicked}
                        setIsOpen={setProfileClicked}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Mobile Icons */}
          {isMobile && (
            <motion.div
              variants={linkVariants}
              className="flex items-center space-x-3"
            >
              {/* Profile Icon */}
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                onClick={() => setProfileClicked(!profileClicked)}
                className="relative p-3 rounded-xl bg-gray-100/50 hover:bg-white/80 backdrop-blur-sm cursor-pointer border border-gray-200/30"
              >
                <FiUser size={18} className="text-gray-600" />
                
                {profileClicked && (
                  <ProfileDropdown
                    isOpen={profileClicked}
                    setIsOpen={setProfileClicked}
                  />
                )}
              </motion.div>

              {/* Hamburger Menu */}
              <motion.button
                variants={iconVariants}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hamburger-btn p-3 rounded-xl bg-gray-100/50 hover:bg-white/80 backdrop-blur-sm border border-gray-200/30 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? 'close' : 'open'}
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {mobileMenuOpen ? (
                      <HiX size={20} className="text-gray-600" />
                    ) : (
                      <HiMenu size={20} className="text-gray-600" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Bottom Menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Bottom Sheet Menu */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mobile-menu fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl rounded-t-3xl"
            >
              {/* Handle Bar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center pt-3 pb-2"
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </motion.div>

              {/* Menu Content */}
              <div className="px-6 pb-8 pt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Navigation</h3>
                  <p className="text-sm text-gray-500">Choose your destination</p>
                </motion.div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {links.map((link, i) => (
                    <motion.button
                      key={i}
                      variants={mobileItemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMobileNavClick(link.url)}
                      className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-blue-50 hover:to-blue-100/50 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 group"
                    >
                      <div className="text-center">
                        <div className={`text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors ${link.name === 'Premium' ? 'text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text' : ''}`}>
                          {link.name}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  variants={mobileItemVariants}
                  className="flex justify-center space-x-6 pt-4 border-t border-gray-200/50"
                >
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200/50 transition-all duration-300 group"
                  >
                    <IoSearch size={24} className="text-blue-600 group-hover:text-blue-700" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200/50 transition-all duration-300 group"
                  >
                    <LuShoppingCart size={24} className="text-green-600 group-hover:text-green-700" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
};

export default Navbar;