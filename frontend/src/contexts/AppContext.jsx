// src/context/AppContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [task, setTask] = useState(0);

  return (
    <AppContext.Provider
      value={{
        title,
        setTitle,
        task,
        setTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
