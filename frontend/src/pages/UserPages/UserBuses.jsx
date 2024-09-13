import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from '@fortawesome/free-solid-svg-icons'; // Import the correct icon
import './UserBuses.scss'; // Import custom CSS


function UserBuses() {
    const image = '/images/images.png';
  return (
    <main className='bus-main-container'>
        <section className='bus-upper-part'>
            <section className='bus-upper-content w-1/2'>
             <p>Get the latest bus Schedule!</p>
            </section>
        </section>

        <section className='bus-middle-part'>
            <Card className="bus-middle-card w-full">
            <img src={image} alt="Bus schedule" className="bus-image" />
            </Card>
        </section>

        <section className='bus-lower-part'>
            <Card className="bus-lower-card">
               <h5>View</h5>
            </Card>
            <Card className="bus-lower-card">
               <h5>Download</h5>
            </Card>
        </section>
    </main>
  );
}

export default UserBuses;
