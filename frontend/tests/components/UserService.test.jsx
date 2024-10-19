import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserService from '../../src/pages/UserPages/UserService';
import { describe, it, expect } from 'vitest';
import {fetchUserNotifications} from '../../src/api/functions'; 
import '@testing-library/jest-dom';



const ReturnsPage = () => <div>Returns Page</div>;
const ReservePage = () => <div>Reserve Page</div>;
const CampusMapPage = () => <div>Campus Map Page</div>;
const RentPage = () => <div>Rent Page</div>;
const BusSchedulePage = () => <div>Bus Page</div>;
const FinesPage = () => <div>Fines Page</div>;





vi.mock('../../src/api/functions',()=>({
    fetchUserNotifications:vi.fn()
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
describe('UseService Component', () => {
    const renderComponent = (initialEntries = ['/']) => {
      render(
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/" element={<UserService />} />
            <Route path="/Returns" element={<ReturnsPage />} />
            <Route path="/UserReserve" element={<ReservePage/>} />
            <Route path="/UserMap" element={<CampusMapPage />} />
            <Route path="/UserRent" element={<RentPage />} />
            <Route path="/UserBuses" element={<BusSchedulePage />} />
            <Route path="/UserFines" element={<FinesPage />} />
          </Routes>
        </MemoryRouter>
      );
    };
    beforeEach(() => {
       
        vi.clearAllMocks();
      });
      it('should call fetchUserNotifications on mount', async () => {

        const mockNotifications = [
            { id: '1', Title: 'Notification 1', Body: 'Body of notification 1', Sender: 'Sender 1', isRead: false },
            { id: '2', Title: 'Notification 2', Body: 'Body of notification 2', Sender: 'Sender 2', isRead: true },
          ];

          fetchUserNotifications.mockResolvedValueOnce(mockNotifications);

          renderComponent();
          expect(fetchUserNotifications).toHaveBeenCalledWith('12345');
          expect(screen.queryByText('Body of notification 1...')).not.toBeInTheDocument();

     
      });
      it('should navigate to the Returns page when Returns card is clicked', () => {
        renderComponent();
        const FinesCards = screen.getByText('Returns');
        expect(FinesCards).toBeInTheDocument();
        const findLink = FinesCards.closest('a');
        expect(findLink).toBeInTheDocument();
        expect(findLink.getAttribute('href')).toBe('/Returns'); 
    
    
        fireEvent.click(findLink);
    
    
        expect(screen.getByText('Returns Page')).toBeInTheDocument();
       
      });
      it('should navigate to the Reserve page when Resserve card is clicked', () => {
        renderComponent();
        const ReserveCards = screen.getByText('Reserve');
        expect(ReserveCards).toBeInTheDocument();
        const findLink = ReserveCards.closest('a');
        expect(findLink).toBeInTheDocument();
        expect(findLink.getAttribute('href')).toBe('/UserReserve'); 
    
    
        fireEvent.click(findLink);
    
    
        expect(screen.getByText('Reserve Page')).toBeInTheDocument();
       
      });
      it('should navigate to the Campus map page when Campus map  card is clicked', () => {
        renderComponent();
        const MapCards = screen.getByText('Campus Map');
        expect(MapCards).toBeInTheDocument();
        const findLink = MapCards.closest('a');
        expect(findLink).toBeInTheDocument();
        expect(findLink.getAttribute('href')).toBe('/UserMap'); 
    
    
        fireEvent.click(findLink);
    
    
        expect(screen.getByText('Campus Map Page')).toBeInTheDocument();
       
      });
      it('should navigate to the Rent page when  Rent  card is clicked', () => {
        renderComponent();
        const RentCards = screen.getByText('Rent');
        expect(RentCards).toBeInTheDocument();
        const findLink = RentCards.closest('a');
        expect(findLink).toBeInTheDocument();
        expect(findLink.getAttribute('href')).toBe('/UserRent'); 
    
    
        fireEvent.click(findLink);
    
    
        expect(screen.getByText('Rent Page')).toBeInTheDocument();
       
      });
      it('should navigate to the Bus page when Bus Schedule card is clicked', () => {
        renderComponent();
        const BusCards = screen.getByText('Bus Schedule');
        expect(BusCards).toBeInTheDocument();
        const findLink =  BusCards .closest('a');
        expect(findLink).toBeInTheDocument();
        expect(findLink.getAttribute('href')).toBe('/UserBuses'); 
    
    
        fireEvent.click(findLink);
    
    
        expect(screen.getByText('Bus Page')).toBeInTheDocument();
       
      });
      it('should navigate to the Fines page when Fine card is clicked', () => {
        renderComponent();
        const FineCards = screen.getByText('Fines');
        expect(FineCards).toBeInTheDocument();
        const findLink =  FineCards .closest('a');
        expect(findLink).toBeInTheDocument();
        expect(findLink.getAttribute('href')).toBe('/UserFines'); 
    
    
        fireEvent.click(findLink);
    
    
        expect(screen.getByText('Fines Page')).toBeInTheDocument();
       
      });
      it('should render images correctly', () => {
        renderComponent();
        expect(screen.getByAltText('Returns')).not.toBeNull();
        expect(screen.getByAltText('Reserve')).not.toBeNull();
        expect(screen.getByAltText('Campus_Map')).not.toBeNull();
        expect(screen.getByAltText('Rent')).not.toBeNull();
        expect(screen.getByAltText('Bus_Schedule')).not.toBeNull();
        expect(screen.getByAltText('Fines')).not.toBeNull();
      });
});