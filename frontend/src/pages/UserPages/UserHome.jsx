import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import car from '../../assets/car.webp';
import find from '../../assets/location.webp';
import fine from '../../assets/fine.avif';
import schedule from '../../assets/schedule.webp';
import rental from '../../assets/rental.png'
import "./UserHome.scss";
import bike from "../../assets/bicycle.avif";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";

function UserHome() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Home");
    setTask(0);
  }, [setTitle, setTask]);
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
              <Link to={'/UserFines'}  className="Links">
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



        <section className="upper-part middle-part">
          <section className="upper-cards ">
            <Card className="cards">
                  <div className="text text-lg font-semibold mb-2 text-center">
                    Bike Usage
                  </div>
                  <div className="lower_card_part">
                    <img
                      src={bike}
                      alt="bike image"
                      className="image"
                    />
                    <div className="option">
                        <Link 
                          className=" px-4 py-2 bg-black text-white rounded"
                        >
                          Book now
                        </Link>
                        <Link middle-part
                          
                          className="px-4 py-2 bg-gray-200 text-black rounded"
                        >
                          Reserve
                        </Link>
                    </div>
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
              <Link to={'/UserFines'}  className="Links">
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
