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

    window.history.back();
  };

  return (
    <main className="Map-container">
        <button
          className="back-button"
          onClick={handleBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
      <div className="relative">

        <h2 className="title">The Map</h2>
        <div className="find-map">
        </div>
      </div>
    </main>
  );
}

export default UserMap;
