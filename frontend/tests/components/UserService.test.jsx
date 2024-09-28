// UserService.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest'; // Importing 'vi' for mocking
import UserService from '../../src/pages/UserPages/UserService';

// Mock the context
const mockSetTitle = vi.fn();
const mockSetTask = vi.fn();

vi.mock('../../src/contexts/AppContext', () => {
  return {
    useAppContext: () => ({
      setTitle: mockSetTitle,
      setTask: mockSetTask,
    }),
    AppProvider: ({ children }) => <div>{children}</div>, // Mocking AppProvider
  };
});

describe('UserService Component', () => {
  beforeEach(() => {
    mockSetTitle.mockClear();
    mockSetTask.mockClear();
  });

  const renderComponent = () => {
    render(
      <Router>
        <UserService />
      </Router>
    );
  };

  it('should render the header title', () => {
    renderComponent();
    expect(screen.getByText('Go Anywhere!')).not.toBeNull();
  });

  it('should render the trip card', () => {
    renderComponent();

    const tripCard = screen.getByText('Trip');
    expect(tripCard).not.toBeNull();

    const tripLink = tripCard.closest('a');
    expect(tripLink).not.toBeNull(); 
  });

  it('should render the nearby rental stations card', () => {
    renderComponent();

    const rentalCard = screen.getByText('Nearby Rental Stations');
    expect(rentalCard).not.toBeNull();
    const rentalLink = rentalCard.closest('a');
    expect(rentalLink).not.toBeNull();
    expect(rentalLink.getAttribute('href')).toBe('/UserMap'); 
  });

  it('should set the correct title and task in context', () => {
    renderComponent();

    expect(mockSetTitle).toHaveBeenCalledWith('Services');
    expect(mockSetTask).toHaveBeenCalledWith(1);
  });

  it('should navigate to the correct route when a card is clicked', () => {
    renderComponent();

    const busCard = screen.getByText('Bus Schedule');
    fireEvent.click(busCard.closest('a')); 
    expect(window.location.pathname).toBe('/UserBuses');

    const StationsCard = screen.getByText('Nearby Rental Stations');
    fireEvent.click(StationsCard);
    expect(window.location.pathname).toBe('/UserMap');

    const TripCard = screen.getByText('Trip');
    fireEvent.click(TripCard);
    expect(window.location.pathname).toBe('/userFind');


    const BusCard = screen.getByText('Bus Schedule');
    fireEvent.click(BusCard);
    expect(window.location.pathname).toBe('/UserBuses');


    const FinesCard = screen.getByText('Fines');
    fireEvent.click(FinesCard);
    expect(window.location.pathname).toBe('/UserFines');

    const ReturnCard = screen.getByText('Returns');
    fireEvent.click(ReturnCard);
    expect(window.location.pathname).toBe('/Returns');

    const CampusCard = screen.getByText('Campus Map');
    fireEvent.click(CampusCard);
    expect(window.location.pathname).toBe('/UserMap');
  });

  it('should render action cards', () => {
    renderComponent();

    const actionCardRent = screen.getByText('Rent');
    expect(actionCardRent).not.toBeNull();

    
    const finesCard = screen.getByText('Fines');
    expect(finesCard).not.toBeNull();

    const returnsCard = screen.getByText('Returns');
    expect(returnsCard).not.toBeNull();

    const campusMapCard = screen.getByText('Campus Map');
    expect(campusMapCard).not.toBeNull();

    const reserveCard = screen.getByText('Reserve');
    expect(reserveCard).not.toBeNull();

    const BusCard = screen.getByText('Bus Schedule');
    expect(BusCard).not.toBeNull();
  });
});
