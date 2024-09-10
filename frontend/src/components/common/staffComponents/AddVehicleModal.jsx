// src/components/common/AddVehicleModal.jsx
import React, { useState } from "react";
import Modal from "./Modal";

const VEHICLE_TYPES = ["Bikes", "Scooters", "Buses", "Skateboards"];

const AddVehicleModal = ({ isOpen, onClose, onAdd }) => {
  const [type, setType] = useState("");
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("Main Campus");

  const handleSubmit = () => {
    if (!type || !registration || !make || !model || !year) {
      alert("Please fill in all fields.");
      return;
    }

    onAdd({ type, registration, make, model, year, location });
    onClose();
  };

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
            <option key={vehicleType} value={vehicleType}>
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
        <input
          type="text"
          value={location}
          readOnly
          className="border rounded px-4 py-2 w-full"
        />
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
