import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MobileHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 fixed top-0 w-full lg:hidden shadow-sm">
      {/* Back Button */}

      {/* Page Title */}
      <h1 className="  text-lg font-semibold text-black ">{title}</h1>

      {/* Notification Bell Icon */}
      <button className="text-black">
        <FontAwesomeIcon icon={faBell} size="lg" />
      </button>
    </header>
  );
};

export default MobileHeader;
