import React from 'react';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faRoute, faPersonWalking, faCar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './UserActivity.scss'; 
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";


function UserActivity() {
    const { setTitle, setTask } = useAppContext();

    useEffect(() => {
      setTitle("Activity");
      setTask(1);
    }, [setTitle, setTask]);
  return (
    <main className='activity-main-container'>

        <section className='activity-upper-part'>
           <h2>View your recent activity</h2>
        </section>

        <section className='activity-middle-part'>
            <section className='activity-title'>
                <h2 className='activity-title-text'>Upcoming</h2>
            </section>               
            <section className='activity-upper-section'>
                <section className='activity-upper-card'>
                    <Card className="activity-card">
                        <section>
                            <h2 className="activity-card-title">bike1 reserved</h2>
                            <h2 className='activity-place'>11/08/2024</h2>
                            <h2 className='activity-time'>12:00pm-13:00pm</h2>
                        </section>
                    </Card>
                </section>
                <section className='activity-upper-card'>
                    <Card className="activity-card">
                        <section>
                            <h2 className="activity-card-title">bike1 reserved</h2>
                            <h2 className='activity-place'>11/08/2024</h2>
                            <h2 className='activity-time'>12:00pm-13:00pm</h2>
                        </section>
                    </Card>
                </section>
                <section className='activity-upper-card'>
                    <Card className="activity-card">
                        <section>
                            <h2 className="activity-card-title">bike1 reserved</h2>
                            <h2 className='activity-place'>11/08/2024</h2>
                            <h2 className='activity-time'>12:00pm-13:00pm</h2>
                        </section>
                    </Card>
                </section>
            </section>
        </section>    

        <section className='activity-lower-part'>
            <section className='activity-title'>
                <h2 className='activity-card-title activity-title-text'>History</h2>
            </section>  
            <section className='activity-card-section'>
                <section className='activity-upper-card'>
                    <Card className="activity-card">
                        <section>
                            <h2 className="activity-card-title">You booked bike1</h2>
                            <h2 className='activity-place'>11/08/2024</h2>
                            <h2 className='activity-time'>12:00pm-13:00pm</h2>
                        </section>
                    </Card>
                </section>
                <section className='activity-upper-card'>
                    <Card className="activity-card">
                        <section>
                            <h2 className="activity-card-title">You booked bike1</h2>
                            <h2 className='activity-place'>11/08/2024</h2>
                            <h2 className='activity-time'>12:00pm-13:00pm</h2>
                        </section>
                    </Card>
                </section>
                <section className='activity-upper-card'>
                    <Card className="activity-card">
                        <section>
                            <h2 className="activity-card-title">You booked bike1</h2>
                            <h2 className='activity-place'>11/08/2024</h2>
                            <h2 className='activity-time'>12:00pm-13:00pm</h2>
                        </section>
                    </Card>
                </section>
            </section>
        </section>
    </main>
  );
}

export default UserActivity;
