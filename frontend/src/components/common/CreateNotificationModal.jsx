// src/components/common/CreateNotificationModal.jsx
import React, { useState } from "react";
import Modal from "./staffComponents/Modal";
const CreateNotificationModal = ({ isOpen, onClose, onCreate ,currentUser}) => {
  const [Title, setTitle] = useState("");
  const [Body, setBody] = useState("");
  const [Sender,setSender] = useState(currentUser.name + " " + currentUser.surname);
  const [SenderID,setSenderID] = useState(currentUser.uid);
  
  const [Audience, setAudience] = useState("Everyone");

  const handleCreate = () => {
    const newNotification = {
      Title,
      Body,
      Audience,
      Sender,
      SenderID,
      Date: new Date().toISOString(),
    };
    onCreate(newNotification);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create Notification</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={Title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={Body}
        onChange={(e) => setBody(e.target.value)}
      />
     
      <select
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={Audience}
        onChange={(e) => setAudience(e.target.value)}
      >
        <option value="Staff">Staff</option>
        <option value="Users">Users</option>
        <option value="Everyone">Everyone</option>
      </select>
      <button
        onClick={handleCreate}
        className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
      >
        Create
      </button>
    </Modal>
  );
};

export default CreateNotificationModal;
