// src/pages/VehiclesPage.jsx
import React, { useState, useEffect } from "react";
import TagsInput from "../../components/common/TagsInput";
import SearchBar from "../../components/common/staffComponents/SearchBar";
import Modal from "../../components/common/staffComponents/Modal";
import VehicleCard from "../../components/common/VehicleCard";
import AddVehicleModal from "../../components/common/staffComponents/AddVehicleModal";
import scooter from "../../assets/scooter.svg";
import skateBoard from "../../assets/skateBoard.svg";
import bus from "../../assets/bus.png";
import bike from "../../assets/bike.svg";
import { useAppContext } from "../../contexts/AppContext";

const VEHICLE_TAGS = ["Bikes", "Scooters", "Buses", "Skateboards"];

// Sample vehicle data
const VEHICLES = [
  {
    id: 1,
    type: "Bikes",
    registration: "ABC123",
    make: "Yamaha",
    model: "MT-07",
    year: 2022,
    location: "Campus Central Park",
  },
  {
    id: 2,
    type: "Scooters",
    registration: "XYZ789",
    make: "Honda",
    model: "Metropolitan",
    year: 2023,
    location: "Yale Village",
  },
  // Add more vehicle data here
];

const getVehicleImage = (type) => {
  switch (type) {
    case "Bikes":
      return bike;
    case "Scooters":
      return scooter;
    case "Skateboards":
      return skateBoard;
    case "Buses":
      return bus;
    default:
      return null;
  }
};

const VehiclesPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false); // New state for add vehicle modal

  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Vehicles");
    setTask(1);
  }, [setTitle, setTask]);

  useEffect(() => {
    const filterVehicles = () => {
      return VEHICLES.filter((vehicle) => {
        const matchesTag =
          selectedTags.length === 0 || selectedTags.includes(vehicle.type);
        const matchesSearch =
          vehicle.registration
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTag && matchesSearch;
      });
    };

    setFilteredVehicles(filterVehicles());
  }, [selectedTags, searchTerm]);

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const openAddVehicleModal = () => {
    setIsAddVehicleModalOpen(true);
  };

  const closeAddVehicleModal = () => {
    setIsAddVehicleModalOpen(false);
  };

  const handleAddVehicle = (newVehicle) => {
    VEHICLES.push({ ...newVehicle, id: VEHICLES.length + 1 }); // Add new vehicle to the array
    setFilteredVehicles([...VEHICLES]); // Update the filtered vehicles list
  };

  return (
    <div className="pt-20 p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vehicles</h1>
          <button
            onClick={openAddVehicleModal}
            className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Add Vehicle
          </button>
        </div>

        <div className="flex flex-col items-center">
          <SearchBar onSearch={handleSearch} />
          <TagsInput
            tags={VEHICLE_TAGS}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                type={vehicle.type}
                registration={vehicle.registration}
                make={vehicle.make}
                model={vehicle.model}
                year={vehicle.year}
                location={vehicle.location}
                onClick={() => openModal(vehicle)}
              />
            ))
          ) : (
            <p>No vehicles found.</p>
          )}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Registration</h3>
            <p>{selectedVehicle.registration}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Make</h3>
            <p>{selectedVehicle.make}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Model</h3>
            <p>{selectedVehicle.model}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Year</h3>
            <p>{selectedVehicle.year}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Current Location</h3>
            <p>{selectedVehicle.location}</p>
          </div>
          <button
            onClick={closeModal}
            className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Close
          </button>
        </Modal>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={closeAddVehicleModal}
        onAdd={handleAddVehicle}
      />
    </div>
  );
};

export default VehiclesPage;