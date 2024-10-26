import React from "react";

function DataModal({ data, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Data for {data.name}</h2>
        <table>
          <thead>
            <tr>
              <th>Vehicle Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Scooters</td>
              <td>{data.scooters}</td>
            </tr>
            <tr>
              <td>Bikes</td>
              <td>{data.bikes}</td>
            </tr>
            <tr>
              <td>Skateboards</td>
              <td>{data.skateboards}</td>
            </tr>
            <tr>
              <td>Total Rentals</td>
              <td>{data.totalRentals}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default DataModal;
