import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const logo = new URL("../Home-page/logo.png", import.meta.url).href;
const profile = new URL("./profile.jpg", import.meta.url).href;

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("profileImage");
  const profileImage = (storedProfile && storedProfile !== "undefined" && storedProfile !== "null" && storedProfile !== "[object Object]") ? storedProfile : profile;
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const nameOfUser = userData ? userData.name : "no-name";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("userData");
      localStorage.removeItem("profileImage");
      navigate("/");
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-3 py-2 bg-pink-100  border border-gray-300">
        <div className="flex gap-5 items-center">
          <img src={logo} className="w-48" alt="Logo" title="Logo" />
          <p className="md:font-semibold md:text-lg hidden md:contents ">
            Graphic Era Hill University
          </p>
        </div>
        <div
          ref={dropdownRef}
          className={`bg-pink-200 cursor-pointer relative flex items-center gap-3 border border-gray-400 px-4 py-1 rounded-full ${
            showDropdown ? "active" : ""
          }`}
          onClick={handleClick}
        >
          <img src={profileImage} className="w-10 rounded-full" alt="Profile" />
          <p>{nameOfUser}</p>
          {showDropdown && (
            <div className="absolute top-full right-0 bg-white shadow-md rounded-lg overflow-hidden w-full mt-1">
              <ul>
                <Link to={"/user/" + userData._id}>
                  <li className="px-4 py-2 hover:bg-gray-100">View Profile</li>
                </Link>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
