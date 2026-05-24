import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userDataString = localStorage.getItem("userData");
  const { _id } = JSON.parse(userDataString);
    const BASE_URL = process.env.BASE_URL;

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/getReply/${_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [_id]);

  return (
    <div className="">
      <Header />
      <div className="flex md:p-3 bg-cyan-50 p-1">
        <SideBar></SideBar>
        <div className="w-5/6 h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="px-5 py-2 text-2xl rounded-md bg-purple-400 font-bold text-white mx-3 my-1">
            Notifications
          </h3>
          <ul className="list-none p-2.5">
            {notifications
              .slice()
              .reverse()
              .map((notification, index) => (
                <li
                  key={index}
                  className="bg-white shadow-md rounded-lg overflow-hidden mb-4"
                >
                  <div className="flex items-center px-4 py-3 bg-gray-100">
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Form Name:</strong> {notification.formName}
                    </p>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <p className="text-gray-700">
                      <strong>Question Description:</strong>{" "}
                      {notification.question}
                    </p>
                    <p className="text-gray-700">
                      <strong>Your Answer:</strong> {notification.answer}
                    </p>
                    <p className="text-gray-700">
                      <strong>Professor's Reply:</strong> {notification.reply}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;
