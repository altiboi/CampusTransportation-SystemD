import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the back icon
import { useAppContext } from "../../contexts/AppContext";
import './UserMap.scss'; // Import the SCSS file

function UserMap() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Find");
    setTask(1);
  }, [setTitle, setTask]);

  const handleBackClick = () => {
    // Go back to the previous page
    window.history.back();
  };

  return (
    <main className="find-main-container">
      <div className="relative">
        <button
          className="back-button"
          onClick={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
        <h2 className="title">The Map</h2>

        {/* Fullscreen map section */}
        <div className="find-map">
          {/* This is where you can integrate your map component */}
          {/* For example, you can use Google Maps API or any other map library */}
        </div>
      </div>
    </main>
  );
}

export default UserMap;
