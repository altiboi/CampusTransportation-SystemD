// src/components/common/MobileHeader.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const MobileHeader = () => {
  const { title, task } = useAppContext();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 fixed top-0 w-full lg:hidden shadow-sm">
      {task === 1 ? (
        <button onClick={handleBackClick} className="text-black mr-4">
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
      ) : (
        <div className="mr-4" />
      )}
      <h1 className="text-lg font-semibold text-black">{title}</h1>
      <button className="text-black">
        <FontAwesomeIcon icon={faBell} size="lg" />
      </button>
    </header>
  );
};

export default MobileHeader;
