import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faLocationDot,
  faRoute,
  faTicket,
  faBicycle,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import "./UserHome.css"; // Import custom CSS

function UserHome() {
  return (
    <main className="main-container">
      <section className="upper-part">
        <section className="w-1/2 ">
          <Link to="/userRental">
            <Card className="card upper-card border-none">
              <section className="card-icon">
                <FontAwesomeIcon icon={faTruck} className="icon" />
              </section>
              <section className="card-content">
                <span className="card-title">Rent</span>
              </section>
            </Card>
          </Link>
        </section>

        <section className="w-1/2">
          <Link to="/userFind">
            <Card className="card upper-card border-none">
              <section className="card-icon">
                <FontAwesomeIcon icon={faLocationDot} className="icon" />
              </section>
              <section className="card-content">
                <span className="card-title">Find</span>
              </section>
            </Card>
          </Link>
        </section>
      </section>

      <section className="middle-apart">
        <Card className="middle-card w-full">
          <Link to={"/UserMap"} className="LINK w-full">
            <section className="card-icon">
              <FontAwesomeIcon icon={faRoute} className="icon" />
            </section>
            <section className="card-description">
              <p>Campus Map</p>
            </section>
          </Link>
        </Card>
      </section>

      <section className="lower-part">
        <section className="w-full p-2">
          <h2 className="card-title title">Suggestions</h2>
        </section>
        <section className="lower-card-section w-full flex flex-row ">
          <Card className="lower-card  w-1/2">
            <section className="card-icon">
              <FontAwesomeIcon icon={faBicycle} className="icon" />
            </section>
            <h2 className="card-title">Rent Bike</h2>
          </Card>
          <Card className="lower-card w-1/2">
            <Link to={"/UserBuses"}>
              <section className="card-icon">
                <FontAwesomeIcon icon={faClipboardList} className="icon" />
              </section>
              <h2 className="card-title">Bus Schedule</h2>
            </Link>
          </Card>
          <Card className="lower-card w-1/2">
            <Link to={'/UserFines'}>
              <h2 className="card-title">Fines</h2>
              <section className='card-icon'>
                <FontAwesomeIcon icon={faTicket} className='icon' />
              </section>
            </Link>
          </Card>
        </section>
      </section>
    </main>
  );
}

export default UserHome;
