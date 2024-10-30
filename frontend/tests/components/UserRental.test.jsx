import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserRental from '../../src/pages/UserPages/Rental'; 
import { AppProvider } from '../../src/contexts/AppContext'; 
import { useAppContext } from "../../src/contexts/AppContext";
import { MemoryRouter } from 'react-router-dom'; 
import '@testing-library/jest-dom';
import * as api from '../../src/api/functions'; 

// Mock functions for the context
const mockSetTitle = vi.fn();
const mockSetTask = vi.fn();

// Mock the API calls
vi.mock('../../src/api/functions', () => ({
    fetchRentalStations: vi.fn(),
    getAllVehicles: vi.fn(),
}));

const renderWithContext = (ui) => {
    return render(
        <MemoryRouter>
            <AppProvider>
                {ui}
            </AppProvider>
        </MemoryRouter>
    );
};

describe('UserRental Component', () => {
    beforeEach(() => {
        // Clear mock functions before each test
        mockSetTitle.mockClear();
        mockSetTask.mockClear();
        api.fetchRentalStations.mockClear();
        api.getAllVehicles.mockClear();
    });

    it('renders the UserRental component and fetches rental stations and vehicles', async () => {
        // Mock API responses
        const mockStations = [{ id: 1, name: 'Station A' }, { id: 2, name: 'Station B' }];
        const mockVehicles = [{ id: 1, name: 'Bike A', make: 'Yamaha', model: 'YZF-R3', year: 2021, available: true, rentalStationID: 1, image: '/bike-a.jpg' }];

        api.fetchRentalStations.mockResolvedValue(mockStations);
        api.getAllVehicles.mockResolvedValue(mockVehicles);

        renderWithContext(<UserRental />);

        await waitFor(() => {
            expect(screen.getByText('Rental Stations')).toBeInTheDocument();
            expect(screen.getByText('Station A')).toBeInTheDocument();
            expect(screen.getByText('Station B')).toBeInTheDocument();
        });

        // Select a rental station
        fireEvent.click(screen.getByText('Station A'));

        // Check if the selected station is displayed
        expect(screen.getByText('Selected Station')).toBeInTheDocument();
        expect(screen.getByText('Station A')).toBeInTheDocument();
    });

    it('filters vehicles based on the selected category', async () => {
        const mockStations = [{ id: 1, name: 'Station A' }];
        const mockVehicles = [
            { id: 1, name: 'Bike A', make: 'Yamaha', model: 'YZF-R3', year: 2021, available: true, rentalStationID: 1, image: '/bike-a.jpg', type: 'bike' },
            { id: 2, name: 'Scooter A', make: 'Honda', model: 'PCX', year: 2021, available: true, rentalStationID: 1, image: '/scooter-a.jpg', type: 'scooter' },
        ];

        api.fetchRentalStations.mockResolvedValue(mockStations);
        api.getAllVehicles.mockResolvedValue(mockVehicles);

        renderWithContext(<UserRental />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Station A'));
        });


        fireEvent.click(screen.getByText('Scooter'));

        expect(screen.getByText('Available Scooters')).toBeInTheDocument();
        expect(screen.getByText(/Honda PCX \(2021\)/)).toBeInTheDocument();
        expect(screen.queryByText('Bike A')).not.toBeInTheDocument();
        expect(screen.queryByText('Bike A')).not.toBeInTheDocument();
    });

    it('displays "No results found" when no vehicles are available', async () => {
        const mockStations = [{ id: 1, name: 'Station A' }];
        const mockVehicles = [];

        api.fetchRentalStations.mockResolvedValue(mockStations);
        api.getAllVehicles.mockResolvedValue(mockVehicles);

        renderWithContext(<UserRental />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Station A'));
        });

        expect(screen.getByText('No results found')).toBeInTheDocument();
    });
});
