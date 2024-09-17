import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the back icon
import { useAppContext } from "../../contexts/AppContext";
import { useEffect } from "react";

function UserBuses() {
    const { setTitle, setTask } = useAppContext();

    useEffect(() => {
        setTitle("Bus Schedule");
        setTask(1);
    }, [setTitle, setTask]);

    const handleViewClick = () => {
        // Navigate to the new page (e.g., bus schedule page)
        window.location.href = "/bus-schedule"; // Replace with actual path
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
                    className='absolute top-5 left 6 p-2 text-gray-600 hover:text-gray-800'
                    onClick={handleBackClick}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className='text-xl' />
                </button>

                {/* Upper section with text */}
                <section className='bus-upper-part text-center py-4'>
                    <h2 className='text-2xl lg:text-4xl font-semibold'>Get the latest Bus Schedule!</h2>
                </section>

                {/* Middle section with bus icon */}
                <section className='bus-middle-part flex justify-center items-center py-8'>
                    <div className='bg-gray-200 p-4 rounded'>
                        <FontAwesomeIcon 
                            icon={faBus} 
                            className='text-6xl lg:text-8xl text-gray-600' 
                        />
                    </div>
                </section>

                {/* Lower section with buttons */}
                <section className='bus-lower-part flex flex-col lg:flex-row justify-center items-center gap-4 py-4'>
                    <button
                        className='bus-button bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded'
                        onClick={handleViewClick}
                    >
                        View
                    </button>
                    <button
                        className='bus-button bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded'
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
