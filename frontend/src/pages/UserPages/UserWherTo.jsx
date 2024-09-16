import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./UserWhereTo.scss";
import { useAppContext } from "../../contexts/AppContext";

function UserWhereTo() {
  const { setTitle, setTask } = useAppContext();
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");

  useEffect(() => {
    setTitle("whereTo");
    setTask(1);
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

  return (
    <main className="user-where-to-container">
        <section className="find-upper-part">
            <section className="find-Map find-w-1/2">The Map</section>
        </section>
      <section className="title w-full">
        <h1>Where To</h1>
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
              placeholder="Enter custom destination"
              value={customDestination}
              onChange={handleCustomDestinationChange}
            />
          </section>
        </Card>
        <section className="user-where-to-select-section w-full">
        <select
          className="user-where-to-select-dropdown"
          value={destination}
          onChange={handleDropdownChange}
        >
          <option value="" disabled>Select Destination</option>
          <option value="the-matrix">The Matrix</option>
          <option value="flower-hall">Flower Hall</option>
          <option value="wss3">WSS3</option>
          <option value="uthombo-building">Uthombo Building</option>
          <option value="bozoli">Bozoli</option>
          <option value="other">Other</option>
        </select>
      </section>
      </section>
    </main>
  );
}

export default UserWhereTo;
