import React from "react";
import Avatar from "./staffComponents/Avatar";
import { formatTimeAgo } from "../../utils/dateUtils"; // Assume this utility function exists

const NotificationCard = ({ notification, onClick, onDelete, isSelected, currentUser }) => {
  if (!notification) {
    return null;
  }

  const truncateBody = (body) => {
    if (!body) return "";
    return body.length > 50 ? `${body.slice(0, 50)}...` : body;
  };

  const isUserNotification = currentUser.uid === notification.SenderID;

  return (
    <div
      className={`p-4 cursor-pointer relative transition duration-300 ease-in-out hover:bg-gray-100 hover:scale-[1.02] ${
        isSelected
          ? "bg-gray-100"
          : notification.isRead 
          ? "bg-white"
          : "bg-white"
      }`}
      onClick={onClick}
    >
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full" />
      )}
      <div className="flex items-center">
        <Avatar name={notification.Sender} size={40} />
        <div className="ml-4 flex-1">
          <p className="text-sm mb-1">
            <strong>{notification.Sender}</strong> sent a notification to{" "}
            {notification.Audience}
          </p>
          <h4 className="text-lg">{notification.Title}</h4>
          <p className="text-sm text-gray-600">
            {truncateBody(notification.Body)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatTimeAgo(notification.Date)}
          </p>
        </div>
        {isUserNotification && onDelete && (
          <button
            className="text-red-500 hover:text-red-700 ml-2"
            onClick={(e) => {
              e.stopPropagation();
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
