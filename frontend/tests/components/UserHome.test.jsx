import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserHome from '../../src/pages/UserPages/UserHome';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { getAllVehicles,addNewRentalAndUpdateVehicle} from '../../src/api/functions'

vi.mock('../../src/api/functions', () => ({
  getAllVehicles: vi.fn(),
  addNewRentalAndUpdateVehicle: vi.fn(),
}));

vi.mock('../../src/contexts/AppContext', () => ({
  useAppContext: () => ({
    setTitle: vi.fn(),
    setTask: vi.fn(),
  }),
}));
vi.mock('../../src/contexts/AuthProvider', () => ({
  useAuth: () => ({
    currentUser: { uid: '12345', name: 'Test User' }, 
    refreshCurrentUser: vi.fn(),
  }),
}));
const RentalPage = () => <div>Rental Page</div>;
const FindPage = () => <div>Find Page</div>;
const CampusMapPage = () => <div>Campus Map Page</div>;
const BusSchedulePage = () => <div>Bus Page</div>;
const FinesPage = () => <div>Fine Page</div>;


describe('UserHome Component', () => {
  const renderComponent = (initialEntries = ['/']) => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/userRental" element={<RentalPage />} />
          <Route path="/userFind" element={<FindPage />} />
          <Route path="/UserMap" element={<CampusMapPage />} />
          <Route path="/UserFines" element={<FinesPage />} />
          <Route path="/UserBuses" element={<BusSchedulePage />} />
        </Routes>
      </MemoryRouter>
    );
  };
  beforeEach(() => {
 
    vi.clearAllMocks();
  });
  it('fetches vehicles and displays available bikes', async () => {
    const mockVehicles = [
      { id: '1', type: 'bike', available: true, registration: 'BIKE123', make: 'Yamaha', model: 'YZF', year: '2022', rentalStationID: 'station1' },
      { id: '2', type: 'car', available: false },
    ];
    
    getAllVehicles.mockResolvedValueOnce(mockVehicles);

    renderComponent();
    expect(await screen.findByText('Registration:')).toBeInTheDocument();
    expect(screen.getByText('BIKE123')).toBeInTheDocument();
  });
  it('books a bike successfully', async () => {
    const mockVehicles = [
        {
            available: true,
            currentRentalID: null,
            id: "EQe3X0tcSVvfaWTdHG0f",
            lastMaintenance: null,
            make: "Raleigh",
            model: "Urban Cruiser",
            registration: "BIKE-202",
            rentalStationID: "u9pINIk95UtRXy9BCozf",
            type: "bike",
            year: "2022"
        },
        { id: '2', type: 'car', available: false },
    ];

    getAllVehicles.mockResolvedValueOnce(mockVehicles);

    renderComponent();
    const bookButton = await screen.findByTestId('book-button');
    expect(bookButton).toBeInTheDocument();

    fireEvent.click(bookButton);

    expect(addNewRentalAndUpdateVehicle).toHaveBeenCalledWith(
        'u9pINIk95UtRXy9BCozf', 
        'bike',
        '12345', 
        "EQe3X0tcSVvfaWTdHG0f",
        2
    );


    expect(await screen.findByText('you have booked a bike')).toBeInTheDocument(); 
});
  it('should navigate to the Rental Stations page when the card is clicked', () => {
    renderComponent();
    const rentalCard = screen.getAllByText('Rent');
    expect(rentalCard.length).toBeGreaterThan(1); 

    const secondrentalCard=rentalCard[1]
    expect(secondrentalCard).toBeInTheDocument();

    const rentalLink = secondrentalCard.closest('a');
    expect(rentalLink).toBeInTheDocument();
    expect(rentalLink.getAttribute('href')).toBe('/userRental');

    fireEvent.click(rentalLink);
    expect(screen.getByText('Rental Page')).toBeInTheDocument();
  });

  it('should navigate to the Find page when Find card is clicked', () => {
    renderComponent();

    const findCard = screen.getAllByText('Find');
    expect(findCard.length).toBeGreaterThan(1); 


    const secondFindCard=findCard[1]
     expect(secondFindCard).toBeInTheDocument();

    const findLink = secondFindCard.closest('a');
    expect(findLink).toBeInTheDocument();
    expect(findLink.getAttribute('href')).toBe('/userFind');

    fireEvent.click(findLink);
    expect(screen.getByText('Find Page')).toBeInTheDocument();
   
  });
  it('should navigate to the map page when Rental Station  card is clicked', () => {
    renderComponent();
    const busScheduleCards = screen.getAllByText('Rental Stations');
    expect(busScheduleCards.length).toBeGreaterThan(1); 


    const secondBusScheduleCard = busScheduleCards[1]; 
    expect(secondBusScheduleCard).toBeInTheDocument();

    const findLink = secondBusScheduleCard.closest('a');
    expect(findLink).toBeInTheDocument();
    expect(findLink.getAttribute('href')).toBe('/UserMap');
 


    fireEvent.click(findLink);


    expect(screen.getByText('Campus Map Page')).toBeInTheDocument();
  });
  it('should navigate to the second Bus Schedule page when the second Bus Schedule card is clicked', () => {
    renderComponent();


    const busScheduleCards = screen.getAllByText('Bus Schedule');
    expect(busScheduleCards.length).toBeGreaterThan(1); 


    const secondBusScheduleCard = busScheduleCards[1]; 
    expect(secondBusScheduleCard).toBeInTheDocument();

    const findLink = secondBusScheduleCard.closest('a');
    expect(findLink).toBeInTheDocument();
    expect(findLink.getAttribute('href')).toBe('/UserBuses'); 


    fireEvent.click(findLink);


    expect(screen.getByText('Bus Page')).toBeInTheDocument();
});

  it('should navigate to the fine page when fines card is clicked', () => {
    renderComponent();
    const busScheduleCards = screen.getAllByText('Fines');
    expect(busScheduleCards.length).toBeGreaterThan(1); 


    const secondBusScheduleCard = busScheduleCards[1]; 
    expect(secondBusScheduleCard).toBeInTheDocument();

    const findLink = secondBusScheduleCard.closest('a');
    expect(findLink).toBeInTheDocument();
    expect(findLink.getAttribute('href')).toBe('/UserFines'); 


    fireEvent.click(findLink);


    expect(screen.getByText('Fine Page')).toBeInTheDocument();
   
  });
  it('should render images correctly', () => {
    renderComponent();
    expect(screen.getByAltText('Car_icon_for_rental')).not.toBeNull();
    expect(screen.getByAltText('Find_icon')).not.toBeNull();
    expect(screen.getByAltText('Rental_Station_icon')).not.toBeNull();
    expect(screen.getByAltText('Bicycle_rental_icon')).not.toBeNull();
    expect(screen.getByAltText('Bus_schedule_icon')).not.toBeNull();
    expect(screen.getByAltText('Fines_icon')).not.toBeNull();
  });
});
