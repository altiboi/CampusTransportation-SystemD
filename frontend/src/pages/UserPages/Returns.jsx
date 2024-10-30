// Returns.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Returns.css';
import { useAppContext } from "../../contexts/AppContext";
import { getRentalDetails, returnVehicleAndIssueFine } from '../../api/functions';
import { useAuth } from '../../contexts/AuthProvider';

const Returns = ({ currentUser }) => {
  const { setTitle, setTask } = useAppContext();
  const navigate = useNavigate();
  const [rentalDetails, setRentalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { refreshCurrentUser } = useAuth();

  useEffect(() => {
    setTitle("Return Vehicle");
    setTask(0);
    
    const fetchRentalDetails = async () => {
      try {
        if (!currentUser?.currentRentalID) {
          setError("No active rental found.");
          setLoading(false);
          return;
        }
        const rental = await getRentalDetails(currentUser.currentRentalID);
        if (!rental) {
          setError("No active rental found.");
        } else {
          setRentalDetails(rental);
        }
      } catch (err) {
        setError("Error fetching rental details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [currentUser, setTitle, setTask]);

  const handleReturn = async () => {
    try {
      const returnData = await returnVehicleAndIssueFine(rentalDetails.rentalID, rentalDetails.vehicleID);
      await refreshCurrentUser();

      navigate('/ReturnConfirmation', {
        state: {
          returnDetails: returnData.rentalDetails,
          fineDetails: returnData.fine,
          vehicle: rentalDetails.vehicle
        }
      });
    } catch (err) {
      setError("Error processing the return.");
      console.error(err.message);
    }
  };

  const getVehicleImage = (type) => {
    switch (type) {
      case "bike":
        return bikeImage;
      case "scooter":
        return scooter;
      case "skateboard":
        return skateBoard;
      default:
        return null;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontWeight: 'bold' }}>{error}</p>
      </div>
    );
  }

  const formatDueReturnAt = (dueReturnAt) => {
    const date = new Date(dueReturnAt);
    return date.toLocaleString();
  };

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <header className="desktop-header mb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
        <h1 className="text-xl font-bold">Return Vehicle</h1>
      </header>

      {rentalDetails && (
        <div className="mb-6 p-4 border rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Return Details</h2>
          <div className="flex mb-4">
            <img
              src={getVehicleImage(rentalDetails.vehicle.type)}
              alt={`${rentalDetails.vehicle.make} ${rentalDetails.vehicle.model}`}
              className="w-24 h-24 object-cover"
            />
            <div className="ml-4">
              <h3 className="font-semibold">{rentalDetails.vehicle.make} {rentalDetails.vehicle.model}</h3>
              <p>Rental Station: {rentalDetails.rentalStation.name}</p>
              <p>Rental Due At: {formatDueReturnAt(rentalDetails.dueReturnAt)}</p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={handleReturn}
          >
            Submit Return
          </button>
        </div>
      )}
      {!rentalDetails && !error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontWeight: 'bold' }}>You don't currently have a vehicle rented.</p>
      </div>
      )}
    </main>
  );
};

export default Returns;