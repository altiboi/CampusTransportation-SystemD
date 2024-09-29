import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserHome from '../../src/pages/UserPages/UserHome';
import { describe, it, expect } from 'vitest';

// Test suite for UserHome component
describe('UserHome Component', () => {
  // Render the component in each test using the router context
  const renderComponent = () => {
    render(
      <Router>
        <UserHome />
      </Router>
    );
  };

  it('should render the upper part with rent and find cards', () => {
    renderComponent();


    expect(screen.getByText('Rent')).not.toBeNull();
    
  
    expect(screen.getByText('Find')).not.toBeNull();
  });

  it('should render the middle part with campus map card', () => {
    renderComponent();

    // Check if Campus Map card is rendered
    expect(screen.getByText('Campus Map')).not.toBeNull();
  });

  it('should render the lower part with suggestions', () => {
    renderComponent();

    // Check if Rent Bike, Bus Schedule, and Fines cards are rendered
    expect(screen.getByText('Rent Bike')).not.toBeNull();
    expect(screen.getByText('Bus Schedule')).not.toBeNull();
    expect(screen.getByText('Fines')).not.toBeNull();
  });

  it('should render the correct icons', () => {
    renderComponent();
    expect(screen.getByTestId('icon-truck')).not.toBeNull();  
    expect(screen.getByTestId('icon-location-dot')).not.toBeNull(); 
    expect(screen.getByTestId('icon-route')).not.toBeNull();  
    expect(screen.getByTestId('icon-bicycle')).not.toBeNull(); 
    expect(screen.getByTestId('icon-clipboard-list')).not.toBeNull(); 
    expect(screen.getByTestId('icon-ticket')).not.toBeNull(); 
  });

  it('should navigate to the correct route when a card is clicked', () => {
    renderComponent();

    const rentCard = screen.getByText('Rent');
    fireEvent.click(rentCard);
    

    expect(window.location.pathname).toBe('/userRental');
    

    const findCard = screen.getByText('Find');
    fireEvent.click(findCard);
    

    expect(window.location.pathname).toBe('/userFind');

    const BusCard = screen.getByText('Bus Schedule');
    fireEvent.click(BusCard);
    expect(window.location.pathname).toBe('/UserBuses');


    const FinesCard = screen.getByText('Fines');
    fireEvent.click(FinesCard);
    expect(window.location.pathname).toBe('/UserFines');


    const CampusCard = screen.getByText('Campus Map');
    fireEvent.click(CampusCard);
    expect(window.location.pathname).toBe('/UserMap');
  });

  
  it('should render a title for the suggestions section', () => {
    renderComponent();


    expect(screen.getByText('Suggestions')).not.toBeNull();
  });
});
