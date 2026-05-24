import React from "react";
import { Link } from "react-router-dom";

const zoro = new URL("./404.png", import.meta.url).href;

const ErrorPage = () => {
  const userDataString = localStorage.getItem("userData");
  const { type } = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div className="error-container flex items-center justify-center h-screen bg-gradient-to-t from-gray-200 to-white">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6">
          Uh oh! We couldn't find that page.
        </h1>
        <p className="text-gray-600 mb-6">
          The page you were looking for might not exist, or you may have typed
          the URL incorrectly.
        </p>
        <img src={zoro} alt="Error page illustration" />
        <Link
          to={`/${type}`}
          className="px-6 py-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
