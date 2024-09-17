import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Rental.css';
import { useAppContext } from "../../contexts/AppContext";

// Component to display rental stations
const RentalStations = ({ onSelectStation }) => {
  const stations = [
    { name: 'Campus Central Park Station', location: 'Campus Central Park' },
    { name: 'Campus North Station', location: 'Campus North' },
    { name: 'Campus West Station', location: 'Campus West' },
  ];

  return (
    <div className="rental-stations mb-6 p-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Rental Stations</h2>
      <ul>
        {stations.map((station, index) => (
          <li key={index} className="mb-2">
            <button
              className="text-blue-500 underline"
              onClick={() => onSelectStation(station)}
            >
              {station.name} - {station.location}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function UserRental() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Rent Vehicle");
    setTask(1);
  }, [setTitle, setTask]);

  const categories = ['All', 'Bike', 'Scooter', 'Skateboard'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  // Ensure at least one of each type in each station
  const allRentalItems = [
    // Campus Central Park
    { name: 'Bike 1', category: 'Bike', image: '/images/bike1.jpeg', registration: 'ABC123', model: 'MT-07', year: '2022', location: 'Campus Central Park' },
    { name: 'Scooter 1', category: 'Scooter', image: '/images/scooter1.jpeg', registration: 'SC123', model: 'Scooter X', year: '2020', location: 'Campus Central Park' },
    { name: 'Skateboard 1', category: 'Skateboard', image: '/images/skateboard1.jpeg', registration: 'SKT123', model: 'Skate 500', year: '2022', location: 'Campus Central Park' },
    
    // Campus North
    { name: 'Bike 2', category: 'Bike', image: '/images/bike2.jpeg', registration: 'XYZ789', model: 'X-Trail', year: '2021', location: 'Campus North' },
    { name: 'Scooter 2', category: 'Scooter', image: '/images/scooter2.jpeg', registration: 'hgggkyu', model: 'Scooter Y', year: '2019', location: 'Campus North' },
    { name: 'Skateboard 2', category: 'Skateboard', image: '/images/skateboard2.jpeg', registration: 'SKT456', model: 'Skate 700', year: '2020', location: 'Campus North' },

    // Campus West
    { name: 'Scooter 1', category: 'Scooter', image: '/images/scooter1.jpeg', registration: 'SCO456', model: 'Scooter Z', year: '2022', location: 'Campus West' },
    { name: 'Scooter 1', category: 'Scooter', image: '/images/scooter1.jpeg', registration: 'SCO456', model: 'Scooter Z', year: '2022', location: 'Campus West' },
    { name: 'Skateboard 2', category: 'Skateboard', image: '/images/skateboard2.jpeg', registration: 'SKT789', model: 'Skate 800', year: '2021', location: 'Campus West' },
  ];


  const filteredRentalItems = allRentalItems
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter(item => !selectedStation || item.location === selectedStation.location);

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <header className="desktop-header mb-4 flex items-center">
        <Link to="/" className="mr-4">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold">Rental</h1>
      </header>

      {selectedStation === null ? (
        <RentalStations onSelectStation={setSelectedStation} />
      ) : (
        <>
          <div className="mb-6 p-4 border rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Selected Station</h2>
            <p>{selectedStation.name} - {selectedStation.location}</p>
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
            {activeCategory === 'All' ? 'Most Rented Transport' : `Available ${activeCategory}s`}
          </h2>

          {filteredRentalItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRentalItems.map((item, index) => (
                <Card key={index} className="desktop-card flex items-center justify-between p-4 rounded-lg shadow">
                  <div>
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <div className="space-x-2">
                      <Link 
                        to={`/Book/${item.name}`} 
                        className="px-4 py-2 bg-black text-white rounded"
                        state={{ item }}  // Pass the vehicle details as state
                      >
                        Book now
                      </Link>
                      <Link 
                        to={`/Reserve/${item.name}`} 
                        className="px-4 py-2 bg-gray-200 text-black rounded"
                        state={{ item }}  // Pass the vehicle details as state
                      >
                        Reserve
                      </Link>
                    </div>
                  </div>
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No results found</p>
          )}
        </>
      )}
    </main>
  );
}
