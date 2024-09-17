import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import SearchBar from "../../components/common/staffComponents/SearchBar";
import BusSchedule from "../../components/common/staffComponents/BusSchedule";
import { useAppContext } from "../../contexts/AppContext";

function StaffUpdateBusSchedulePage() {
  const { setTitle, setTask } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // Define the schedules outside of the component's render cycle
  const schedules = [
    { id: 1, routeName: "Full Circuit" },
    { id: 2, routeName: "NSW | WEC | AMIC | NSW | WEC" },
    { id: 3, routeName: "WJ | WEC | AMIC" },
    { id: 4, routeName: "WJ | WEC | AMIC" },
    { id: 5, routeName: "AMIC | NSW | WEC" },
    { id: 6, routeName: "AMIC | NSW | WEC" },
    { id: 7, routeName: "EOH | KNK | AMIC" },
    { id: 8, routeName: "Full Circuit (excluding WJ RESIDENCE)" },
    { id: 9, routeName: "WJ | WEC | AMIC" },
    { id: 10, routeName: "AMIC | KNK | ROSEBANK | KNK| AMIC" },
    { id: 11, routeName: "AMIC | NSW| ROSEBANK" },
    { id: 12, routeName: "WEC | EOH | ROSEBANK" },
    { id: 13, routeName: "WJ | ROSEBANK" },
  ];

  useEffect(() => {
    // Filter schedules based on the search term when the searchTerm changes
    const filtered = schedules.filter((schedule) =>
      schedule.routeName.toLowerCase().includes(searchTerm.toLowerCase())
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
            <BusSchedule id={schedule.id} pickup={schedule.routeName} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StaffUpdateBusSchedulePage;
