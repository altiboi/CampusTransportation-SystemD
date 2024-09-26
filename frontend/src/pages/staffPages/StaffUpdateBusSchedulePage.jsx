import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/common/MobileHeader";
import SearchBar from "../../components/common/staffComponents/SearchBar";
import BusSchedule from "../../components/common/staffComponents/BusSchedule";
import { useAppContext } from "../../contexts/AppContext";
import { fetchBusRoutes } from "../../api/functions";

function StaffUpdateBusSchedulePage() {
  const { setTitle, setTask } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Define the schedules outside of the component's render cycle

  useEffect(() => {
    // Filter schedules based on the search term when the searchTerm changes
    const filtered = schedules.filter((schedule) =>
      schedule.route_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchedules(filtered);
  }, [searchTerm]); // Only depend on searchTerm to avoid infinite loop

  useEffect(() => {
    setTitle("Update Bus Schedule");
    setTask(1);

    const fetchSchedules = async () => {
      try {
        const schedulesData = await fetchBusRoutes();
        setSchedules(schedulesData);
        setFilteredSchedules(schedulesData);
      } catch (error) {
        console.error("Error fetching bus schedules:", error);
      }
    };

    fetchSchedules();

  }, [setTitle, setTask]);

  //console.log(schedules);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MobileHeader className="z-10" />
      <div className="flex flex-1 flex-col mt-16 overflow-y-auto p-8">
        <div className="mb-4">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="space-y-4">
          {filteredSchedules.map((route) => (
            <BusSchedule id={route.id} key={route.id} route={route}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StaffUpdateBusSchedulePage;