import React, { useState, useEffect } from "react";
import { getAllLocations } from "../../api/functions"; // Import your Firebase function
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./UserWhereTo.scss";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function UserWhereTo() {
  const { setTitle, setTask } = useAppContext();
  const [locations, setLocations] = useState([]);  // Store fetched locations
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const [filteredLocations, setFilteredLocations] = useState([]); // Store filtered locations
  const [destination, setDestination] = useState(null); // Use null as initial state
  const [customDestination, setCustomDestination] = useState({}); // Update to object

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    setTitle("Where To");
    setTask(1);

    // Fetch all locations (buildings and POIs) from Firebase
    const fetchLocations = async () => {
      try {
        const allLocations = await getAllLocations();
        // Filter out locations with null coordinates
        const validLocations = allLocations.filter(location => location.coordinates);
        setLocations(validLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [setTitle, setTask]);

  // Update filtered locations based on search query
  useEffect(() => {
    setFilteredLocations(
      locations?.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, locations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDropdownSelect = (locationName) => {
    // Find the selected location object from the list
    const selectedLocation = locations.find(location => location.name === locationName);
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name); // Update the input with selected location name
      setDestination(selectedLocation);      // Update the destination state with the object
    } else if (locationName === "Other") {
      setDestination(customDestination);     // Set custom destination if "Other" is selected
    }
    setFilteredLocations([]);                // Hide the dropdown after selection
  };

  const handleConfirmClick = () => {
    // Use JSON.stringify to serialize the destination object
    if (destination) {
      const destinationParam = encodeURIComponent(JSON.stringify(destination));
      navigate(`/userFind?destination=${destinationParam}`);
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
              placeholder="Enter or select destination"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {filteredLocations.length > 0 && (
              <ul className="user-where-to-dropdown">
                {filteredLocations.map(location => (
                  <li
                    key={location.name}
                    onClick={() => handleDropdownSelect(location.name)}
                    className="dropdown-item"
                  >
                    {location.name}
                  </li>
                ))}
                <li
                  onClick={() => handleDropdownSelect("Other")}
                  className="dropdown-item"
                >
                  Other
                </li>
              </ul>
            )}
          </section>
        </Card>
      </section>
      <section className="user-where-to-confirm-section w-full">
        <button className="confirm-button" onClick={handleConfirmClick}>
          Confirm Destination
        </button>
      </section>
    </main>
  );
}

export default UserWhereTo;
