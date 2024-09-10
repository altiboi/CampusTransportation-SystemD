// src/components/common/BusTicket.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const BusTrip = ({ pickup, destination, time, id }) => {
  return (
    <Link
      // Ensure the correct path for redirection
      className="block" // Make Link a block element
    >
      <div className="relative bg-white rounded-lg p-4 hover:scale-105 hover:shadow-lg max-w-2xl h-32 mx-auto overflow-hidden">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-[-1rem] transform -translate-y-1/2 right-[-1rem] border-t border-black border-dashed"></div>

        {/* Rotated Half Circles */}
        <div className="absolute top-1/2 left-[-1rem] transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 rotate-[-90deg]"></div>
        <div className="absolute top-1/2 right-[-1rem] transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 rotate-[-90deg]"></div>

        <div className="flex items-center w-full mb-4">
          <div className="flex-1 text-center text-black font-semibold">
            {pickup}
          </div>
          <FontAwesomeIcon icon={faBus} className="text-black mx-4" />
          <div className="flex-1 text-center text-black font-semibold">
            {destination}
          </div>
        </div>
        <div className="text-gray-500 pt-2 text-sm text-center">{time}</div>
      </div>
    </Link>
  );
};

export default BusTrip;
