import React from "react";

function FinesModal({ isOpen, onClose, fines, vehicle, fineType }) {
  console.log("FinesModal props:", { isOpen, fines, vehicle, fineType });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">
          {fineType} Fines for {vehicle}
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Rental ID</th>
              <th className="border p-2">User ID</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.rentalID}>
                <td className="border p-2">
                  {new Date(fine.issuedAt).toLocaleDateString()}
                </td>
                <td className="border p-2">${fine.amount}</td>
                <td className="border p-2">{fine.rentalID}</td>
                <td className="border p-2">{fine.userID}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default FinesModal;
