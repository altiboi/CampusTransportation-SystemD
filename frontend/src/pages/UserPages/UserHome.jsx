import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import car from '../../assets/car.webp';
import find from '../../assets/find.jpg';
import bicycle from '../../assets/bicycle.avif';
import map from '../../assets/map.webp';
import schedule from '../../assets/schedule.webp';
import fine from '../../assets/fine.avif';
import "./UserHome.scss";

function UserHome() {
  return (
    <main className="Home-container">
      <section className="upper-part">
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
        </section>

        <section className="upper-cards">
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
      </section>

      <section className="middle-apart">
        <Link to="/UserFind" className="link">
          <Card className="middle-card">
            <section className="card-icon">
              <img src={map} alt="Campus map icon" className="icon" />
            </section>
            <section className="card-description">
              <p>Campus Map</p>
            </section>
          </Card>
        </Link>
      </section>

      <section className="lower-part">
        <section className="lower-Title">
          <h2 className="card-title title">Suggestions</h2>
        </section>
        <section className="lower-card">
          <Link to="" className="link">
            <Card className="lower-card">
              <section className="card-icon">
                <img src={bicycle} alt="Bicycle rental icon" className="icon" />
              </section>
              <h2 className="card-title">Rent Bike</h2>
            </Card>
          </Link>
          <Link to="/UserBuses" className="link">
            <Card className="lower-card">
              <section className="card-icon">
                <img src={schedule} alt="Bus schedule icon" className="icon" />
              </section>
              <h2 className="card-title">Bus Schedule</h2>
            </Card>
          </Link>
          <Link to="/UserFines" className="link">
            <Card className="lower-card">
              <section className="card-icon">
                <img src={fine} alt="Fines icon" className="icon" />
              </section>
              <h2 className="card-title">Fines</h2>
            </Card>
          </Link>
        </section>
      </section>
    </main>
  );
}

export default UserHome;
