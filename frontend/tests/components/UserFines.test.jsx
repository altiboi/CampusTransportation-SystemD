import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import UserFines from '../../src/pages/UserPages/UserFines';
import { fetchUserFines, handleFinePayment } from '../../src/api/functions';
import { useAuth } from '../../src/contexts/AuthProvider';

// Mocking the API functions
vi.mock('../../src/api/functions', () => ({
  fetchUserFines: vi.fn(),
  handleFinePayment: vi.fn(),
}));

describe('UserFines Component', () => {
  const mockUser = { uid: 'user123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays a message when there are no fines', async () => {
    fetchUserFines.mockResolvedValueOnce([]);

    render(<UserFines currentUser={mockUser} />);

    expect(screen.getByText('Manage and Pay your Fines')).toBeInTheDocument();
    expect(screen.getByText('No fines found')).toBeInTheDocument();
  });

  it('displays fines when they are fetched', async () => {
    const mockFines = [
      {
        id: 'fine1',
        amount: 20,
        issuedAt: '2024-10-01T00:00:00Z',
        paid: false,
        rentalDetails: {
          dueReturnAt: '2024-10-01T12:00:00Z',
          returnedAt: '2024-10-01T15:00:00Z',
        },
      },
    ];
    fetchUserFines.mockResolvedValueOnce(mockFines);

    render(<UserFines currentUser={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('R 20')).toBeInTheDocument();
      expect(screen.getByText('Fine Issued: 10/1/2024')).toBeInTheDocument();
      (content) => content.toLowerCase().includes('3 hour overdue')
      expect(
        screen.getByText((content) => content.toLowerCase().includes('3 hours overdue'))
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Pay Now' })).toBeInTheDocument();
    });
  });

  it('handles fine payment and updates the fines list', async () => {
    const mockFines = [
      {
        id: 'fine1',
        amount: 20,
        issuedAt: '2024-10-01T00:00:00Z',
        paid: false,
        rentalDetails: {
          dueReturnAt: '2024-10-01T12:00:00Z',
          returnedAt: '2024-10-01T15:00:00Z',
        },
      },
    ];
    fetchUserFines.mockResolvedValueOnce(mockFines);
    handleFinePayment.mockResolvedValueOnce();

    render(<UserFines currentUser={mockUser} />);

    // Wait for the fine to be displayed
    await waitFor(() => {
      expect(screen.getByText('R 20')).toBeInTheDocument();
    });

    // Click the Pay Now button
    const payNowButton = screen.getByRole('button', { name: 'Pay Now' });
    fireEvent.click(payNowButton);

    // Check if handleFinePayment was called
    expect(handleFinePayment).toHaveBeenCalledWith('fine1');

    // Mock fetchUserFines to return updated fines
    fetchUserFines.mockResolvedValueOnce([
      {
        id: 'fine1',
        amount: 20,
        issuedAt: '2024-10-01T00:00:00Z',
        paid: true,
      },
    ]);

    // Wait for the fines to update
    await waitFor(() => {
      expect(screen.getByText('Paid')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Pay Now' })).not.toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', () => {

    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    render(<UserFines currentUser={mockUser} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(backSpy).toHaveBeenCalled();
  });
});
