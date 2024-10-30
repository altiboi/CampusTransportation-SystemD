import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // Added faCheckCircle for paid status
import { fetchUserFines, handleFinePayment } from '../../api/functions'; // Import the above functions
import './UserFines.scss'; 
import { useAuth } from '../../contexts/AuthProvider';

function UserFines({ currentUser }) {
  const [fines, setFines] = useState([]);

  const loadFines = async () => {
    const userFines = await fetchUserFines(currentUser?.uid);
    setFines(userFines || []); // Fallback to an empty array if undefined
    console.log(userFines);
  };
  

  useEffect(() => {
    loadFines();
  }, [currentUser]);

  const handlePayment = async (fineID) => {
    await handleFinePayment(fineID);
    await loadFines();
  };

  // Calculate overdue time
  const calculateOverdueTime = (dueReturnAt, returnedAt) => {
    const dueDate = new Date(dueReturnAt);
    const returnDate = new Date(returnedAt);
    const overdueTime = returnDate - dueDate; // In milliseconds

    if (overdueTime > 0) {
      const hoursOverdue = Math.ceil(overdueTime / (1000 * 60 * 60));
      return hoursOverdue > 1 ? `${hoursOverdue} hours overdue` : 'about an hour overdue';
    }
    return 'Returned on time';
  };

  const handleBackClick = () => {
    // Go back to the previous page
    window.history.back();
  };

  return (
    <main className='fines-main-container'>
      <section className='fines-upper-part mb-10 '>
        <h2>Manage and Pay your Fines</h2>
      </section>
      <section className='fines-lower-part'>
        <button
          className='absolute top-5 left 6 p-2 text-gray-600 hover:text-gray-800'
           aria-label="Back"
          onClick={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} className='text-xl' />
        </button>

        {fines.length > 0 ? (
          fines.map((fine) => (
            <section className='fines-upper-card' key={fine.id}>
              <Card className="fines-card">
                <section>
                  <div className='amount'>
                    <span>Amount</span>
                    <h2 className="fines-card-title">R {fine.amount}</h2>
                  </div>
                
                  {fine.rentalDetails && (
                    <div className="rental-details">
                      <span>Details</span>
                      <p>Fine Issued: {new Date(fine.issuedAt).toLocaleDateString()}</p>
                      <p>Reason: Fine {calculateOverdueTime(fine.rentalDetails.dueReturnAt, fine.rentalDetails.returnedAt)}</p>
                    </div>
                  )}
                </section>
              </Card>
              <section className='fines-details'>
                {!fine.paid ? (
                  <button 
                    className='button' 
                    onClick={() => handlePayment(fine.id)}
                  >
                    Pay Now
                  </button>
                ) : (
                  <span className="paid-status">
                    <FontAwesomeIcon icon={faCheckCircle} /> Paid
                  </span>
                )}
              </section>
            </section>
          ))
        ) : (
          <section className='fines-upper-part '>
            <p>No fines found</p>
          </section>
        )}
      </section>    
    </main>
  );
}

export default UserFines;