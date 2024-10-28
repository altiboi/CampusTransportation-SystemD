import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import Returns from '../../src/pages/UserPages/Returns';
import { getRentalDetails, returnVehicleAndIssueFine } from '../../src/api/functions';
import { useAppContext } from '../../src/contexts/AppContext';

// Mock functions
vi.mock('../../src/contexts/AppContext', () => ({
  useAppContext: vi.fn(),
}));

// Mocking returnVehicleAndIssueFine and getRentalDetails
vi.mock('../../src/api/functions', () => ({
  getRentalDetails: vi.fn(),
  returnVehicleAndIssueFine: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const routerDom = await vi.importActual('react-router-dom');
  return { ...routerDom, useNavigate: () => mockNavigate };
});

describe('Returns Component', () => {
  const renderComponent = (props) =>
    render(
      <MemoryRouter>
        <Returns {...props} />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    useAppContext.mockReturnValue({
      setTitle: vi.fn(),
      setTask: vi.fn(),
    });
  });

  it('displays loading message initially', () => {
    getRentalDetails.mockImplementation(() => new Promise(() => {}));
    renderComponent({ currentUser: { currentRentalID: '12345' } });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message if there is no active rental', async () => {
    getRentalDetails.mockResolvedValueOnce(null);
    renderComponent({ currentUser: {} });

    await waitFor(() => {
      expect(screen.getByText('No active rental found.')).toBeInTheDocument();
    });
  });

  it('displays rental details when data is fetched successfully', async () => {
    const rentalDetails = {
        rentalID: '12345',
        vehicleImage: 'vehicle-image-url',
        vehicle: { make: 'Toyota', model: 'Camry' },
        rentalStation: { name: 'Downtown Station' },
        dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
      };

      getRentalDetails.mockResolvedValueOnce(rentalDetails);
    renderComponent({ currentUser: { currentRentalID: '12345' } });

    await waitFor(() => {
      expect(screen.getByText('Return Details')).toBeInTheDocument();
    });

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Rental Station: Downtown Station')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Return' })).toBeInTheDocument();
  });

  it('navigates to confirmation page on successful return with the right state', async () => {
    const rentalDetails = {
      rentalID: '12345',
      vehicleImage: 'vehicle-image-url',
      vehicle: { make: 'Toyota', model: 'Camry' },
      rentalStation: { name: 'Downtown Station' },
      dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
    };
    
    const fineDetails = { amount: 20, reason: 'Late return' };

    // Mocking the responses for getRentalDetails and returnVehicleAndIssueFine
    getRentalDetails.mockResolvedValueOnce(rentalDetails);
    returnVehicleAndIssueFine.mockResolvedValueOnce([{ fine: fineDetails, rentalDetails }]);

    renderComponent({ currentUser: { currentRentalID: '12345' } });

    const returnButton = await screen.findByRole('button', { name: 'Submit Return' });
    fireEvent.click(returnButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('displays error message if return process fails', async () => {
    getRentalDetails.mockResolvedValueOnce({
      rentalID: '12345',
      vehicleImage: 'vehicle-image-url',
      vehicle: { make: 'Toyota', model: 'Camry' },
      rentalStation: { name: 'Downtown Station' },
      dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
    });
    
    returnVehicleAndIssueFine.mockRejectedValueOnce(new Error('Return error'));

    renderComponent({ currentUser: { currentRentalID: '12345' } });

    const returnButton = await screen.findByRole('button', { name: 'Submit Return' });
    fireEvent.click(returnButton);

    await waitFor(() => {
      expect(screen.getByText('Error processing the return.')).toBeInTheDocument();
    });
  });
});
