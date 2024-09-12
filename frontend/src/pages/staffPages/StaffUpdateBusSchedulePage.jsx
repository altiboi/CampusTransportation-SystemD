// src/pages/StaffUpdateBusSchedulePage.jsx
import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import SearchBar from "../../components/common/staffComponents/SearchBar";
import BusShedule from "../../components/common/staffComponents/BusSchedule";
import { useAppContext } from "../../contexts/AppContext";

function StaffUpdateBusSchedulePage() {
  const { setTitle, setTask } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // Define the schedules outside of the component's render cycle
  const schedules = [
    {
      id: 1,
      pickup: "Main Campus",
      destination: "Education Campus",
      time: "8:00 AM",
    },
    {
      id: 2,
      pickup: "Med Campus",
      destination: "Yale Village",
      time: "9:15 AM",
    },
    {
      id: 3,
      pickup: "Campus Central Park Town",
      destination: "Horizon Heights",
      time: "11:00 AM",
    },
    {
      id: 4,
      pickup: "44 Stanley",
      destination: "Main Campus",
      time: "1:30 PM",
    },
    {
      id: 5,
      pickup: "Education Campus",
      destination: "Med Campus",
      time: "3:45 PM",
    },
    {
      id: 6,
      pickup: "Yale Village",
      destination: "Campus Central Park Town",
      time: "5:00 PM",
    },
    {
      id: 7,
      pickup: "Horizon Heights",
      destination: "44 Stanley",
      time: "7:15 PM",
    },
  ];

  useEffect(() => {
    // Filter schedules based on the search term when the searchTerm changes
    const filtered = schedules.filter(
      (schedule) =>
        schedule.pickup.toLowerCase().includes(searchTerm.toLowerCase())
      // schedule.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchedules(filtered);
  }, [searchTerm]); // Only depend on searchTerm to avoid infinite loop

  useEffect(() => {
    setTitle("Update Bus Schedule");
    setTask(1);
  }, [setTitle, setTask]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MobileHeader className="z-10" />
      <div className="flex flex-1 flex-col mt-16 overflow-y-auto p-8">
        <div className="mb-4">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <BusShedule
              key={schedule.id}
              pickup={schedule.pickup}
              // destination={schedule.destination}
              time={schedule.time}
              id={schedule.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StaffUpdateBusSchedulePage;
