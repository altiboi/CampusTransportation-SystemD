import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmation.css'; // Create a CSS file for styles

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the return details from the location state
  const { returnDetails, fine } = location.state || {}; // Get fine from location state
  if (!returnDetails) {
    navigate('/'); // Redirect if no return details are found
    return null;
  }

  const { vehicle, returnDateTime, condition } = returnDetails;
  const reservedUntil = new Date(vehicle.reservedUntil);
  const returnDate = new Date(returnDateTime);

  // Calculate if the vehicle was returned late
  const isLate = returnDate > reservedUntil;
  
  // Use the fine passed from Returns component
  const displayedFine = isLate ? fine : 0;

  const handleViewFines = () => {
    navigate('/UserFines');
  };

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <header className="desktop-header mb-4">
        <h1 className="text-xl font-bold">Return Confirmation</h1>
      </header>

      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Return Details</h2>
        <div className="flex mb-4">
          <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 object-cover" />
          <div className="ml-4">
            <h3 className="font-semibold">{vehicle.name}</h3>
            <p>Model: {vehicle.model}</p>
            <p>Registration: {vehicle.registration}</p>
            <p>Year: {vehicle.year}</p>
            <p>Reserved Until: {reservedUntil.toLocaleDateString()}</p>
            <p>Return Date: {returnDate.toLocaleDateString()}</p>
            <p>Condition: {condition}</p>
          </div>
        </div>

        {isLate && (
          <div className="text-red-500 mt-4">
            <p>The vehicle was returned late.</p>
            <p>Fine: R {displayedFine.toFixed(2)}</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded mt-2"
              onClick={handleViewFines}
            >
              View Fines Details
            </button>
          </div>
        )}
        {!isLate && (
          <p className="text-green-500 mt-4">Thank you for returning the vehicle on time!</p>
        )}
      </div>
    </main>
  );
};

export default Confirmation;
