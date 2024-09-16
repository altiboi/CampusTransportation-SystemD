// src/components/common/NotificationCard.jsx
import React from "react";
import Avatar from "./staffComponents/Avatar";
const NotificationCard = ({ notification, onClick, onDelete }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-md ${
        notification.isRead ? "bg-white" : "bg-gray-100 font-bold"
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Avatar name={notification.Sender} size={40} />{" "}
        {/* Replace profile image with Avatar */}
        <div className="ml-4 flex-1">
          <h4 className="text-lg">{notification.Title}</h4>
          <p className="text-sm text-gray-600">
            {notification.Body.slice(0, 50)}...
          </p>
        </div>
        {onDelete && (
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onClick of the card
              onDelete();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
