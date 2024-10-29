// components/Card.js
import React from "react";

const Card = ({ children, className, onClick }) => {
  return (
    <div className={` p-4 rounded-lg shadow-md ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
