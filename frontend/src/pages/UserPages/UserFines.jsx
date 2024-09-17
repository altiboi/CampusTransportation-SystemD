import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { fetchUserFines, handleFinePayment } from '../../api/functions'; // Import the above functions
import './UserFines.scss'; 
import { useAuth } from '../../contexts/AuthProvider';

function UserFines() {
  const [fines, setFines] = useState([]);
  const { currentUser } = useAuth();

  // Fetch fines when the component mounts
  useEffect(() => {
    const loadFines = async () => {
      const userFines = await fetchUserFines(currentUser?.id);
      setFines(userFines);
    };
    loadFines();
  }, []);

  return (
    <main className='fines-main-container'>
      <section className='fines-upper-part'>
        <h2>Manage and Pay your Fines</h2>
      </section>
      <section className='fines-lower-part'>
        {fines.length > 0 ? (
          fines.map((fine) => (
            <section className='fines-upper-card' key={fine.id}>
              <Card className="fines-card">
                <section>
                  <h2 className="fines-card-title">{fine.description}</h2>
                </section>
              </Card>
              <section className='fines-details'>
                <p>{new Date(fine.issuedAt.seconds * 1000).toLocaleDateString()}</p>
                {!fine.paid ? (
                  <button 
                    className='button' 
                    onClick={() => handleFinePayment(fine.id)}
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
          <p>No fines found</p>
        )}
      </section>    
    </main>
  );
}

export default UserFines;