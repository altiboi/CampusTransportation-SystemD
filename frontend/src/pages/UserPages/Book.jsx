import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import RentalDetails from "./RentalDetails"; // Corrected typo
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";
function Book() {

  //const { itemName } = useParams();
  const { setTitle, setTask } = useAppContext();
  const location = useLocation();
  const { item } = location.state || {};

  useEffect(() => {
    setTitle("Booking");
    setTask(0);
  }, [setTitle, setTask]);

  return <RentalDetails item={item} itemName={`${item.make} ${item.model}`} action="book" />;
  
}

export default Book;