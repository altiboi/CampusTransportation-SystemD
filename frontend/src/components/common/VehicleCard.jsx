import bike from "../../assets/bike.svg";
import scooter from "../../assets/scooter.svg";
import skateBoard from "../../assets/skateBoard.svg";
import bus from "../../assets/bus.png";

// src/components/common/VehicleCard.js
import React from "react";
import "./VehicleCard.css";

const getVehicleImage = (type) => {
  switch (type) {
    case "bike":
      return bike;
    case "scooter":
      return scooter;
    case "skateboard":
      return skateBoard;
    case "bus":
      return bus;
    default:
      return null;
  }
};

const VehicleCard = ({
  type,
  registration,
  make,
  model,
  
  year,
  location,
  onClick,
}) => {
  const vehicleImage = getVehicleImage(type);

  return (
    <div className="vehicle-card" onClick={onClick}>
      <img src={vehicleImage} alt={type} className="vehicle-card-image" />
      <div className="vehicle-card-content">
        <h2 className="vehicle-card-title">{make}</h2>
        <p className="vehicle-card-registration">{registration}</p>
        <div className="vehicle-card-details">
          <p>
            {make},{model}
          </p>
          <p>{year}</p>
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
