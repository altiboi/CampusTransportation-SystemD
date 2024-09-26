// src/pages/UserPages/FinalDetails.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './FinalDetails.css';

const FinalDetails = () => {
  const location = useLocation();
  const { itemName, action } = location.state || {};
  const pickupTime = new Date(); // Assuming the pickup time is now; adjust as needed
  const returnDeadline = new Date(pickupTime.getTime() + 2 * 60 * 60 * 1000); // 24 hours later

  return (
    <div className="final-details-container">
      <header className="final-details-header">
        <h1>Your  {itemName} has been {action}ed!</h1>
      </header>
      {/* <p>Return the bike by {returnDeadline.toLocaleString()}.</p> */}
    </div>
  );
};

export default FinalDetails;
