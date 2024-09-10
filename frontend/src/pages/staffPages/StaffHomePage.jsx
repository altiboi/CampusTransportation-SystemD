// StaffHomePage.js

import MobileHeader from "../../components/common/MobileHeader";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

function StaffHomePage() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Home");
    setTask(0);
  }, [setTitle, setTask]);
  return (
    <div className="flex flex-col h-screen">
      {/* Flex column with full height */}

      {/* Add padding top to avoid overlapping with the header */}
      <div className="flex-1 overflow-y-auto p-4 pt-16">
        {/* Add pt-16 to account for the header's height */}
        <div>Home</div>
      </div>
    </div>
  );
}

export default StaffHomePage;
