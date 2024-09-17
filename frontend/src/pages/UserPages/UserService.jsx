import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faLocationDot, faRoute, faBicycle, faClipboardList, faCalendarCheck, faTicket, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; 

import './UserService.css'; 
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";


function UserService() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Services");
    setTask(1);
  }, [setTitle, setTask]);
  return (
    <main className='user-service-container'>
      <section className='header-section'>

        <section className="header-title title-main w-full pl-2 pt-2 ">
            Go Anywhere!
        </section>
        <section className='card-group'>
          <section className='card-item'>
            <Card className="card card-highlight">
              <section className='card-content'>
                <span className='card-heading'>Trip</span>
              </section>
              <section className='card-icon'>
                <FontAwesomeIcon icon={faRoute} className='icon-large' />
              </section>
            </Card>
          </section>
       
          <section className="card-item">
            <Card className="card card-highlight">
              <section className='card-content'>
                <span className='card-heading'>Nearby Rental Stations</span>
              </section>
              <section className='card-icon'>
                <FontAwesomeIcon icon={faMapMarkerAlt} className='icon-large' />
              </section>
            </Card>
          </section>
        </section>
      </section>

      <section className='actions-section'>
        <section className='actions-title'>
          <h2 className='title-main pl-2'>Get anything done with a click!</h2>
        </section>
        <section className='actions-group'>
          <Card className="action-card">
            <h2 className="card-heading">Rent</h2>
            <section className='card-icon'>
              <FontAwesomeIcon icon={faBicycle} className='icon-medium' />
            </section>
          </Card>
          <Card className="action-card">
            <h2 className="card-heading">Bus Schedule</h2>
            <section className='card-icon'>
              <FontAwesomeIcon icon={faClipboardList} className='icon-medium' />
           
            </section>
          </Card>
          <Card className="action-card">
            <h2 className="card-heading">Reserve</h2>
            <section className='card-icon'>
              <FontAwesomeIcon icon={faCalendarCheck} className='icon-medium' />
            </section>
          </Card>

          <Card className="action-card">
            <Link to={'/UserFines'}  className="w-full h-full">
              <h2 className="card-heading">Fines</h2>
              <section className='card-icon'>
                <FontAwesomeIcon icon={faTicket} className='icon-medium' />
              </section>
            </Link>
          </Card>
          <Card className="action-card">
          <Link to={'/Returns'}  className="w-full h-full">
            <h2 className="card-heading">Returns</h2>
            <section className='card-icon'>
              <FontAwesomeIcon icon={faRotateLeft} className='icon-medium' />
            </section>
            </Link>
          </Card>
          <Card className="action-card">
            <section className='card-content'>
              <span className='card-heading'>Campus Map</span>
            </section>
            <section className='card-icon'>
              <FontAwesomeIcon icon={faLocationDot} className='icon-medium' />
            </section>
          </Card>
        </section>
      </section>
    </main>
  );
}

export default UserService;