import React from "react";
import {Link} from "react-router-dom"
import Card from "../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faRoute,
  faPersonWalking,
  faCar,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Find.scss"; // Import custom CSS
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";

function UserMap() {
  const { setTitle, setTask } = useAppContext();

  useEffect(() => {
    setTitle("Find");
    setTask(1);
  }, [setTitle, setTask]);
  return (
    <main className="find-main-container">
      <section className="find-upper-part">
        <section className="find-Map find-w-1/2">The Map</section>
      </section>
    </main>
  );
}

export default UserMap;
