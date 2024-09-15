import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Rental.css';
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";

export default function UserRental() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Rent Vehicle");
    setTask(1);
  }, [setTitle, setTask]);
  const categories = ['All', 'Bike', 'Scooter', 'Skateboard'];
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const allRentalItems = [
    { name: 'Bike 1', category: 'Bike', image: '/images/bike1.jpeg' },
    { name: 'Bike 2', category: 'Bike', image: '/images/bike2.jpeg' },
    { name: 'Scooter 1', category: 'Scooter', image: '/images/scooter1.jpeg' },
    { name: 'Scooter 2', category: 'Scooter', image: '/images/scooter2.jpeg' },
    { name: 'Skateboard 1', category: 'Skateboard', image: '/images/skateboard1.jpeg' },
    { name: 'Skateboard 2', category: 'Skateboard', image: '/images/skateboard2.jpeg' },
  ];

  const filteredRentalItems = activeCategory === 'All' 
    ? allRentalItems 
    : allRentalItems.filter(item => item.category === activeCategory);

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <header className="desktop-header mb-4 flex items-center">
        <Link to="/" className="mr-4">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold">Rental</h1>
      </header>

      <div className="desktop-search relative mb-4">
        <input
          type="text"
          placeholder="Search vehicle here"
          className="w-full p-2 pl-10 rounded-full border border-gray-300"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="desktop-category-buttons flex space-x-4 mb-4 overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full ${
              category === activeCategory ? 'bg-black text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">
        {activeCategory === 'All' ? 'Most Rented Transport' : `Available ${activeCategory}s`}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRentalItems.map((item, index) => (
          <Card key={index} className="desktop-card flex items-center justify-between p-4 rounded-lg shadow">
            <div>
              <h3 className="font-semibold mb-2">{item.name}</h3>
              <div className="space-x-2">
              <Link 
                to={`/Book/${item.name}`} 
                className="px-4 py-2 bg-black text-white rounded"
              >
                Book now
              </Link>
              <Link 
                to={`/Reserve/${item.name}`} 
                className="px-4 py-2 bg-gray-200 text-black rounded"
              >
                Reserve
              </Link>
              </div>
            </div>
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
          </Card>
        ))}
      </div>
    </main>
  );
}
