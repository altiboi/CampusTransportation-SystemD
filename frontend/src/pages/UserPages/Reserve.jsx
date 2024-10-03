import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import RentalDetails from "./RentalDetails"; // Corrected typo

function Book() {
  //const { itemName } = useParams();
  const location = useLocation();
  const { item } = location.state || {};

  return <RentalDetails item={item} itemName={`${item.make} ${item.model}`} action="reserve" />;
}

export default Book;
