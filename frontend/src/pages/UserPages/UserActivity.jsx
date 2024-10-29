import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import './UserActivity.scss';
import { useAppContext } from "../../contexts/AppContext";
import { getUserRentals } from '../../api/functions';
import { useAuth } from '../../contexts/AuthProvider';
import bike from "../../assets/bike.svg";
import scooter from "../../assets/scooter.svg";
import skateBoard from "../../assets/skateBoard.svg";
import bus from "../../assets/bus.png";

function UserActivity({ currentUser }) {
  const { setTitle, setTask } = useAppContext();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingRentals, setUpcomingRentals] = useState([]);
  const [currentRentals, setCurrentRentals] = useState([]);
  const [historicalRentals, setHistoricalRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Activity");
    setTask(0);
  }, [setTitle, setTask]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const rentals = await getUserRentals(currentUser?.uid);
        const now = new Date();

        // Filter rentals into upcoming, current, and history
        const upcoming = rentals.filter(rental => new Date(rental.rentedAt) > now);
        const current = rentals.filter(rental =>
          new Date(rental.rentedAt) <= now &&
          new Date(rental.dueReturnAt) > now &&
          rental.returnedAt === null
        );
        const historical = rentals.filter(rental => rental.returnedAt !== null);

        setUpcomingRentals(upcoming);
        setCurrentRentals(current);
        setHistoricalRentals(historical);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rentals:", error);
        setLoading(false);
      }
    };

    fetchRentals();
  }, [currentUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <p>Loading rentals...</p>;
  }

  const getVehicleImage = (type) => {
    switch (type) {
      case "bike":
        return bike;
      case "scooter":
        return scooter;
      case "skateboard":
        return skateBoard;
      default:
        return null;
    }
  };

  return (
    <main className='activity-main-container'>
      <section className='activity-upper-part'>
        <h2>View your recent activity</h2>
        <div className='tab-buttons'>
          <button
            className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => handleTabChange('current')}
          >
            Current
          </button>
          <button
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleTabChange('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleTabChange('history')}
          >
            History
          </button>
        </div>
      </section>

      {/* Upcoming Rentals */}
      <section className={`activity-content ${activeTab === 'upcoming' ? 'show' : 'hide'}`}>
        <section className='activity-title'>
          <h2 className='activity-title-text'>Upcoming</h2>
        </section>
        <section className='activity-card-section'>
          {upcomingRentals.length > 0 ? (
            upcomingRentals.map((rental) => (
              <section key={rental.id} className='activity-upper-card'>
                <Card className="activity-card">
                  <section className='image'>
                    <img src={getVehicleImage(rental.type)} alt={rental.type} className="vehicle-card-image" />
                  </section>
                  <section className='details'>
                    <h2 className="activity-card-title">{rental.type} reserved</h2>
                    <h2 className='activity-time'>Rental Period: {new Date(rental.rentedAt).toLocaleTimeString()} - {new Date(rental.dueReturnAt).toLocaleTimeString()}</h2>
                  </section>
                  <section className='time'>
                    <span>
                      <h2 className='activity-place'>Date</h2>
                    </span>
                    <h2 className='activity-place'>{new Date(rental.rentedAt).toLocaleDateString()}</h2>
                  </section>
                </Card>
              </section>
            ))
          ) : (
            <p>No upcoming rentals.</p>
          )}
        </section>
      </section>

      {/* Current Rentals */}
      <section className={`activity-content ${activeTab === 'current' ? 'show' : 'hide'}`}>
        <section className='activity-title'>
          <h2 className='activity-title-text'>Current</h2>
        </section>
        <section className='activity-card-section'>
          {currentRentals.length > 0 ? (
            currentRentals.map((rental) => (
              <section key={rental.id} className='activity-upper-card'>
                <Card className="activity-card">
                  <section className='image'>
                    <img src={getVehicleImage(rental.type)} alt={rental.type} className="vehicle-card-image" />
                  </section>
                  <section className='details'>
                    <h2 className="activity-card-title">You are currently renting a {rental.type}</h2>
                    <h2 className='activity-time'>Rental Period: {new Date(rental.rentedAt).toLocaleTimeString()} - {new Date(rental.dueReturnAt).toLocaleTimeString()}</h2>
                  </section>
                  <section className='time'>
                    <span>
                      <h2 className='activity-place'>Date</h2>
                    </span>
                    <h2 className='activity-place'>{new Date(rental.rentedAt).toLocaleDateString()}</h2>
                  </section>
                </Card>
              </section>
            ))
          ) : (
            <p>No current rentals.</p>
          )}
        </section>
      </section>

      {/* Rental History */}
      <section className={`activity-content ${activeTab === 'history' ? 'show' : 'hide'}`}>
        <section className='activity-title'>
          <h2 className='activity-card-title activity-title-text'>History</h2>
        </section>
        <section className='activity-card-section'>
          {historicalRentals.length > 0 ? (
            historicalRentals.map((rental) => (
              <section key={rental.id} className='activity-upper-card'>
                <Card className="activity-card">
                  <section className='image'>
                    <img src={getVehicleImage(rental.type)} alt={rental.type} className="vehicle-card-image" />
                  </section>
                  <section className='details'>
                    <h2 className="activity-card-title">You booked {rental.type}</h2>
                    <h2 className='activity-place'>{new Date(rental.rentedAt).toLocaleDateString()}</h2>
                  </section>
                  <section className='time'>
                    <h2 className='activity-time'>{new Date(rental.rentedAt).toLocaleTimeString()} - {new Date(rental.dueReturnAt).toLocaleTimeString()}</h2>
                  </section>
                </Card>
              </section>
            ))
          ) : (
            <p>No rental history.</p>
          )}
        </section>
      </section>
    </main>
  );
}

export default UserActivity;
