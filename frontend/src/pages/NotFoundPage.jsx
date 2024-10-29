// src/pages/NotFoundPage.js
import React from "react";
import { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";

const NotFoundPage = () => {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("");
    setTask(1);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
