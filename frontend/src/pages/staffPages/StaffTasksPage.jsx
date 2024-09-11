import MobileHeader from "../../components/common/MobileHeader";
import updateBusSchedulesImage from "../../assets/updateBusSchedules.jpg";
import createNotificationImage from "../../assets/createNotification.jpg";
import { useEffect } from "react";

import { useAppContext } from "../../context/AppContext";
import vehiclesImage from "../../assets/vehicles.jpg";
import { Link } from "react-router-dom";

function StaffTasksPage() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Tasks");
    setTask(0);
  }, [setTitle, setTask]);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 pt-20 pb-20 flex flex-wrap justify-center gap-4">
        {/* Button for Update Bus Schedule */}
        <Link
          to={"/updatebusschedule"}
          className="flex flex-col items-center bg-white text-black p-4 rounded-lg w-full lg:w-60 lg:h-60 shadow-md transition-transform transform hover:scale-95 hover:shadow-lg"
        >
          <img
            src={updateBusSchedulesImage}
            alt="Update Bus Schedule"
            className="w-24 h-24 mb-2"
          />
          <span className="text-lg text-center">Update Bus Schedule</span>
        </Link>

        {/* Button for Create Notifications */}
        <Link
          to={"/notifications"}
          className="flex flex-col items-center bg-white text-black p-4 rounded-lg w-full lg:w-60 lg:h-60 shadow-md transition-transform transform hover:scale-95 hover:shadow-lg"
        >
          <img
            src={createNotificationImage}
            alt="Create Notifications"
            className="w-24 h-24 mb-2"
          />
          <span className="text-lg text-center">Create Notification</span>
        </Link>

        {/* Button for Vehicles */}
        <Link
          to={"/vehicles"}
          className="flex flex-col items-center bg-white text-black p-4 rounded-lg w-full lg:w-60 lg:h-60 shadow-md transition-transform transform hover:scale-95 hover:shadow-lg"
        >
          <img src={vehiclesImage} alt="Vehicles" className="w-24 h-24 mb-2" />
          <span className="text-lg text-center">Vehicles</span>
        </Link>
      </div>
    </div>
  );
}

export default StaffTasksPage;
