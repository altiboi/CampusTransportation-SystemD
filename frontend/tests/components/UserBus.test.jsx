import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserBuses from '../../src/pages/UserPages/UserBuses';
import { AppProvider } from '../../src/contexts/AppContext'; 

// Mock functions for the context
const mockSetTitle = vi.fn();
const mockSetTask = vi.fn();

const MockedAppProvider = ({ children }) => {
    return (
        <AppProvider value={{ setTitle: mockSetTitle, setTask: mockSetTask }}>
            {children}
        </AppProvider>
    );
};

const renderWithContext = (ui) => {
    return render(<MockedAppProvider>{ui}</MockedAppProvider>);
};

describe('UserBuses Component', () => {
    beforeEach(() => {
        mockSetTitle.mockClear();
        mockSetTask.mockClear();
    });

    it('navigates back when back button is clicked', () => {
        const historyBackMock = vi.spyOn(window.history, 'back').mockImplementation(() => {});

        renderWithContext(<UserBuses />);
        
        const backButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(backButton);
        
        expect(historyBackMock).toHaveBeenCalled();
        historyBackMock.mockRestore();
    });

    it('navigates to the bus schedule on view button click', () => {
        delete window.location; 
        window.location = { href: '' };

        renderWithContext(<UserBuses />);
        
        const viewButton = screen.getByRole('button', { name: /view/i });
        fireEvent.click(viewButton);

        expect(window.location.href).toBe('/UserBusSchedule');
    });

    it('initiates download when download button is clicked', () => {
        const createElementMock = vi.spyOn(document, 'createElement');
        
        renderWithContext(<UserBuses />);
        
        const downloadButton = screen.getByRole('button', { name: /download/i });
        fireEvent.click(downloadButton);
        
        expect(createElementMock).toHaveBeenCalledWith('a');

        createElementMock.mockRestore();
    });
});
