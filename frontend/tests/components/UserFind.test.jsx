import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Find from '../../src/pages/UserPages/Find';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../../src/contexts/AppContext';

describe('Find Component', () => {
  const renderComponent = () => {
    render(
        <AppProvider> 
        <Router>
          <Find />
        </Router>
      </AppProvider>
    );
  };

  it('should render the map', () => {
    renderComponent();
    expect(screen.getByTestId('find-Map')).not.toBeNull();
 
  });

  it('should render the "Select Location" section', () => {
    renderComponent();
    const selectLocationTitle = screen.queryByText('Select Location');
    expect(selectLocationTitle).not.toBeNull();
  });

  it('should render the Location and Destination cards', () => {
    renderComponent();
    const locationCard = screen.queryByText('Location');
    expect(locationCard).not.toBeNull();
    const destinationCard = screen.queryByText('Destination');
    expect(destinationCard).not.toBeNull();
  });

  it('should render the walk, view routes, and vehicle options', () => {
    renderComponent();
    const walkOption = screen.queryByText('Walk');
    expect(walkOption).not.toBeNull();
    const viewRoutesOption = screen.queryByText('View Routes');
    expect(viewRoutesOption).not.toBeNull();
    const vehicleOption = screen.queryByText('Vehicle');
    expect(vehicleOption).not.toBeNull();
  });
  it('should navigate to the correct route when a card is clicked', () => {
    renderComponent();

    const locationCard = screen.getByText('Location');
    fireEvent.click(locationCard);
    

    expect(window.location.pathname).toBe('/From');
    

    const DestinationCard = screen.getByText('Destination');
    fireEvent.click(DestinationCard);
    

    expect(window.location.pathname).toBe('/UserWhereTo');

  });

});
