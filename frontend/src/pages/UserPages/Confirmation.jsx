import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Confirmation.css';
import { useAuth } from '../../contexts/AuthProvider';
import { addNewRentalAndUpdateVehicle } from '../../api/functions';

const Confirmation = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemName, action, item } = location.state || {};
  const { loading, refreshCurrentUser } = useAuth();

  const handleConfirm = async () => {
    if (!currentUser) {
      console.error("User not authenticated.");
      return; // Prevent further action if currentUser is not available
    }

    try {
      console.log(currentUser);
      // Add rental to the database when confirmed
      await addNewRentalAndUpdateVehicle(item.rentalStationID, item.type, currentUser.uid, item.id, 2);
      await refreshCurrentUser();
      // Navigate to the final details page after rental is added
      navigate('/finalDetails', { state: { itemName, action } });
    } catch (error) {
      console.error("Error confirming rental: ", error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <div>Loading...</div>; // Loading spinner or message while waiting for Firebase
  }

  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
        <button 
          onClick={handleBack} 
          className="back-button"
        >
          &larr; Back
        </button>
        <h1>Your {itemName} has been {action == 'book' ? 'booked' : action == 'reserve' ? 'reserved' : ''}...</h1>
      </header>
      <img 
        src={`/images/${itemName.toLowerCase().replace(/\s/g, '')}.jpeg`} 
        alt={itemName} 
        className="confirmation-image" 
      />
      <button 
        onClick={handleConfirm} 
        className="px-4 py-2 bg-black text-white rounded mt-4"
      >
        Confirm
      </button>
    </div>
  );
};

export default Confirmation;