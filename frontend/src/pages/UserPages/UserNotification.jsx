// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import NotificationCard from "../../components/common/NotificationCard";
import Modal from "../../components/common/staffComponents/Modal";
import CreateNotificationModal from "../../components/common/CreateNotificationModal";
import { useAppContext } from "../../contexts/AppContext";
// Sample initial notification data
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "System Maintenance",
    body: "Scheduled maintenance will occur at midnight.",
    isRead: false,
    profileImage: "https://via.placeholder.com/50",
    audience: "Everyone",
    createdByUser: false,
    from: "Alex",
    timestamp: "2024-09-11T09:40:51.640Z",
  },
  {
    id: 2,
    title: "New Policy Update",
    body: "Please review the updated staff policies.",
    isRead: true,
    profileImage: "https://via.placeholder.com/50",
    audience: "Staff",
    createdByUser: false,
    from: "Sims",
    timestamp: "2024-09-11T09:40:51.640Z",
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUserNotifications, setShowUserNotifications] = useState(false);

  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
  };

  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Notifications");
    setTask(1);
  }, [setTitle, setTask]);

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

  const handleCreateNotification = (newNotification) => {
    setNotifications([
      ...notifications,
      { ...newNotification, createdByUser: true },
    ]);
    closeCreateNotificationModal();
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
                    notification.body.length > 75
                      ? `${notification.body.substring(0, 75)}...`
                      : notification.body,
                }}
                onClick={() => openNotificationModal(notification)}
                onDelete={
                  notification.createdByUser
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
            {selectedNotification.title}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">From:</h3>
            <p>{selectedNotification.from}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Date:</h3>
            <p className="text-sm text-gray-500">
              {selectedNotification.timestamp}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Audience:</h3>
            <p>{selectedNotification.audience}</p>
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
              <p className="break-words">{selectedNotification.body}</p>
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
        />
      )}
    </div>
  );
};

export default NotificationsPage;
