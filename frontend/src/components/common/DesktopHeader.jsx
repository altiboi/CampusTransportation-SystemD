import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import Avatar from "./staffComponents/Avatar";

const DesktopHeader = ({ currentUser }) => {
  const { title } = useAppContext();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0); // Example count, adjust or connect to your notifications logic

  useEffect(() => {
    if (currentUser && currentUser.userNotifications) {
      const unreadCount = countUnreadNotifications(
        currentUser.userNotifications
      );
      setNotificationCount(unreadCount);
      console.log("notification count updated  to " + unreadCount);
    }
  }, [currentUser]);

  // Function to count unread notifications
  const countUnreadNotifications = (notifications) => {
    return notifications.reduce((count, notification) => {
      return !notification.isRead ? count + 1 : count;
    }, 0);
  };

  const handleBackClick = () => {
    navigate("/notifications");
  };

  const handleMenuClick = () => {
    // Toggle sidebar or menu visibility if needed
  };

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  return (
    <header className="hidden lg:flex items-center justify-between bg-white p-4 fixed top-0 left-72 w-[calc(100%-18rem)] z-50 ">
      <button onClick={handleMenuClick} className="text-black">
        {/* <FontAwesomeIcon icon={faBars} size="lg" /> */}
      </button>
      <h1 className="flex-1 text-lg font-semibold text-black text-center">
        {/* {title} */}
      </h1>
      <div className="flex items-center space-x-4">
        <button onClick={handleBackClick} className="relative text-black">
          <FontAwesomeIcon icon={faBell} size="lg" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button onClick={handleAvatarClick}>
          {currentUser?.displayImage ? (
            <img
              src={currentUser.displayImage}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <Avatar name={currentUser?.name || ""} size={40} />
          )}
        </button>
      </div>
    </header>
  );
};

export default DesktopHeader;
