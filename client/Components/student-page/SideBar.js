import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faHome,
  faBell,
  faCog,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import profile from "./profile.jpg";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const name = userData?.name;
  const userType = userData?.type;
  const storedProfile = localStorage.getItem("profileImage");
  const profileImage = (storedProfile && storedProfile !== "undefined" && storedProfile !== "null") ? storedProfile : profile;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="sm:hidden fixed top-16 left-0 z-50 text-black text-3xl p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed sm:relative sm:translate-x-0 sm:w-2/12 bg-slate-800 text-white h-[calc(100vh-6rem)] overflow-y-auto flex flex-col items-center rounded-md transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full"
        } sm:w-2/12 z-40 md:max-xl:w-3/12`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-8 sm:hidden">
          <img
            src={profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
        </div>
        <div className="md:flex md:flex-col md:items-center mt-8 hidden sm:flex sm:text-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <h2 className="mt-4 text-2xl font-semibold">{name}</h2>
          <p className="text-sm">{userType}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex flex-col items-center w-full">
          {[
            { to: `/${userType}`, icon: faHome, text: "Home" },
            { to: `/${userType}/notifications`, icon: faBell, text: "Updates" },
            { to: "/settings", icon: faCog, text: "Settings" },
            { to: `/${userType}/contact`, icon: faEnvelope, text: "Contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white text-black font-semibold text-center text-lg py-1.5 px-3 rounded-md w-9/12 m-3 hover:scale-110 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={link.icon} className="mr-2" />
              <span className="inline">{link.text}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 sm:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
