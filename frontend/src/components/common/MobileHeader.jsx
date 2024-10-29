// src/components/common/MobileHeader.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import Avatar from "./staffComponents/Avatar";

const MobileHeader = () => {
  const { title, task } = useAppContext();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Mobile: Current user", currentUser); // Debugging log
    if (currentUser && currentUser.userNotifications) {
      const unreadCount = countUnreadNotifications(
        currentUser.userNotifications
      );
      setNotificationCount(unreadCount);
      console.log("Mobile: Notification count updated to", unreadCount);
    } else {
      console.log("Mobile: No user notifications found");
      setNotificationCount(0);
    }
  }, [currentUser]);

  const countUnreadNotifications = (notifications) => {
    if (!Array.isArray(notifications)) {
      console.log("Mobile: notifications is not an array", notifications);
      return 0;
    }
    return notifications.reduce((count, notification) => {
      return !notification.isRead ? count + 1 : count;
    }, 0);
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleNotificationsClick = () => {
    navigate("/notifications"); // Navigate to the notifications page
  };

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 fixed top-0 w-full lg:hidden shadow-sm">
      {task === 1 ? (
        <button onClick={handleBackClick} className="text-black mr-4">
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
      ) : (
        <div className="mr-4" />
      )}
      <h1 className="text-lg font-semibold text-black">{title}</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleNotificationsClick}
          className="text-black relative w-8 h-8 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button
          onClick={handleAvatarClick}
          className="w-8 h-8 flex items-center justify-center"
        >
          {currentUser?.displayImage ? (
            <img
              src={currentUser.displayImage}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Avatar name={currentUser?.name || ""} size={32} />
          )}
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
