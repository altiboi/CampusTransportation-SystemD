import React from 'react';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faRoute, faPersonWalking, faCar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './UserFines.scss'; 

function UserFines() {
  return (
    <main className='fines-main-container'>

        <section className='fines-upper-part'>
           <h2>Manage and Pay your Fines</h2>
        </section>
        <section className='fines-lower-part'>           
                <section className='fines-upper-card'>
                    <Card className="fines-card">
                        <section>
                            <h2 className="fines-card-title">Bike was not returned on time</h2>
                        </section>
                    </Card>
                    <section className='fines-details'> 
                        <p>10/08/2024</p>
                        <button className='button'><Link to={'/UserPayments'} className='w-full'>Pay</Link></button>
                    </section>
                </section>
                <section className='fines-upper-card'>
                    <Card className="fines-card">
                        <section>
                            <h2 className="fines-card-title">Bike was not returned on time</h2>
                        </section>
                    </Card>
                    <section className='fines-details'> 
                        <p>10/08/2024</p>
                        <button className='button'><Link to={'/UserPayments'} className='w-full'>Pay</Link></button>
                    </section>
                </section>
                <section className='fines-upper-card'>
                    <Card className="fines-card">
                        <section>
                            <h2 className="fines-card-title">Bike was not returned on time</h2>
                        </section>
                    </Card>
                    <section className='fines-details'> 
                        <p>10/08/2024</p>
                        <button className='button'><Link to={'/UserPayments'} className='w-full'>Pay</Link></button>
                    </section>
                </section>
                <section className='fines-upper-card'>
                    <Card className="fines-card">
                        <section>
                            <h2 className="fines-card-title">Bike was not returned on time</h2>
                        </section>
                    </Card>
                    <section className='fines-details'> 
                        <p>10/08/2024</p>
                        <button className='button'><Link to={'/UserPayments'} className='w-full'>Pay</Link></button>
                    </section>
                </section>
                <section className='fines-upper-card'>
                    <Card className="fines-card">
                        <section>
                            <h2 className="fines-card-title">Bike was not returned on time</h2>
                        </section>
                    </Card>
                    <section className='fines-details'> 
                        <p>10/08/2024</p>
                        <button className='button'><Link to={'/UserPayments'} className='w-full'>Pay</Link></button>
                    </section>
                </section>
                <section className='fines-upper-card'>
                    <Card className="fines-card">
                        <section>
                            <h2 className="fines-card-title">Bike was not returned on time</h2>
                        </section>
                    </Card>
                    <section className='fines-details'> 
                        <p>10/08/2024</p>
                        <button className='button'><Link to={'/UserPayments'} className='w-full'>Pay</Link></button>
                    </section>
                </section>
        </section>    
    </main>
  );
}

export default UserFines;
