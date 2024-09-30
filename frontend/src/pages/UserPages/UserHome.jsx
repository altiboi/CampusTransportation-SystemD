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
import "./UserHome.scss"; // Import custom CSS

function UserHome() {
  return (
    <main className="Home-container">
      <section className="upper-part">
        <section className="upper-cards">
          <Link to="/userRental" className="Links">
            <Card className="card ">
              <section className="card-icon">
              <FontAwesomeIcon icon={faTruck} className="icon" data-testid="icon-truck" />
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
              <FontAwesomeIcon icon={faLocationDot} className="icon" data-testid="icon-location-dot" />
              </section>
              <section className="card-content">
                <span className="card-title">Find</span>
              </section>
            </Card>
          </Link>
        </section>
      </section>

      <section className="middle-apart">
        <Link to={"/UserFind"} className="link">
          <Card className="middle-card">
              <section className="card-icon">
              <FontAwesomeIcon icon={faRoute} className="icon" data-testid="icon-route" />
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
          <Link to={""} className="link">
            <Card className="lower-card ">
              <section className="card-icon">
              <FontAwesomeIcon icon={faBicycle} className="icon" data-testid="icon-bicycle" />
              </section>
              <h2 className="card-title">Rent Bike</h2>
            </Card>
          </Link>
          <Link to={"/UserBuses"} className="link">
            <Card className="lower-card">
                <section className="card-icon">
                <FontAwesomeIcon icon={faClipboardList} className="icon" data-testid="icon-clipboard-list" />
                </section>
                <h2 className="card-title">Bus Schedule</h2>
            </Card>
          </Link>
          <Link to={'/UserFines'} className="link">
            <Card className="lower-card">
                <section className='card-icon'>
                <FontAwesomeIcon icon={faTicket} className="icon" data-testid="icon-ticket" />

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