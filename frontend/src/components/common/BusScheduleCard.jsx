import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";

// Helper function to get the time difference in minutes and seconds
const getTimeDifference = (startTime, endTime, frequency) => {
  const now = new Date();
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Create Date objects for start and end times
  const start = new Date(now);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(now);
  end.setHours(endHour, endMinute, 0, 0);

  // Adjust end time if it's before start time (crosses midnight)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  // If current time is before start time, use start time
  if (now < start) {
    const diff = (start - now) / (1000 * 60);
    return {
      minutes: Math.floor(diff),
      seconds: Math.round((diff - Math.floor(diff)) * 60),
    };
  }

  // If current time is after end time, calculate time until next day's start
  if (now > end) {
    start.setDate(start.getDate() + 1);
    const diff = (start - now) / (1000 * 60);
    return {
      minutes: Math.floor(diff),
      seconds: Math.round((diff - Math.floor(diff)) * 60),
    };
  }

  // Calculate time until next bus
  const frequencyMinutes = parseInt(frequency, 10) || 60;
  const timeSinceStart = (now - start) / (1000 * 60);
  const nextBusIn = frequencyMinutes - (timeSinceStart % frequencyMinutes);

  return {
    minutes: Math.floor(nextBusIn),
    seconds: Math.round((nextBusIn - Math.floor(nextBusIn)) * 60),
  };
};

// Main Component
const BusScheduleCard = ({
  stopName,
  startTime,
  endTime,
  frequency,
  direction,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeDifference(startTime, endTime, frequency)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeDifference(startTime, endTime, frequency));
    }, 60000); // Update every minute
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [startTime, endTime, frequency]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <FontAwesomeIcon icon={faBus} className="text-black" />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{stopName}</h3>
          <p>
            Next bus in:{" "}
            {isNaN(timeRemaining.minutes) || isNaN(timeRemaining.seconds)
              ? "Calculating..."
              : `${timeRemaining.minutes
                  .toString()
                  .padStart(2, "0")}:${timeRemaining.seconds
                  .toString()
                  .padStart(2, "0")}`}
          </p>
          <p>
            Operating hours: {startTime} - {endTime}
          </p>
          <p>Direction: {direction}</p>
        </div>
      </div>
    </div>
  );
};

export default BusScheduleCard;
