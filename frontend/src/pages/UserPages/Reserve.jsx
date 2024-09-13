import React from 'react';
import { useParams } from 'react-router-dom';
import RentalDetails from "./RentalDetails"; // Corrected typo

function Book() {
  const { itemName } = useParams();

  return <RentalDetails itemName={itemName} action="reserve" />;
}

export default Book;
