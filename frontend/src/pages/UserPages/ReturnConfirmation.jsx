import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmation.css'; // Create a CSS file for styles

const ReturnConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the return details from the location state
  const { returnDetails, fineDetails, vehicle } = location.state || {}; // Get fine from location state
  if (!returnDetails) {
    navigate('/'); // Redirect if no return details are found
    return null;
  }

  const { returnedAt, dueReturnAt } = returnDetails;
  const returnDate = new Date(returnedAt);
  const returnDue = new Date(dueReturnAt);

  // Calculate if the vehicle was returned late
  const isLate = fineDetails !== null && fineDetails?.amount > 0;

  const handleViewFines = () => {
    navigate('/UserFines');
  };

  // Redirect to the home page if the vehicle was returned on time after 1 second
  useEffect(() => {
    if (!isLate) {
      const timeoutId = setTimeout(() => {
        navigate('/');
      }, 1000); // 1 second delay

      // Clean up the timeout if the component unmounts before the timeout completes
      return () => clearTimeout(timeoutId);
    }
  }, [isLate, navigate]);

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <header className="desktop-header mb-4">
        <h1 className="text-xl font-bold">Return Confirmation</h1>
      </header>

      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Return Details</h2>
        <div className="flex mb-4">
          {/* <img src={vehicle.model} alt={vehicle.make} className="w-24 h-24 object-cover" /> */}
          <div className="ml-4">
            <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
            <p>Return Due: {returnDue.toLocaleDateString()}</p>
            <p>Returned At: {returnDate.toLocaleDateString()}</p>
          </div>
        </div>

        {isLate && (
          <div className="text-red-500 mt-4">
            <p>The vehicle was returned late.</p>
            <p>Fine: R {fineDetails.amount.toFixed(2)}</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded mt-2"
              onClick={handleViewFines}
            >
              View Fines Details
            </button>
          </div>
        )}
        {!isLate && (
          <p className="text-green-500 mt-4">
            Thank you for returning the vehicle on time!
          </p>
        )}
      </div>
    </main>
  );
};

export default ReturnConfirmation;