import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Rental.css';
import { useAppContext } from "../../contexts/AppContext";
import { fetchRentalStations, getAllVehicles } from '../../api/functions';
import { useAuth } from '../../contexts/AuthProvider';
import bikeImage from "../../assets/vehicles.jpg"
import bike from "../../assets/bike.svg";
import scooter from "../../assets/scooter.svg";
import skateBoard from "../../assets/skateBoard.svg";

const RentalStations = ({ onSelectStation, stations }) => (
  <div className="rental-stations mb-6 p-4 border rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Rental Stations</h2>
    <ul>
      {stations.map((station, index) => (
        <li key={index} className="mb-2">
          <button
            className="text-blue-500 underline"
            onClick={() => onSelectStation(station)}
          >
            {station.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default function UserRental() {
  const { setTitle, setTask } = useAppContext();
  const { currentUser } = useAuth();
  const categories = ['All', 'Bike', 'Scooter', 'Skateboard'];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredRentalItems, setFilteredRentalItems] = useState([]);

  useEffect(() => {
    setTitle("Rent Vehicle");
    setTask(1);

    const fetchData = async () => {
      try {
        const rentalStationsList = await fetchRentalStations();
        setStations(rentalStationsList);

        const vehiclesList = await getAllVehicles();
        setVehicles(vehiclesList);
      } catch (error) {
        console.error("Error fetching rental stations or vehicles:", error);
      }
    };

    fetchData();
  }, [setTitle, setTask]);

  useEffect(() => {
    // Filter and sort vehicles based on category, search text, availability, and selected station
    const filteredItems = vehicles
      .filter(item => activeCategory === 'All' || item.type === activeCategory.toLowerCase())
      .filter(item => item.make?.toLowerCase().includes(searchText.toLowerCase()) || item.model?.toLowerCase().includes(searchText.toLowerCase()))
      .filter(item => !selectedStation || item.rentalStationID === selectedStation.id)
      .sort((a, b) => b.available - a.available);  // Sort: available vehicles first

    setFilteredRentalItems(filteredItems);
  }, [activeCategory, searchText, selectedStation, vehicles]);

  const getVehicleImage = (type) => {
    switch (type) {
      case "bike":
        return bike;
      case "scooter":
        return scooter;
      case "skateboard":
        return skateBoard;
      default:
        return null;
    }
  };

  return (
    <main 
    className={`p-4 max-w-7xl mx-auto w-full ${selectedStation !== null ? 'selected-station-bg' : ''}`}  // Conditionally add class for background image
    >
      <header className="desktop-header mb-4 flex items-center">
        {selectedStation ? (
          <button onClick={() => setSelectedStation(null)} className="mr-4 hidden lg:block">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
        ) : (
          <Link to="/" className="mr-4">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl hidden lg:block" />
          </Link>
        )}
        <h1 className="text-xl font-bold">Rental</h1>
      </header>
    
      {selectedStation === null ? (
        <RentalStations onSelectStation={setSelectedStation} stations={stations} />
      ) : (
        <>
          <div className="mb-6 p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Selected Station</h2>
            <p>{selectedStation.name}</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 text-black rounded"
              onClick={() => setSelectedStation(null)}
            >
              Select Another Station
            </button>
          </div>
    
          <div className="desktop-search relative mb-4">
            <input
              type="text"
              placeholder="Search vehicle here"
              className="w-full p-2 pl-10 rounded-full border border-gray-300"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
    
          <div className="desktop-category-buttons flex space-x-4 mb-4 overflow-x-auto">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full ${category === activeCategory ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
    
          <h2 className="text-lg font-semibold mb-4">
            {activeCategory === 'All' ? 'Available Vehicles' : `Available ${activeCategory}s`}
          </h2>
    
          {currentUser?.currentRentalID ? (
            <p className="text-center text-red-500 font-bold">You already have a rental. Please return it before booking or reserving another vehicle.</p>
          ) : (
            filteredRentalItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRentalItems.map((item, index) => (
                  <Card key={index} className="desktop-card flex items-center justify-between p-4 rounded-lg shadow">
                    <div>
                      <h3 className="font-semibold mb-2">{item.make} {item.model} ({item.year})</h3>
                      <p className="mb-2 text-sm text-gray-500">Available: {item.available ? "Yes" : "No"}</p>

                      {item.available && (
                        <div className="space-x-2">
                          <Link 
                            to={`/Book/${item.name}`} 
                            className="px-4 py-2 bg-black text-white rounded"
                            state={{ item, rentalStationID: selectedStation.id }}  // Pass vehicle details as state
                          >
                            Book now
                          </Link>
                          <Link 
                            to={`/Reserve/${item.name}`} 
                            className="px-4 py-2 bg-gray-200 text-black rounded"
                            state={{ item, rentalStationID: selectedStation.id }}  // Pass vehicle details as state
                          >
                            Reserve
                          </Link>
                        </div>
                      )}
                    </div>
                    <img src={getVehicleImage(item.type)} alt={item.registration} className="w-24 h-24 object-cover" />
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No results found</p>
            )
          )}
        </>
      )}
    </main>
  );
}