import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the back icon
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./UserFrom.scss";
import { useAppContext } from "../../contexts/AppContext";

function UserFrom() {
  const { setTitle, setTask } = useAppContext();
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");

  useEffect(() => {
    setTitle("From");
    setTask(0);
  }, [setTitle, setTask]);

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value === "other") {
      // Keep the customDestination as it is for "other" option
      setCustomDestination(customDestination || ""); // Set default if empty
    } else {
      // For other options, clear the customDestination
      setCustomDestination(value);
    }
  };

  const handleCustomDestinationChange = (e) => {
    setCustomDestination(e.target.value);
    // Update the destination to "other" if the custom input is being used
    if (e.target.value) {
      setDestination("other");
    }
  };
    const handleBackClick = () => {
        // Go back to the previous page
        window.history.back();
    };

  return (
    <main className="user-where-to-container">
        <section className="find-upper-part">
            <section className="find-Map find-w-1/2">The Map</section>
        </section>
      <section className="title w-full">
        <button data-testid="button"
            className=' top-5 left 4 p-2 text-gray-600 hover:text-gray-800'
            onClick={handleBackClick}
            >
                <FontAwesomeIcon icon={faArrowLeft} className='text-xl' />
        </button>
        <h1>Current Location</h1>
      </section>
      <section className="user-where-to-input-section w-full">
     
        <Card className="user-where-to-card">
          <section className="card-icon">
            <FontAwesomeIcon icon={faLocationDot} className="icon" />
          </section>
          <section className="card-content">
            <input
              type="text"
              className="user-where-to-custom-input"
              placeholder="Enter custom Location"
              value={customDestination}
              onChange={handleCustomDestinationChange}
            />
          </section>
          <section className="button">
           <button className="btn">Go</button>
          </section>
        </Card>
        <section className="user-where-to-select-section w-full">
        <select
          className="user-where-to-select-dropdown"
          value={destination}
          onChange={handleDropdownChange}
        >
          <option value="" disabled>Select Location</option>
          <option value="the-matrix">The Matrix</option>
          <option value="flower-hall">Flower Hall</option>
          <option value="wss3">WSS3</option>
          <option value="umthombo-building">Umthombo Building</option>
          <option value="bozoli">Bozoli</option>
          <option value="other">Other</option>
        </select>
      </section>
      </section>
    </main>
  );
}

export default UserFrom;
