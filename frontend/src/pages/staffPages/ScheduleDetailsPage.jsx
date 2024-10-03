import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BusScheduleCard from "../../components/common/BusScheduleCard";
import { useAppContext } from "../../contexts/AppContext";
import Modal from "../../components/common/staffComponents/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ScheduleDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For navigating back
  const { state } = location;
  const route = state?.route;
  const [selectedDay, setSelectedDay] = useState("Mon"); // State to manage selected day
  const [schedule, setSchedule] = useState(null); // State for schedule details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: "" }); // State for new trip details

  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Update Schedule");
    setTask(1);
  }, [setTitle, setTask]);

  console.log(state);

  if (!route) return <div>No route selected</div>;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const changeDay = (direction) => {
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = (currentIndex + direction + days.length) % days.length;
    setSelectedDay(days[newIndex]);
  };

  const handleAddTrip = () => {
    setIsModalOpen(true);
  };

  const handleSaveTrip = () => {
    // Add logic to save new trip
    setIsModalOpen(false);
    setNewTrip({ destination: "", time: "" });
  };

  const isInOperation = (startTime, endTime, now) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
  
    // Create Date objects for start and end times
    const start = new Date(now);
    start.setHours(startHour, startMinute, 0, 0);
  
    const end = new Date(now);
    end.setHours(endHour, endMinute, 0, 0);
  
    // Adjust end time if it crosses midnight
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
  
    return now >= start && now <= end;
  };
  
  return (
    <div className="pt-20 p-8">
      {/* Back Button for Large Screens */}
      <button
        onClick={() => navigate(-1)}
        className="lg:block hidden bg-black text-white p-2 rounded-full hover:bg-gray-800"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg lg:mt-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Schedule Details</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Route Name</h2>
          <p>{route.route_name}</p>
        </div>
        <div className="flex justify-between items-center">
          <button className="hidden px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
            Update Schedule
          </button>
          <button
            onClick={handleAddTrip}
            className="hidden px-4 py-2 text-black border border-gray-300 rounded hover:bg-gray-100"
          >
            Add Trip
          </button>
        </div>
      </div>

      <div className="hidden flex justify-center items-center mb-4">
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
        <h2 className="text-2xl font-bold mb-4">Bus Routes</h2>
        {route.routes.length === 0 ? (
          <p>No routes available for {selectedDay}.</p>
        ) : (
          <div className="space-y-4">
      {/* Flatten schedules from all routes into a single array, adding route information */}
      {route.routes
        .flatMap((route, routeIndex) =>
          route.schedule.map((sched) => ({
            ...sched,
            routeIndex,
            stops: route.stops,
          }))
        )
        // Sort the flattened schedules by whether they are currently in operation
        .sort((a, b) => {
          const now = new Date();
          const isAInOperation = isInOperation(a.start_time, a.end_time, now);
          const isBInOperation = isInOperation(b.start_time, b.end_time, now);
          return isBInOperation - isAInOperation; // Sort in operation first
        })
        // Render the sorted schedules
        .map((sched, index) => (
          <BusScheduleCard
            key={`${sched.routeIndex}-${index}`}
            stopName={sched.stops.join(" -> ")} // Title based on stops
            startTime={sched.start_time}
            endTime={sched.end_time}
            frequency={sched.frequency}
          />
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
            value={route.id}
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