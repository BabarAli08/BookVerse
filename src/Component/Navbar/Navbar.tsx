import { IoSearch } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
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

  return (
    <>
      <div className="px-4 md:px-[10vw] lg:px-[15vw] flex items-center justify-between w-full h-[6vh] border-b border-gray-200/30 bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm shadow-lg relative z-50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/60 before:via-white/40 before:to-white/60 before:backdrop-blur-sm before:-z-10">
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer relative z-10"
        >
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
            <IoBookOutline
              size={isMobile ? 20 : 24}
              className="text-white group-hover:rotate-12 transition-transform duration-300 ease-out relative z-10"
            />
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            BookVerse
          </h1>
        </div>

        {!isMobile && (
          <>
            <div>
              <ul
                className="flex items-center space-x-8 text-gray-500"
                id="links"
              >
                {links.map((link, i) => (
                  <li
                    onClick={() => navigate(link.url)}
                    key={i}
                    className="relative py-2 cursor-pointer transition-colors duration-300 hover:text-purple-600 group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              {desktopIcons.map((Icon, index) => (
                <div
                  onClick={() => Icon.onClick?.()}
                  key={index}
                  className="relative p-3 rounded-xl bg-gradient-to-br from-white/40 via-white/20 to-transparent hover:from-white/60 hover:via-white/30 hover:to-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer group border border-white/20 hover:border-white/40"
                >
                  <Icon.component
                    className="text-gray-600 group-hover:text-purple-600 transition-colors duration-300"
                    size={20}
                  />
                  {Icon.component === FiUser && profileClicked && (
                    <ProfileDropdown
                      isOpen={profileClicked}
                      setIsOpen={setProfileClicked}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {isMobile && (
          <div className="flex items-center space-x-3 relative z-10">
            <div
              onClick={() => setProfileClicked(!profileClicked)}
              className="relative p-3 rounded-xl bg-gradient-to-br from-white/40 via-white/20 to-transparent hover:from-white/60 hover:via-white/30 hover:to-white/10 backdrop-blur-sm transition-all duration-300 cursor-pointer group border border-white/20 hover:border-white/40"
            >
              <FiUser
                size={18}
                className="text-gray-900 group-hover:text-purple-600 transition-colors duration-300"
              />
              {profileClicked && (
                <ProfileDropdown
                  isOpen={profileClicked}
                  setIsOpen={setProfileClicked}
                />
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hamburger-btn p-3 rounded-xl bg-gradient-to-br from-white/40 via-white/20 to-transparent hover:from-white/60 hover:via-white/30 hover:to-white/10 backdrop-blur-sm transition-all duration-300 group border border-white/20 hover:border-white/40"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiX
                  size={22}
                  className="text-gray-900 group-hover:text-red-500 transition-colors duration-300"
                />
              ) : (
                <HiMenu
                  size={22}
                  className="text-gray-900 group-hover:text-purple-600 transition-colors duration-300"
                />
              )}
            </button>
          </div>
        )}
      </div>

      {isMobile && mobileMenuOpen && (
        <div
          className={`mobile-menu absolute top-[6vh] left-0 right-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 backdrop-blur-md shadow-xl border-b border-white/30 z-40 transform transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          } before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:via-transparent before:to-white/20 before:backdrop-blur-sm`}
        >
          <div className="px-6 py-4 relative z-10">
            <ul className="space-y-2">
              {links.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleMobileNavClick(link.url)}
                    className="w-full text-left py-4 px-6 text-gray-700 hover:text-purple-600 hover:bg-white/40 rounded-lg transition-all duration-300 font-medium"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
