// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import NotificationCard from "../../components/common/NotificationCard";
import NotificationCardSkeleton from "../../components/common/NotificationCardSkeleton";
import Modal from "../../components/common/staffComponents/Modal";
import CreateNotificationModal from "../../components/common/CreateNotificationModal";
import { useAppContext } from "../../contexts/AppContext";
import {
  createNotification,
  fetchUserNotifications,
} from "../../api/functions"; // Update the path
import { setNotificationAsRead } from "../../api/functions"; // Import your function to mark notifications as read
import { useAuth } from "../../contexts/AuthProvider";

const NotificationsPage = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUserNotifications, setShowUserNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDetails, setShowDetails] = useState(false);

  const { setTitle, setTask } = useAppContext();
  const { refreshCurrentUser } = useAuth();

  const refreshNotifications = async () => {
    try {
      //console.log(currentUser)
      const updatedNotifications = await fetchUserNotifications(
        currentUser.uid
      );
      setNotifications(updatedNotifications);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    setTitle("Notifications");
    setTask(1);
    refreshNotifications();
  }, [setTitle, setTask]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const openNotificationModal = async (notification) => {
    setSelectedNotification(notification);
    if (isMobile) {
      setShowDetails(true);
    }
    if (!notification.isRead) {
      await setNotificationAsRead(currentUser.uid, notification.id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      await refreshCurrentUser();
    }
  };

  const openCreateNotificationModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateNotificationModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateNotification = async (newNotification) => {
    try {
      console.log(newNotification);
      await createNotification(newNotification);
      closeCreateNotificationModal();
      await refreshNotifications();
      await refreshCurrentUser();
    } catch (error) {
      console.error("Error creating notification:", error.message);
    }
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = showUserNotifications
    ? notifications.filter((n) => n.createdByUser)
    : notifications;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedNotification(null);
  };

  return (
    <div className="pt-20 p-8 h-screen overflow-hidden">
      <div className="flex h-full space-x-4">
        {/* Left side: Notifications list */}
        {(!isMobile || (isMobile && !showDetails)) && (
          <div
            className={`${
              isMobile ? "w-full" : "w-2/5"
            } overflow-hidden flex flex-col`}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg mb-4 flex-shrink-0">
              <h1 className="text-2xl font-bold mb-4">Notifications</h1>

              <div className="flex justify-between items-center mb-4">
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={openCreateNotificationModal}
                >
                  Create Notification
                </button>

                <button
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() =>
                    setShowUserNotifications(!showUserNotifications)
                  }
                >
                  {showUserNotifications
                    ? "Show All Notifications"
                    : "Show My Notifications"}
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-grow bg-white rounded-lg shadow-lg">
              {isLoading ? (
                // Display 5 skeleton loaders while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <NotificationCardSkeleton />
                    {index < 4 && <hr className="border-gray-200" />}
                  </React.Fragment>
                ))
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <div
                      className={`transition duration-300 ease-in-out hover:bg-gray-100 p-4 ${
                        selectedNotification &&
                        selectedNotification.id === notification.id
                          ? "bg-gray-100"
                          : ""
                      }`}
                    >
                      <NotificationCard
                        notification={{
                          ...notification,
                          body:
                            notification.Body.length > 50
                              ? `${notification.Body.substring(0, 50)}...`
                              : notification.Body,
                          style: {
                            fontWeight: notification.isRead ? "normal" : "bold",
                          },
                        }}
                        onClick={() => openNotificationModal(notification)}
                        onDelete={
                          notification.Sender === currentUser.Name
                            ? () => handleDeleteNotification(notification.id)
                            : null
                        }
                        isSelected={
                          selectedNotification &&
                          selectedNotification.id === notification.id
                        }
                      />
                    </div>
                    {index < filteredNotifications.length - 1 && (
                      <hr className="border-gray-200" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p className="p-4">No notifications found.</p>
              )}
            </div>
          </div>
        )}

        {/* Right side: Selected notification details */}
        {(!isMobile || (isMobile && showDetails)) && (
          <div className={`${isMobile ? "w-full" : "w-3/5"} overflow-hidden`}>
            {isMobile && (
              <button
                className="mb-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-300"
                onClick={handleBackToList}
              >
                Back to List
              </button>
            )}
            {selectedNotification ? (
              <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedNotification.Title}
                </h2>

                <div className="mb-6 text-base">
                  <div className="flex items-center mb-2">
                    <span className="w-20 font-semibold">From:</span>
                    <span>{selectedNotification.Sender}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="w-20 font-semibold">To:</span>
                    <span>{selectedNotification.Audience}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 font-semibold">Date:</span>
                    <span>{formatDate(selectedNotification.Date)}</span>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                  <div
                    className="p-4 bg-gray-100 rounded"
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <p className="break-words">{selectedNotification.Body}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Select a notification to view details
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {isCreateModalOpen && (
        <CreateNotificationModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateNotificationModal}
          onCreate={handleCreateNotification}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
