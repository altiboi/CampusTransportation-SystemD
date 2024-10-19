import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import car from '../../assets/car.webp';
import find from '../../assets/location.webp';
import fine from '../../assets/fine.avif';
import schedule from '../../assets/schedule.webp';
import rental from '../../assets/rental.png'
import "./UserHome.scss";
import bikeImage from "../../assets/bicycle.avif";
import { useAppContext } from "../../contexts/AppContext";
import {  getAllVehicles,addNewRentalAndUpdateVehicle } from '../../api/functions';
import { useAuth } from '../../contexts/AuthProvider';

function UserHome() {
  const { setTitle, setTask } = useAppContext();
  const [vehicles, setVehicles] = useState([]);
  const { currentUser, refreshCurrentUser } = useAuth(); 

  useEffect(() => {
    setTitle("Home");
    setTask(0);
    const fetchData = async () => {
      try {
        const vehiclesList = await getAllVehicles();
        setVehicles(vehiclesList);
      } catch (error) {
        console.error("Error fetching rental stations or vehicles:", error);
      }
    };

    fetchData();
  }, [setTitle, setTask]);

  const availableBike = vehicles.find(
    (vehicle) => vehicle.type === "bike" && vehicle.available
  );
  const Book= async () => {
    if (!currentUser) {
      console.error("User not authenticated.");
      return; // Prevent further action if currentUser is not available
    }

    try {
      console.log(currentUser);
      await addNewRentalAndUpdateVehicle(item.rentalStationID, item.type, currentUser.uid, item.id, 2);
      await refreshCurrentUser();
      console.log("you have booked a bike")
    } catch (error) {
      console.error("Error confirming rental: ", error);
    }
  };

  return (
    <main className="Home-container">
      <section className="container">
        <section className="upper">
          <section className="upper-cards">
            <Link to="/userRental" className="Links">
              <Card className="card">
                <section className="card-icon">
                  <img src={car} alt="Car icon for rental" className="icon" />
                </section>
                <section className="card-content">
                  <span className="card-title">Rent</span>
                </section>
              </Card>
            </Link>
            <Link to="/userFind" className="Links">
              <Card className="card">
                <section className="card-icon">
                  <img src={find} alt="Find icon" className="icon" />
                </section>
                <section className="card-content">
                  <span className="card-title">Find</span>
                </section>
              </Card>
            </Link>
          </section>         
          <section className="lower-cards">
            <section className="Title">
              <h2 className="title">Suggestions</h2>
            </section>
            <section className="cards">
              <Link to={"/UserMap"} className='Links'>
                <Card className="card">
                  <section className='card-content'>
                    <span className='card-title'>Rental Stations</span>
                  </section>
                  <section className='card-icon'>
                    <img src={rental} alt="" className='icon' />
                  </section>
                </Card>
              </Link>
              <Link to="/UserBuses" className="Links">
                <Card className="card">
                  <section className='card-content'>
                    <h2 className="card-title">Bus Schedule</h2>
                  </section>
                  <section className="card-icon">
                    <img src={schedule} alt="Bus schedule icon" className="icon" />
                  </section>
                </Card>
              </Link>
              <Link to={'/UserFines'} className="Links">
                <Card className="card">
                  <section className='card-content'>
                    <h2 className="card-title">Fines</h2>
                  </section>
                  <section className='card-icon'>
                    <img src={fine} alt="fines icon" className='icon' />
                  </section>
                </Card>
              </Link>
            </section>
          </section>
        </section>

        {/* Middle section to display bike details */}
        <section className="upper-part middle-part">
          <section className="upper-cards ">
            <Card className="cards">
              <div className="lower_card_part">
                <img
                  src={bikeImage}
                  alt="bike"
                  className="image"
                />
                {availableBike ? (
                  <div className="vehicle-details">
                  <span className="outer">
                    <span className="inner">Registration:</span>
                    <span className="inner">{availableBike.registration}</span>
                  </span>

                  <span className="outer">
                    <span className="inner">Make:</span>
                    <span className="inner">{availableBike.make}</span>
                  </span>

                  <span className="outer">
                    <span className="inner">Model:</span>
                    <span className="inner">{availableBike.model}</span>
                  </span>

                  <span className="outer">
                    <span className="inner">Year:</span>
                    <span className="inner">{availableBike.year}</span>
                  </span>
                    <div className="option">
                      <button
                        className="px-4 py-2 bg-black text-white rounded"
                        onClick={Book}
                      >
                        Book now
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-200 text-black rounded"
                        
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="nobike">No available bikes at the moment :(</p>
                )}
              </div>
            </Card>
          </section>
        </section>

        <section className="lower-part">
          <section className="upper-cards">
            <Link to="/userRental" className="Links">
              <Card className="card">
                <section className="card-icon">
                  <img src={car} alt="Car icon for rental" className="icon" />
                </section>
                <section className="card-content">
                  <span className="card-title">Rent</span>
                </section>
              </Card>
            </Link>
            <Link to="/userFind" className="Links">
              <Card className="card">
                <section className="card-icon">
                  <img src={find} alt="Find icon" className="icon" />
                </section>
                <section className="card-content">
                  <span className="card-title">Find</span>
                </section>
              </Card>
            </Link>
          </section>  
          <section className="lower-cards">
            <section className="Title">
              <h2 className="title">Suggestions</h2>
            </section>
            <section className="cards">
              <Link to={"/UserMap"} className='Links'>
                <Card className="card">
                  <section className='card-content'>
                    <span className='card-title'>Rental Stations</span>
                  </section>
                  <section className='card-icon'>
                    <img src={rental} alt="" className='icon' />
                  </section>
                </Card>
              </Link>
              <Link to="/UserBuses" className="Links">
                <Card className="card">
                  <section className='card-content'>
                    <h2 className="card-title">Bus Schedule</h2>
                  </section>
                  <section className="card-icon">
                    <img src={schedule} alt="Bus schedule icon" className="icon" />
                  </section>
                </Card>
              </Link>
              <Link to={'/UserFines'} className="Links">
                <Card className="card">
                  <section className='card-content'>
                    <h2 className="card-title">Fines</h2>
                  </section>
                  <section className='card-icon'>
                    <img src={fine} alt="fines icon" className='icon' />
                  </section>
                </Card>
              </Link>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}

export default UserHome;
