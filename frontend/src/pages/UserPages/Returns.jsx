import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Returns.css'; // Create a CSS file for styles
import { useAppContext } from "../../contexts/AppContext";

const Returns = () => {
  const { setTitle, setTask } = useAppContext(); // Use context for title and task management
  const location = useLocation();
  const navigate = useNavigate();

  // Set the title and task similar to UserBuses
  useEffect(() => {
    setTitle("Return Vehicle");
    setTask(0);
  }, [setTitle, setTask]);

  // Mock vehicle data setup
  const mockVehicle = {
    name: 'Bike 1',
    model: 'MT-07',
    registration: 'ABC123',
    year: '2022',
    image: '/images/bike1.jpeg',
    bookingTime: new Date().toISOString(), // Booked now
    reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Reserved until 24 hours later
  };

  const [returnDetails, setReturnDetails] = useState({
    vehicle: mockVehicle, // Mocked vehicle details
    returnDateTime: '', // This will be set on form submission
  });

  const handleReturn = () => {
    const currentDateTime = new Date().toISOString(); // Get the current time as the return time

    const bookingTime = new Date(returnDetails.vehicle.bookingTime); // Get booking time
    const returnTime = new Date(currentDateTime); // Get the exact return time
    const timeDiff = (returnTime - bookingTime) / (1000 * 60 * 60); // Calculate hours difference
    const fine = timeDiff > 24 ? (timeDiff - 24) * 50 : 0; // Example fine: 50 Rands per hour late

    // Set the current time as return date time
    setReturnDetails((prev) => ({
      ...prev,
      returnDateTime: currentDateTime,
    }));

    // Navigate to the ReturnConfirmation page with return details and fine
    navigate('/ReturnConfirmation', { state: { returnDetails: { ...returnDetails, returnDateTime: currentDateTime }, fine } });
  };

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <header className="desktop-header mb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
        <h1 className="text-xl font-bold">Return Vehicle</h1>
      </header>

      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Return Details</h2>
        <div className="flex mb-4">
          <img
            src={returnDetails.vehicle.image}
            alt={returnDetails.vehicle.name}
            className="w-24 h-24 object-cover"
          />
          <div className="ml-4">
            <h3 className="font-semibold">{returnDetails.vehicle.name}</h3>
            <p>Model: {returnDetails.vehicle.model}</p>
            <p>Registration: {returnDetails.vehicle.registration}</p>
            <p>Year: {returnDetails.vehicle.year}</p>
          </div>
        </div>

        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={handleReturn}
        >
          Submit Return
        </button>
      </div>
    </main>
  );
};

export default Returns;
