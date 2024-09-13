import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemName, action } = location.state || {};

  const handleConfirm = () => {
    navigate('/finalDetails', { state: { itemName, action } });
  };

  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
        <h1>Your {itemName} has been {action}ed...</h1>
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
