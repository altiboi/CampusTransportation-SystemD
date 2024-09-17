import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import './UserActivity.scss';
import { useAppContext } from "../../contexts/AppContext";

function UserActivity() {
  const { setTitle, setTask } = useAppContext();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'history', or 'current'

  useEffect(() => {
    setTitle("Activity");
    setTask(1);
  }, [setTitle, setTask]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

      <section className={`activity-content ${activeTab === 'upcoming' ? 'show' : 'hide'}`}>
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
          {/* Repeat the above section for more cards */}
        </section>
      </section>

      <section className={`activity-content ${activeTab === 'current' ? 'show' : 'hide'}`}>
        <section className='activity-title'>
          <h2 className='activity-title-text'>Current</h2>
        </section>
        <section className='activity-card-section'>
          <section className='activity-upper-card'>
            <Card className="activity-card">
              <section>
                <h2 className="activity-card-title">You are using bike2</h2>
                <h2 className='activity-place'>15/09/2024</h2>
                <h2 className='activity-time'>10:00am-11:00am</h2>
              </section>
            </Card>
          </section>
          {/* Repeat the above section for more cards */}
        </section>
      </section>

      <section className={`activity-content ${activeTab === 'history' ? 'show' : 'hide'}`}>
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
          {/* Repeat the above section for more cards */}
        </section>
      </section>
    </main>
  );
}

export default UserActivity;
