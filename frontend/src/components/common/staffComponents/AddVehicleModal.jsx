// src/components/common/AddVehicleModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { fetchRentalStations } from "../../../api/functions";

const VEHICLE_TYPES = ["Bike", "Scooter", "Bus", "Skateboard"];

const AddVehicleModal = ({ isOpen, onClose, onAdd, rentalStations }) => {
  const [type, setType] = useState(null);
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState(null);
  const [model, setModel] = useState(null);
  const [year, setYear] = useState(null);
  const [location, setLocation] = useState(null);
  //const [stations, setStations] = useState([]);

  const handleSubmit = () => {
    if (!type || !registration || !make || !model || !year || !location) {
      alert("Please fill in all fields.");
      return;
    }

    onAdd({ type, registration, make, model, year, location });
    onClose();
  };

  //console.log(stations);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">Select Type</option>
          {VEHICLE_TYPES.map((vehicleType) => (
            <option key={vehicleType} value={vehicleType.toLowerCase()}>
              {vehicleType}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Registration</label>
        <input
          type="text"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Make</label>
        <input
          type="text"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Model</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">Select Location</option>
          {rentalStations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
      >
        Add Vehicle
      </button>
    </Modal>
  );
};

export default AddVehicleModal;
