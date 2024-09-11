// src/components/common/Avatar.jsx
import React from "react";

const COLORS = [
  "#FFB6C1", // Light Pink
  "#FF7F50", // Coral
  "#FFD700", // Gold
  "#87CEFA", // Light Sky Blue
  "#32CD32", // Lime Green
  "#9370DB", // Medium Purple
  "#FF6347", // Tomato
  "#FF4500", // Orange Red
  "#008080", // Teal
  "#20B2AA", // Light Sea Green
  "#FFA07A", // Light Salmon
  "#8A2BE2", // Blue Violet
];

const getRandomColor = () => {
  // Select a random color from the array
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

const Avatar = ({ name, size = 50 }) => {
  // Extract the first letter of the name, fallback to a question mark if name is empty
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  // Get a random background color
  const backgroundColor = getRandomColor();

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        fontSize: size / 2, // Adjust font size according to the avatar size
      }}
    >
      {initial}
    </div>
  );
};

export default Avatar;
