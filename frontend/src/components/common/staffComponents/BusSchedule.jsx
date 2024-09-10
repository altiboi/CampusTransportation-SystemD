// src/components/common/BusTicket.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const BusSchedule = ({ pickup, destination, id }) => {
  return (
    <Link
      to={`/scheduledetails/${id}`} // Ensure the correct path for redirection
      className="block" // Make Link a block element
    >
      <div className="relative bg-white rounded-lg p-4 hover:scale-105 hover:shadow-lg max-w-2xl h-32 mx-auto overflow-hidden flex items-center justify-center">
        {/* Left Side of the Connecting Line */}
        <div className="absolute top-1/2 left-[-1rem] transform -translate-y-1/2 w-[calc(50%-2rem)] border-t border-black border-dashed"></div>

        {/* Right Side of the Connecting Line */}
        <div className="absolute top-1/2 right-[-1rem] transform -translate-y-1/2 w-[calc(50%-2rem)] border-t border-black border-dashed"></div>

        {/* Rotated Half Circles */}
        <div className="absolute top-1/2 left-[-1rem] transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 rotate-[-90deg]"></div>
        <div className="absolute top-1/2 right-[-1rem] transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 rotate-[-90deg]"></div>

        {/* Content Centered on the Line */}
        <div className="flex items-center space-x-4 z-10 bg-white px-2">
          {" "}
          {/* Background color to "cut" the line */}
          <span className="text-black font-semibold">{pickup}</span>
          <FontAwesomeIcon icon={faBus} className="text-black" />
          <span className="text-black font-semibold">{destination}</span>
        </div>
      </div>
    </Link>
  );
};

export default BusSchedule;
