import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RentalDetails.css';
import { addNewRentalAndUpdateVehicle } from '../../api/functions';
import { useAuth } from '../../contexts/AuthProvider';

export default function RentalDetails({ item, itemName, action }) {
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  //const { item } = location.state || {};

  const handleAction = () => {
    navigate('/confirmation', {
      state: { itemName, action, item }
    });
  };
  

  return (
    <div className="rental-details-container">
      <header className="rental-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="header-title">
          {action === 'book' ? 'Booking' : 'Reserving'} {item.name}
        </span>
      </header>

      <div className="rental-content">
        <img 
          src={`/images/${itemName.toLowerCase().replace(/\s/g, '')}.jpeg`} 
          alt={itemName} 
          className="rental-image" 
        />

        <div className="rental-info">
          <h2>Details</h2>
          {/* Original Details */}
         

          {/* Additional Vehicle Details */}
          <div className="vehicle-details">
            <p><strong>Registration:</strong> {item.registration}</p>
            <p><strong>Make:</strong> {item.make}</p>
            <p><strong>Model:</strong> {item.model}</p>
            <p><strong>Year:</strong> {item.year}</p>
          </div>
        </div>

        {/* Conditionally show the DatePicker only if action is "reserve" */}
        {action === 'reserve' && (
          <div className="date-time-selector">
            <span>Select Date and Time</span>
            <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="date-picker"
            />
          </div>
        )}

        <button onClick={handleAction} className="book-now-button">
          {action === 'book' ? 'Book Now' : 'Reserve Now'}
        </button>
      </div>
    </div>
  );
}