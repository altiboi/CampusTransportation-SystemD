import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const DesktopHeader = () => {
  const { title } = useAppContext();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/notifications"); // Navigate back to the previous page
  };

  const handleMenuClick = () => {
    // Toggle sidebar or menu visibility if needed
  };

  return (
    <header className="hidden lg:flex items-center justify-between bg-white p-4 fixed top-0 left-64 w-[calc(100%-16rem)] shadow-md">
      <button onClick={handleMenuClick} className="text-black">
        {/* <FontAwesomeIcon icon={faBars} size="lg" /> */}
      </button>
      <h1 className="flex-1 text-lg font-semibold text-black text-center">
        {title}
      </h1>
      <button onClick={handleBackClick} className="text-black">
        <FontAwesomeIcon icon={faBell} size="lg" />
      </button>
    </header>
  );
};

export default DesktopHeader;
