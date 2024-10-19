import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import NotificationCard from '../../components/common/NotificationCard';
import Modal from '../../components/common/staffComponents/Modal';
import CreateNotificationModal from '../../components/common/CreateNotificationModal';
import { useAppContext } from "../../contexts/AppContext";
import { createNotification, fetchUserNotifications, setNotificationAsRead } from '../../api/functions'; 
import Trip from '../../assets/Trip.png';
import rental from '../../assets/rental.png';
import car from '../../assets/car.webp';
import schedule from '../../assets/schedule.webp';
import Reserve from '../../assets/reserve.avif';
import fine from '../../assets/fine.avif';
import returns from '../../assets/return-.jpg';
import map from '../../assets/map.webp';
import './UserService.scss'; 
import { useAuth } from '../../contexts/AuthProvider';

function UserService() {
  const { setTitle, setTask } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { currentUser, refreshCurrentUser } = useAuth(); 

  useEffect(() => {
    setTitle("Services");
    setTask(0);
    refreshNotifications(); 
  }, [setTitle, setTask]);

  const refreshNotifications = async () => {
    try {
      const updatedNotifications = await fetchUserNotifications(currentUser.uid);
      setNotifications(updatedNotifications); 
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = async () => {
    if (selectedNotification && !selectedNotification.isRead) {
      await setNotificationAsRead(currentUser.uid, selectedNotification.id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === selectedNotification.id ? { ...n, isRead: true } : n
        )
      );
      await refreshCurrentUser(); // Refresh the current user state if needed
    }
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
      await createNotification(newNotification);
      closeCreateNotificationModal();
      await refreshNotifications();
    } catch (error) {
      console.error("Error creating notification:", error.message);
    }
  };

  const filteredNotifications = notifications.filter((n) => !n.isRead); // Show only unread notifications

  return (
    <main className='user-service-container'>
      <section className='actions-section'>
        <section className='actions-title'>
          <h2 className='title-main pl-2'>Get anything done with a click!</h2>
        </section>
        <section className='actions-group'>
          <Card className="action-card">
            <Link to="/Returns" className="link">
              <section className='headings'>
                <h2 className="card-heading">Returns</h2>
              </section>
              <section className='card-icon'>
                <img src={returns} alt="Returns" className='icon-large' />
              </section>
            </Link>
          </Card>
          <Card className="action-card">
            <Link to="/UserReserve" className='link'>
              <section className='headings'>
                <h2 className="card-heading">Reserve</h2>
              </section>
              <section className='card-icon'>
                <img src={Reserve} alt="Reserve" className='icon-large' />
              </section>
            </Link>
          </Card>
          <Card className="action-card">
            <Link to="/UserMap" className="link">
              <section className='headings'>
                <span className='card-heading'>Campus Map</span>
              </section>
              <section className='card-icon'>
                <img src={map} alt="Campus Map" className='icon-large' />
              </section>
            </Link>
          </Card>
          <Card className="action-card">
            <Link to="/UserRent" className='link'>
              <section className='headings'>
                <h2 className="card-heading">Rent</h2>
              </section>
              <section className='card-icon'>
                <img src={car} alt="Rent" className='icon-large' />
              </section>
            </Link>
          </Card>
          <Card className="action-card">
            <Link to="/UserBuses" className='link'>
              <section className='headings'>
                <h2 className="card-heading">Bus Schedule</h2>
              </section>
              <section className='card-icon'>
                <img src={schedule} alt="Bus Schedule" className='icon-large' />
              </section>
            </Link>
          </Card>
          <Card className="action-card">
            <Link to="/UserFines" className="link">
              <section className='headings'>
                <h2 className="card-heading">Fines</h2>
              </section>
              <section className='card-icon'>
                <img src={fine} alt="Fines" className='icon-large' />
              </section>
            </Link>
          </Card>
        </section>
      </section>

      <section className='notification-section'>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-2xl font-bold mb-4">Unread Notifications</h1>

            {/* Show only unread notifications */}
            {filteredNotifications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={{
                      ...notification,
                      body:
                        notification.Body.length > 75
                          ? `${notification.Body.substring(0, 75)}...`
                          : notification.Body,
                      style: {
                        fontWeight: notification.isRead ? "normal" : "bold",
                      }
                    }}
                    onClick={() => openNotificationModal(notification)} // Open modal on click
                  />
                ))}
              </div>
            ) : (
              <p>No unread notifications found.</p>
            )}
          </div>

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
                  {formatDate(selectedNotification.Date)}
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
              currentUser={currentUser}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default UserService;
