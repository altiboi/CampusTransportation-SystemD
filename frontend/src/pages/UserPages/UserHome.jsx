import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faLocationDot,
  faRoute,
  faBicycle,
  faClipboardList,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import "./UserHome.css"; // Import custom CSS

function UserHome() {
  return (
    <main className="main-container">
      <section className="upper-part">
        <section className="w-1/2">
          <Link to="/userRental">
            <Card className="card upper-card">
              <section className="card-content">
                <span className="card-title">Rent</span>
              </section>
              <section className="card-icon">
                <FontAwesomeIcon icon={faTruck} className="icon" />
              </section>
            </Card>
          </Link>
        </section>

        <section className="w-1/2">
          <Link to="/userFind">
            <Card className="card upper-card">
              <section className="card-content">
                <span className="card-title">Find</span>
              </section>
              <section className="card-icon">
                <FontAwesomeIcon icon={faLocationDot} className="icon" />
              </section>
            </Card>
          </Link>
        </section>
      </section>

      <section className="middle-apart">
        <Card className="middle-card w-full">
          <Link to={"/userFind"} className="LINK w-full">
            <section className="card-description">
              <p>Navigate Wits, Your Way!</p>
            </section>
            <section className="card-icon">
              <FontAwesomeIcon icon={faRoute} className="icon" />
            </section>
          </Link>
        </Card>
      </section>

      <section className="lower-part ">
        <section className="w-full p-2">
          <h2 className="card-title title">Suggestions</h2>
        </section>
        <section className="lower-card-section  w-full flex flex-row justify-around">
          <Card className="lower-card">
            <h2 className="card-title">Rent Bike</h2>
            <section className="card-icon">
              <FontAwesomeIcon icon={faBicycle} className="icon" />
            </section>
          </Card>
          <Card className="lower-card">
            <Link to={"/UserBuses"}>
              <h2 className="card-title">Bus Schedule</h2>
              <section className="card-icon">
                <FontAwesomeIcon icon={faClipboardList} className="icon" />
              </section>
            </Link>
          </Card>
          <Card className="lower-card">
            <section className="card-content">
            <Link to={'/UserMap'}><span className="card-title">Campus Map</span></Link>
            </section>
            <section className="card-icon">
              <FontAwesomeIcon icon={faLocationDot} className="icon" />
            </section>
          </Card>
        </section>
      </section>
    </main>
  );
}

export default UserHome;
