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
    const mockRentalDetails = {
      rentalID: '12345',
      vehicleID: 'v789',
      vehicleImage: 'vehicle-image-url',
      vehicle: { make: 'Toyota', model: 'Camry' },
      rentalStation: { name: 'Downtown Station' },
      dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
    };


    getRentalDetails.mockResolvedValue(mockRentalDetails);
    
    renderComponent({ 
      currentUser: { 
        currentRentalID: '12345'
      } 
    });


    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });


  });

  it('navigates to confirmation page on successful return', async () => {
    const mockRentalDetails = {
      rentalID: '12345',
      vehicleID: 'v789',
      vehicleImage: 'vehicle-image-url',
      vehicle: { make: 'Toyota', model: 'Camry' },
      rentalStation: { name: 'Downtown Station' },
      dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
    };
    
    const mockReturnData = {
      rentalDetails: mockRentalDetails,
      fine: { amount: 20, reason: 'Late return' }
    };

    getRentalDetails.mockResolvedValue(mockRentalDetails);
    returnVehicleAndIssueFine.mockResolvedValue(mockReturnData);

    renderComponent({ 
      currentUser: { 
        currentRentalID: '12345'
      } 
    });

    // Wait for the button to appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Submit Return/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit Return/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ReturnConfirmation', {
        state: {
          returnDetails: mockRentalDetails,
          fineDetails: mockReturnData.fine,
          vehicle: mockRentalDetails.vehicle
        }
      });
    });
  });

  it('displays error message if return process fails', async () => {
    const mockRentalDetails = {
      rentalID: '12345',
      vehicleID: 'v789',
      vehicleImage: 'vehicle-image-url',
      vehicle: { make: 'Toyota', model: 'Camry' },
      rentalStation: { name: 'Downtown Station' },
      dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
    };

    getRentalDetails.mockResolvedValue(mockRentalDetails);
    returnVehicleAndIssueFine.mockRejectedValue(new Error('Return error'));

    renderComponent({ 
      currentUser: { 
        currentRentalID: '12345'
      } 
    });


    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Submit Return/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit Return/i }));

    await waitFor(() => {
      expect(screen.getByText('Error processing the return.')).toBeInTheDocument();
    });
  });
});