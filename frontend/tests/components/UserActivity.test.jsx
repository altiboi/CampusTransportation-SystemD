import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserActivity from '../../src/pages/UserPages/UserActivity';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { getUserRentals } from '../../src/api/functions';

// Mock API function
vi.mock('../../src/api/functions', () => ({
  getUserRentals: vi.fn(),
}));

// Mock context providers
vi.mock('../../src/contexts/AppContext', () => ({
  useAppContext: () => ({
    setTitle: vi.fn(),
    setTask: vi.fn(),
  }),
}));

vi.mock('../../src/contexts/AuthProvider', () => ({
  useAuth: () => ({
    currentUser: { uid: '12345', name: 'Test User' },
  }),
}));

describe('UserActivity Component', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <UserActivity currentUser={{ uid: '12345' }} />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it('fetches and displays rentals correctly for upcoming', async () => {
    const mockRentals = [
      {
        id: '1',
        type: 'bike',
        rentedAt: new Date(Date.now() + 86400000).toISOString(), // Upcoming
        dueReturnAt: new Date(Date.now() + 172800000).toISOString(),
        returnedAt: null,
      },
    ];

    getUserRentals.mockResolvedValueOnce(mockRentals);

    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));

    expect(screen.getByText('bike reserved')).toBeInTheDocument();
  });
  it('fetches and displays rentals correctly for current', async () => {
    const mockRentals = [
      {
        id: '2',
        type: 'car',
        rentedAt: new Date(Date.now() - 86400000).toISOString(), // Current
        dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
        returnedAt: null,
      },
    ];

    getUserRentals.mockResolvedValueOnce(mockRentals);

    renderComponent();


    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));
    fireEvent.click(screen.getAllByText('Current')[0]);
    expect(screen.getByText((content) => content.toLowerCase().includes('car'))).toBeInTheDocument();
;
  });
  it('fetches and displays rentals correctly for history', async () => {
    const mockRentals = [
      {
        id: '3',
        type: 'scooter',
        rentedAt: new Date(Date.now() - 172800000).toISOString(), // History
        dueReturnAt: new Date(Date.now() - 86400000).toISOString(),
        returnedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    getUserRentals.mockResolvedValueOnce(mockRentals);

    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));
    fireEvent.click(screen.getAllByText('History')[0]);
    expect(screen.getByText((content) => content.toLowerCase().includes('scooter'))).toBeInTheDocument();
  });
  it('displays "No upcoming rentals" when there are no upcoming rentals', async () => {
    getUserRentals.mockResolvedValueOnce([
      {
        id: '2',
        type: 'car',
        rentedAt: new Date(Date.now() - 86400000).toISOString(),
        dueReturnAt: new Date(Date.now() + 86400000).toISOString(),
        returnedAt: null,
      },
    ]);

    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));
    expect(screen.getByText('No upcoming rentals.')).toBeInTheDocument();
  });

  it('displays "No current rentals" when there are no current rentals', async () => {
    getUserRentals.mockResolvedValueOnce([
      {
        id: '1',
        type: 'bike',
        rentedAt: new Date(Date.now() + 86400000).toISOString(),
        dueReturnAt: new Date(Date.now() + 172800000).toISOString(),
        returnedAt: null,
      },
    ]);

    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));
    fireEvent.click(screen.getAllByText('Current')[0]);
    expect(screen.getByText('No current rentals.')).toBeInTheDocument();
  });

  it('displays "No rental history" when there is no history', async () => {
    getUserRentals.mockResolvedValueOnce([
      {
        id: '1',
        type: 'bike',
        rentedAt: new Date(Date.now() + 86400000).toISOString(),
        dueReturnAt: new Date(Date.now() + 172800000).toISOString(),
        returnedAt: null,
      },
    ]);

    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));
    fireEvent.click(screen.getAllByText('History')[0]);
    expect(screen.getByText('No rental history.')).toBeInTheDocument();
  });

  it('changes active tab on button click', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByText('Loading rentals...'));
    expect(screen.getByRole('button', { name: 'Upcoming' })).toHaveClass('active');

    // Click 'Current' tab and verify active class
    fireEvent.click(screen.getAllByText('Current')[0]);
    expect(screen.getByRole('button', { name: 'Current' })).toHaveClass('active');

    // Click 'History' tab and verify active class
    fireEvent.click(screen.getAllByText('History')[0]);
    expect(screen.getByRole('button', { name: 'History' })).toHaveClass('active');
  });

  it('shows loading message while rentals are being fetched', () => {
    getUserRentals.mockImplementation(() => new Promise(() => {})); // Mock unresolved promise to simulate loading

    renderComponent();
    expect(screen.getByText('Loading rentals...')).toBeInTheDocument();
  });
});
