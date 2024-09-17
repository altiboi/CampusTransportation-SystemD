import React from 'react';
import { useParams } from 'react-router-dom';
import RentalDetails from "./RentalDetails"; // Corrected typo
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";
function Book() {

  const { itemName } = useParams();
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Services");
    setTask(1);
  }, [setTitle, setTask]);

  return <RentalDetails itemName={itemName} action="book" />;
}

export default Book;