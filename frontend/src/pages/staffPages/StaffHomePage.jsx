// StaffHomePage.js

import MobileHeader from "../../components/common/MobileHeader";
import { useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthProvider";

function StaffHomePage() {
  const { setTitle, setTask } = useAppContext();
  const { currentUser } = useAuth();

  useEffect(() => {
    setTitle("Home");
    setTask(0);
  }, [setTitle, setTask]);
  return (
    <div className="flex flex-col h-screen">
      {/* Flex column with full height */}

      {/* Add padding top to avoid overlapping with the header */}
      <div className="flex-1 overflow-y-auto p-4 pt-20">
        {/* Add pt-16 to account for the header's height */}
        <div>Welcome {currentUser.name}!</div>
      </div>
    </div>
  );
}

export default StaffHomePage;
