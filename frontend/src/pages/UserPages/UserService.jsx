import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faLocationDot, faRoute, faBicycle, faClipboardList, faCalendarCheck, faTicket, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; 

import './UserService.scss'; 
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";
import Trip from '../../assets/Trip.png';
import rental from '../../assets/rental.png'
import car from '../../assets/car.webp';
import schedule from '../../assets/schedule.webp';
import Reserve from '../../assets/reserve.avif';
import fine from '../../assets/fine.avif';
import returns from '../../assets/return.webp'
import map from '../../assets/map.webp';


function UserService() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Services");
    setTask(0);
  }, [setTitle, setTask]);
  return (
    <main className='user-service-container'>
      <section className='header-section'>
        <section className="title-main w-full pl-2 pt-2 ">
            Go Anywhere!
        </section>
        <section className='card-group'>
          <section className='card-item'>
            <Link to="/userFind " className='link'>
              <Card className="card  border-none">
                  <section className='card-icon'>
                    <img src={Trip} alt="" className='icon-large' />
                  </section>
                  <section className='card-content'>
                    <span className='card-heading'>Trip</span>
                  </section>
              </Card>
            </Link>
          </section>
       
          <section className="card-item">
            <Link to={"/UserMap"} className='link'>
              <Card className="card  border-none">
                <section className='card-icon'>
                  <img src={rental} alt="" className='icon-large' />
                </section>
                <section className='card-content'>
                  <span className='card-heading'>Rental Stations</span>
                </section>
              </Card>
            </Link>
          </section>
        </section>
      </section>

      <section className='actions-section'>
        <section className='actions-title'>
          <h2 className='title-main pl-2'>Get anything done with a click!</h2>
        </section>
        <section className='actions-group'>
            <Card className="action-card">
              <Link to={""} className='Link'>
                <section className='headings'>
                  <h2 className="card-heading">Rent</h2>
                </section>
                <section className='card-icon'>
                <img src={car} alt="" className='icon-large' />
                </section>
                </Link>
            </Card>
            <Card className="action-card">
              <Link to={"/UserBuses"} className='Link'>
                <section className='headings'>
                    <h2 className="card-heading">Bus Schedule</h2>
                </section>
                <section className='card-icon'>
                <img src={schedule} alt="" className='icon-large' />
                </section>
              </Link>
            </Card>
            <Card className="action-card">
              <Link to={""} className='Link'>
                <section className='headings'>
                    <h2 className="card-heading">Reserve</h2>
                </section>
                <section className='card-icon'>
                <img src={Reserve} alt="" className='icon-large' />
                </section>
              </Link>
            </Card>

            <Card className="action-card">
              <Link to={'/UserFines'}  className="Link w-full h-full">
                <section className='headings'>
                  <h2 className="card-heading">Fines</h2>
                </section>
                <section className='card-icon'>
                <img src={fine} alt="" className='icon-large' />
                </section>
              </Link>
            </Card>
            <Card className="action-card">
            <Link to={'/Returns'}  className="Link w-full h-full">
              <section className='headings'>
                <h2 className="card-heading">Returns</h2>
              </section>
              <section className='card-icon'>
              <img src={returns} alt="" className='icon-large' />
              </section>
              </Link>
            </Card>
            <Card className="action-card">
            <Link to={"/UserMap"} className="Link">
              <section className='headings'>
                <span className='card-heading'>Campus Map</span>
              </section>
              <section className='card-icon'>
              <img src={map} alt="" className='icon-large' />
              </section>
              </Link>
            </Card>
        </section>
      </section>
    </main>
  );
}

export default UserService;