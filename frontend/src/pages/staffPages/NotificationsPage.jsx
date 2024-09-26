// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import NotificationCard from "../../components/common/NotificationCard";
import Modal from "../../components/common/staffComponents/Modal";
import CreateNotificationModal from "../../components/common/CreateNotificationModal";
import { useAppContext } from "../../contexts/AppContext";
import { createNotification, getNotifications } from "../../api/functions"; // Update the path


const NotificationsPage = ({ notifs , currentUser}) => {  
  const [notifications, setNotifications] = useState(notifs);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUserNotifications, setShowUserNotifications] = useState(false);

  const { setTitle, setTask } = useAppContext();

  const refreshNotifications = async () => {
    try {
      const updatedNotifications = await getNotifications(); 
      setNotifications(updatedNotifications); 
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };


  useEffect(() => {
    setTitle("Notifications");
    setTask(1);
  }, [setTitle, setTask]);

  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    // Mark the notification as read when closing the modal
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === selectedNotification.id ? { ...n, isRead: true } : n
      )
    );
    setIsNotificationModalOpen(false);
    setSelectedNotification(null);
  };

  const openCreateNotificationModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateNotificationModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateNotification = async (newNotification) => {
    try {
      createNotification(newNotification);
      
      closeCreateNotificationModal();
      await refreshNotifications();

    } catch (error) {
      setError("Failed to create notification."); // Set error state
      console.error("Error creating notification:", error.message);
    } 


  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = showUserNotifications
    ? notifications.filter((n) => n.createdByUser)
    : notifications;

  return (
    <div className="pt-20 p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
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
            onClick={() => setShowUserNotifications(!showUserNotifications)}
          >
            {showUserNotifications
              ? "Show All Notifications"
              : "Show My Notifications"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={{
                  ...notification,
                  // Truncate the body for display in the list
                  body:
                    notification.Body.length > 75
                      ? `${notification.Body.substring(0, 75)}...`
                      : notification.Body,
                }}
                onClick={() => openNotificationModal(notification)}
                onDelete={
                  notification.Sender == currentUser.Name
                    ? () => handleDeleteNotification(notification.id)
                    : null
                }
              />
            ))
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      </div>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <Modal
          isOpen={isNotificationModalOpen}
          onClose={closeNotificationModal}
        >
          <h2 className="text-xl font-bold mb-4">
            {selectedNotification.Title}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">From:</h3>
            <p>{selectedNotification.Sender}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Date:</h3>
            <p className="text-sm text-gray-500">
              {selectedNotification.Date}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Audience:</h3>
            <p>{selectedNotification.Audience}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Notification</h3>
            <div
              className="p-4 bg-gray-100 rounded overflow-auto max-h-64"
              style={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                overflowY: "auto",
              }}
            >
              <p className="break-words">{selectedNotification.Body}</p>
            </div>
          </div>

          <button
            onClick={closeNotificationModal}
            className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Close
          </button>
        </Modal>
      )}

      {/* Create Notification Modal */}
      {isCreateModalOpen && (
        <CreateNotificationModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateNotificationModal}
          onCreate={handleCreateNotification}
          currentUser = {currentUser}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
