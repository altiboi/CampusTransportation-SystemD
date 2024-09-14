// src/pages/VehiclesPage.jsx
import React, { useState, useEffect } from "react";
import TagsInput from "../../components/common/TagsInput";
import SearchBar from "../../components/common/staffComponents/SearchBar";
import Modal from "../../components/common/staffComponents/Modal";
import VehicleCard from "../../components/common/VehicleCard";
import AddVehicleModal from "../../components/common/staffComponents/AddVehicleModal";
import scooter from "../../vehicles/scooter.png";
import skateBoard from "../../vehicles/skateboard.png";
import bus from "../../vehicles/bus.png";
import bike from "../../vehicles/bicycle.png";
import { useAppContext } from "../../contexts/AppContext";
import { getAllVehicles } from "../../api/functions";

const VEHICLE_TAGS = ["bike", "scooter", "bus", "skateboard"];



const getVehicleImage = (type) => {
  switch (type) {
    case "bike":
      return bike;
    case "scooter":
      return scooter;
    case "skateboard":
      return skateBoard;
    case "buses":
      return bus;
    default:
      return null;
  }
};

const VehiclesPage = ({ vehicles }) => {
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
      return vehicles.filter((vehicle) => {
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
             
                year={vehicle.year}
                location={vehicle.rentalStationID}
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
