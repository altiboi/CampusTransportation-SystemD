import React from "react";

const ProgressCircle = ({ percentage, size = 100, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-circle">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="transparent"
        stroke="#e5e7eb" // Tailwind gray-300
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="transparent"
        stroke="#3b82f6" // Tailwind blue-500
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.25rem"
        fill="#111827" // Tailwind gray-900
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default ProgressCircle;