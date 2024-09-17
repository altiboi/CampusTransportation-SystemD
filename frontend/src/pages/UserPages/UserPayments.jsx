import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'; // Solid icon
import { faApplePay } from '@fortawesome/free-brands-svg-icons'; // Brand icon
import Card from '../../components/Card';

import './UserPayments.scss'; 

function UserPayments() {
  return (
    <main className='user-payments-container'>
        <section className='header-payments-section'>
            <section className="header-payments-title w-full pl-2 pt-2">
            Payment Options
            </section>
            <section className='card-payments-group'>
            <section className='card-payments-item'>
                <Card className="card card-payments-highlight">
                <section className='card-payments-icon'>
                    <FontAwesomeIcon icon={faCreditCard} className='icon-large'/>
                </section>
                </Card>
            </section>
            <section className='card-payments-item'>
                <Card className="card card-payments-highlight">
                <section className='card-payments-icon'>
                    <FontAwesomeIcon icon={faApplePay} className='icon-large'/>
                </section>
                </Card>
            </section>
            <section className='card-payments-item'>
                <Card className="card card-payments-highlight">
                <section className='card-payments-content'>
                    <span className='card-payments-heading'>Add to Fees</span>
                </section>
                </Card>
            </section>
            </section>
        </section>

        <section className='actions-payments-middle-section'>
            <section className='actions-payments-title'>
                <h2 className='title-main pl-2'>Select Your Card</h2>
            </section>
            <section className='actions-payments-group'>
                <Card className="action-card">
                    <h2 className="card-payments-heading">The Card</h2>
                </Card>
            </section>
        </section>

        <section className='actions-payments-last-section'>
            <section className='action-payments-inner-upper-section'>
                <section className='actions-payments-title'>
                    <h5 className='title-main pl-2'>Custom Bag</h5>
                    <h5 className='title-main pl-2'>R50</h5>
                </section>
                <section className='actions-payments-title'>
                    <h5 className='title-main pl-2'>Delivery Charge</h5>
                    <h5 className='title-main pl-2'>R5</h5>
                </section>
            </section>
            <section className='actions-payments-title'>
                <h5 className='title-main pl-2'>Total Amount</h5>
                <h5 className='title-main pl-2'>R65</h5>
            </section>
            <section className='action-payments-inner-lower-section'>
                 <button>Continue</button>
            </section>
        </section>
    </main>
  );
}

export default UserPayments;
