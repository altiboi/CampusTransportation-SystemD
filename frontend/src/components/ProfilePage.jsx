import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import Avatar from "./common/staffComponents/Avatar";
import { doSignOut } from "../firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/login"); // Redirect to the login page after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    setUploadedImage(tempImage);
    setTempImage(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 rounded-lg text-center bg-white shadow-md">
        <div className="w-40 h-40 mx-auto mb-6 relative">
          {uploadedImage || currentUser.displayImage ? (
            <img
              src={uploadedImage || currentUser.displayImage}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Avatar
              src={currentUser.displayImage}
              alt={currentUser.name}
              name={currentUser.name}
              size={160}
              className="rounded-full"
            />
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
        {tempImage && (
          <div className="mb-4">
            <button
              onClick={handleSaveImage}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save Image
            </button>
            <button
              onClick={() => setTempImage(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold mb-2">{currentUser.name}</h2>
          <p className="text-gray-600 mb-1">{currentUser.email}</p>
          <p className="text-gray-600 mb-4">{currentUser.role}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
