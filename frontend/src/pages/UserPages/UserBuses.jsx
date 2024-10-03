import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the back icon
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";
import './UserBuses.css';

function UserBuses() {
    const { setTitle, setTask } = useAppContext();

    useEffect(() => {
        setTitle("Bus Schedule");
        setTask(0);
    }, [setTitle, setTask]);

    const handleViewClick = () => {
        // Navigate to the new page (e.g., bus schedule page)
        window.location.href = "/UserBusSchedule"; // Replace with actual path
    };

    const handleDownloadClick = () => {
        // Create a mock PDF for download
        const link = document.createElement('a');
        link.href = "/bus.pdf"; // Mock PDF path
        link.download = 'bus.pdf';
        link.click();
    };

    const handleBackClick = () => {
        // Go back to the previous page
        window.history.back();
    };

    return (
        <main className='bus-main-container flex flex-col items-center justify-center min-h-screen relative'>
            {/* Right-hand container */}
            <div className='relative w-full max-w-4xl px-4'>
                {/* Back button */}
                <button
                    className='absolute top-5 left-6 p-2 text-gray-600 hover:text-gray-800'
                    onClick={handleBackClick}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className='text-xl' />
                </button>

                {/* Upper section with text */}
                <section className='bus-upper-part text-center py-8 lg:py-12'> {/* Increased padding */}
                    <h2 className='text-2xl lg:text-4xl font-semibold bounce-text'>
                        Get the latest Bus Schedule!
                    </h2>
                </section>

                {/* Lower section with buttons */}
                <section className='bus-lower-part flex flex-col lg:flex-row justify-center items-center gap-8 py-18 lg:py-12'> {/* Increased padding */}
                    <button
                        className='bus-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded shadow-lg transition duration-300 ease-in-out'
                        onClick={handleViewClick}
                    >
                        View
                    </button>
                    <button
                        className='bus-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded shadow-lg transition duration-300 ease-in-out'
                        onClick={handleDownloadClick}
                    >
                        Download
                    </button>
                </section>
            </div>
        </main>
    );
}

export default UserBuses;

