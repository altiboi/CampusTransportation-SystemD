// src/pages/ScheduleDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BusTrip from "../../components/common/staffComponents/BusTrip";
import { useAppContext } from "../../contexts/AppContext";
import Modal from "../../components/common/staffComponents/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ScheduleDetailsPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // For navigating back
  const [selectedDay, setSelectedDay] = useState("Mon"); // State to manage selected day
  const [trips, setTrips] = useState({
    // Mock data for bus trips per day
    Mon: [
      {
        id: 1,
        pickup: "Main Campus",
        destination: "Education Campus",
        time: "08:00 AM",
      },
      {
        id: 2,
        pickup: "Med Campus",
        destination: "Yale Village",
        time: "09:45 AM",
      },
      {
        id: 3,
        pickup: "Med Campus",
        destination: "Alton Village",
        time: "09:44 AM",
      },
    ],
    Tue: [
      {
        id: 3,
        pickup: "Campus Central Park Town",
        destination: "Horizon Heights",
        time: "12:00 AM",
      },
    ],
    Wed: [],
    Thu: [{ id: 4, pickup: "44 Stanley", destination: "Main Campus" }],
    Fri: [],
    Sat: [],
    Sun: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: "" }); // State for new trip details

  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Update Schedule");
    setTask(1);
  }, [setTitle, setTask]);

  const schedules = [
    { id: 1, pickup: "Main Campus", destination: "Education Campus" },
    { id: 2, pickup: "Med Campus", destination: "Yale Village" },
    {
      id: 3,
      pickup: "Campus Central Park Town",
      destination: "Horizon Heights",
    },
    { id: 4, pickup: "44 Stanley", destination: "Main Campus" },
    { id: 5, pickup: "Education Campus", destination: "Med Campus" },
    { id: 6, pickup: "Yale Village", destination: "Campus Central Park Town" },
    { id: 7, pickup: "Horizon Heights", destination: "44 Stanley" },
  ];

  // Days array for the day selector
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const schedule = schedules.find((s) => s.id === parseInt(id, 10));
  if (!schedule) return <div>Schedule not found</div>;

  const changeDay = (direction) => {
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = (currentIndex + direction + days.length) % days.length;
    setSelectedDay(days[newIndex]);
  };

  const handleDeleteTrip = (tripId) => {
    setTrips((prevTrips) => ({
      ...prevTrips,
      [selectedDay]: prevTrips[selectedDay].filter(
        (trip) => trip.id !== tripId
      ),
    }));
  };

  const handleAddTrip = () => {
    setIsModalOpen(true);
  };

  const handleSaveTrip = () => {
    const newTripWithId = {
      id: new Date().getTime(),
      pickup: schedule.pickup,
      destination: newTrip.destination,
      time: newTrip.time,
    };

    setTrips((prevTrips) => ({
      ...prevTrips,
      [selectedDay]: [...prevTrips[selectedDay], newTripWithId],
    }));

    setIsModalOpen(false);
    setNewTrip({ destination: "", time: "" });
  };

  return (
    <div className="pt-20 p-8">
      {/* Back Button for Large Screens */}
      <button
        onClick={() => navigate(-1)}
        className="  lg:block hidden bg-black text-white p-2 rounded-full hover:bg-gray-800"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg lg:mt-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Schedule Details</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Pickup Location</h2>
          <p>{schedule.pickup}</p>
          <h2 className="text-xl font-semibold mt-4">Destination</h2>
          <p>{schedule.destination}</p>
        </div>
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
            Update Schedule
          </button>
          <button
            onClick={handleAddTrip}
            className="px-4 py-2 text-black border border-gray-300 rounded hover:bg-gray-100"
          >
            Add Trip
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center mb-4">
        <button
          onClick={() => changeDay(-1)}
          className="px-4 py-2 text-black rounded hover:bg-gray-100"
        >
          {"<"}
        </button>
        <span className="mx-4 text-xl font-semibold">{selectedDay}</span>
        <button
          onClick={() => changeDay(1)}
          className="px-4 py-2 text-black rounded hover:bg-gray-100"
        >
          {">"}
        </button>
      </div>

      <div className="bg-gray-200 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Bus Trips</h2>
        {trips[selectedDay].length === 0 ? (
          <p>No trips scheduled for {selectedDay}.</p>
        ) : (
          <div className="space-y-4">
            {trips[selectedDay].map((trip) => (
              <div key={trip.id} className="bg-white p-4 rounded-lg shadow-md">
                <BusTrip
                  pickup={trip.pickup}
                  destination={trip.destination}
                  time={trip.time}
                />
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="mt-2 w-full text-red-500 hover:text-red-700 text-center"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Trip Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Trip</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <input
            type="text"
            value={schedule.pickup}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            value={newTrip.destination}
            onChange={(e) =>
              setNewTrip((prevTrip) => ({
                ...prevTrip,
                destination: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            value={newTrip.time}
            onChange={(e) =>
              setNewTrip((prevTrip) => ({ ...prevTrip, time: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleSaveTrip}
          className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
        >
          Save Trip
        </button>
      </Modal>
    </div>
  );
};

export default ScheduleDetailsPage;
