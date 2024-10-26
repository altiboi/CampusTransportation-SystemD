import React, { useState, useEffect } from "react";
import TagsInput from "../../components/common/TagsInput";
import SearchBar from "../../components/common/staffComponents/SearchBar";
import Modal from "../../components/common/staffComponents/Modal";
import VehicleCard from "../../components/common/VehicleCard";
import AddVehicleModal from "../../components/common/staffComponents/AddVehicleModal";
import { useAppContext } from "../../contexts/AppContext";
import {
  addVehicle,
  getAllVehicles,
  fetchRentalStations,
} from "../../api/functions";

const VEHICLE_TAGS = ["bike", "scooter", "skateboard"];

const VehiclesPage = ({ vehicles }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [localVehicles, setLocalVehicles] = useState(vehicles); // Local state for vehicles
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false); // New state for add vehicle modal
  const [rentalStations, setRentalStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null); // New state for selected rental station

  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Vehicles");
    setTask(1);
  }, [setTitle, setTask]);

  useEffect(() => {
    const filterVehicles = () => {
      return localVehicles.filter((vehicle) => {
        const matchesTag =
          selectedTags.length === 0 || selectedTags.includes(vehicle.type);
        const matchesSearch =
          vehicle.registration
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStation =
          !selectedStation || vehicle.rentalStationID === selectedStation.id;

        return matchesTag && matchesSearch && matchesStation;
      });
    };

    setFilteredVehicles(filterVehicles());
  }, [localVehicles, selectedTags, searchTerm, selectedStation]);

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

  const handleAddVehicle = async (newVehicle) => {
    try {
      await addVehicle(newVehicle);
      const updatedVehicles = await getAllVehicles();

      setLocalVehicles(updatedVehicles);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
    closeAddVehicleModal();
  };

  useEffect(() => {
    const getRentalStations = async () => {
      try {
        const stations = await fetchRentalStations();
        setRentalStations(stations);
      } catch (error) {
        console.error("Error fetching rental stations:", error);
      }
    };

    getRentalStations();
  }, []);

  const getStationName = (stationID) => {
    const station = rentalStations.find((s) => s.id === stationID);
    return station ? station.name : "Unknown Station";
  };

  const handleStationChange = (e) => {
    const stationID = e.target.value;
    const selected = rentalStations.find((station) => station.id === stationID);
    setSelectedStation(selected || null);
  };

  return (
    <div className="pt-10 mt-16 p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Rental Vehicles</h1>
          <button
            onClick={openAddVehicleModal}
            className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Add Vehicle
          </button>
        </div>

        <div className="flex flex-col items-center">
          <SearchBar onSearch={handleSearch} />

          {/* Tags Input */}
          <TagsInput
            tags={VEHICLE_TAGS}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />

          {/* Rental Station Dropdown */}
          <div className="mt-4 w-full md:w-1/3">
            <label
              htmlFor="stationFilter"
              className="block mb-2 text-sm font-medium"
            >
              Filter by Rental Station
            </label>
            <select
              id="stationFilter"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleStationChange}
              value={selectedStation?.id || ""}
            >
              <option value="">All Stations</option>
              {rentalStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
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
                location={getStationName(vehicle.rentalStationID)}
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
            <h3 className="text-lg font-semibold">Location</h3>
            <p>{getStationName(selectedVehicle.rentalStationID)}</p>
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
        rentalStations={rentalStations}
      />
    </div>
  );
};

export default VehiclesPage;
