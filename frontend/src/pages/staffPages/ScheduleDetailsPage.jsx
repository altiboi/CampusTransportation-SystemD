import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BusScheduleCard from "../../components/common/BusScheduleCard";
import { useAppContext } from "../../contexts/AppContext";
import Modal from "../../components/common/staffComponents/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Sample JSON data for schedules
const scheduleData = {
  1: {
    day_type: "weekday",
    route_number: "1",
    route_name: "Full Circuit",
    routes: [
      {
        direction: "normal",
        stops: ["AMIC", "NSW", "WJ", "WEC", "EOH", "KNK", "AMIC"],
        schedule: [
          {
            start_time: "06:30",
            end_time: "02:00",
            frequency: "15",
            notes: "drop & go",
          },
          {
            start_time: "18:00",
            end_time: "00:00",
            frequency: "hourly",
            notes: "on the hour",
          },
        ],
      },
      {
        direction: "reverse",
        stops: ["AMIC", "KNK", "EOH", "WEC", "WJ", "NSW", "AMIC"],
        schedule: [
          {
            start_time: "06:30",
            end_time: "18:00",
            frequency: "15",
            notes: "drop & go",
          },
          {
            start_time: "18:30",
            end_time: "23:30",
            frequency: "60",
            notes: "on the half hour",
          },
        ],
      },
    ],
  },
};

const ScheduleDetailsPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // For navigating back
  const [selectedDay, setSelectedDay] = useState("Mon"); // State to manage selected day
  const [schedule, setSchedule] = useState(null); // State for schedule details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: "" }); // State for new trip details

  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Update Schedule");
    setTask(1);

    // Fetch or set schedule data based on id
    const fetchedSchedule = scheduleData[id];
    if (fetchedSchedule) {
      setSchedule(fetchedSchedule);
    } else {
      // Handle case where schedule is not found
      setSchedule(null);
    }
  }, [id, setTitle, setTask]);

  if (!schedule) return <div>Schedule not found</div>;

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
          <p>{schedule.route_name}</p>
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
        <h2 className="text-2xl font-bold mb-4">Bus Routes</h2>
        {schedule.routes.length === 0 ? (
          <p>No routes available for {selectedDay}.</p>
        ) : (
          <div className="space-y-4">
            {schedule.routes.map((route, routeIndex) =>
              route.schedule.map((sched, schedIndex) => (
                <BusScheduleCard
                  key={`${routeIndex}-${schedIndex}`}
                  stopName={route.stops.join(" -> ")} // Title based on stops
                  startTime={sched.start_time}
                  endTime={sched.end_time}
                  frequency={sched.frequency}
                  direction={route.direction}
                />
              ))
            )}
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
            value={id}
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
