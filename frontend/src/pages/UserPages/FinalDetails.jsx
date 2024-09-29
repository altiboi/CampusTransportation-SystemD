// src/pages/UserPages/FinalDetails.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FinalDetails.css';

const FinalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemName, action } = location.state || {};
  const pickupTime = new Date(); // Assuming the pickup time is now; adjust as needed
  const returnDeadline = new Date(pickupTime.getTime() + 2 * 60 * 60 * 1000); // 24 hours later

  // Redirect to home page after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // Redirect to home page after 1 seconds
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [navigate]);

  return (
    <div className="final-details-container">
      <header className="final-details-header">
        <h1>Your {itemName} has been {action}ed!</h1>
      </header>
      {/* <p>Return the {itemName} by {returnDeadline.toLocaleString()}.</p> */}
    </div>
  );
};

export default FinalDetails;
