// src/components/common/CreateNotificationModal.jsx
import React, { useState } from "react";
import Modal from "./staffComponents/Modal";
const CreateNotificationModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [audience, setAudience] = useState("Everyone");

  const handleCreate = () => {
    const newNotification = {
      id: Date.now(),
      title,
      body,
      isRead: false,
      profileImage: "https://via.placeholder.com/50", // Placeholder image
      audience,
      from: "Nkabi",
      timestamp: new Date().toISOString(),
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        type="file"
        className="w-full p-2 mb-4"
        onChange={(e) => setAttachment(e.target.files[0])}
      />
      <select
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={audience}
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
