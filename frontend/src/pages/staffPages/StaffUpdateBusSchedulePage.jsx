import MobileHeader from "../../components/common/MobileHeader";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";

function StaffUpdateBusSchedulePage() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Update Bus Schedule");
    setTask(1);
  }, [setTitle, setTask]);
  return (
    <div className="pt-16">
      <>hello there</>
    </div>
  );
}

export default StaffUpdateBusSchedulePage;
