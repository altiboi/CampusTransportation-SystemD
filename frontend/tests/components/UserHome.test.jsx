import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserHome from '../../src/pages/UserPages/UserHome';
import { describe, it, expect } from 'vitest';

// Mock components for pages
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

  it('should navigate to the Rental Stations page when the card is clicked', () => {
    renderComponent();
    const rentalCard = screen.getByText('Rent');
    expect(rentalCard).not.toBeNull();

    const rentalLink = rentalCard.closest('a');
    expect(rentalLink).not.toBeNull();
    expect(rentalLink.getAttribute('href')).toBe('/userRental');

    fireEvent.click(rentalCard);
    expect(screen.getByText('Rental Page')).not.toBeNull();
  });

  it('should navigate to the Find page when Find card is clicked', () => {
    renderComponent();

    const findCard = screen.getByText('Find');
    expect(findCard).not.toBeNull();

    const findLink = findCard.closest('a');
    expect(findLink).not.toBeNull();
    expect(findLink.getAttribute('href')).toBe('/userFind');

    fireEvent.click(findCard );
    expect(screen.getByText('Find Page')).not.toBeNull();
   
  });
  it('should navigate to the map page when map card is clicked', () => {
    renderComponent();

    const findCard = screen.getByText('Campus Map');
    expect(findCard).not.toBeNull();

    const findLink = findCard.closest('a');
    expect(findLink).not.toBeNull();
    expect(findLink.getAttribute('href')).toBe('/UserFind');

    fireEvent.click(findCard);
    expect(screen.getByText('Find Page')).not.toBeNull();

   
  });
  it('should navigate to the Bus Schedule page when Bus Schedule card is clicked', () => {
    renderComponent();

    const findCard = screen.getByText('Bus Schedule');
    expect(findCard).not.toBeNull();

    const findLink = findCard.closest('a');
    expect(findLink).not.toBeNull();
    expect(findLink.getAttribute('href')).toBe('/UserBuses');

    fireEvent.click(findCard);
    expect(screen.getByText('Bus Page')).not.toBeNull();

   
  });
  it('should navigate to the fine page when fines card is clicked', () => {
    renderComponent();

    const findCard = screen.getByText('Fines');
    expect(findCard).not.toBeNull();

    const findLink = findCard.closest('a');
    expect(findLink).not.toBeNull();
    expect(findLink.getAttribute('href')).toBe('/UserFines');

    fireEvent.click(findCard);
    expect(screen.getByText('Fine Page')).not.toBeNull();

   
  });
  it('should render images correctly', () => {
    renderComponent();
    expect(screen.getByAltText('Car icon for rental')).not.toBeNull();
    expect(screen.getByAltText('Find icon')).not.toBeNull();
    expect(screen.getByAltText('Campus map icon')).not.toBeNull();
    expect(screen.getByAltText('Bicycle rental icon')).not.toBeNull();
    expect(screen.getByAltText('Bus schedule icon')).not.toBeNull();
    expect(screen.getByAltText('Fines icon')).not.toBeNull();
  });
});
