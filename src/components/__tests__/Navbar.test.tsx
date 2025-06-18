import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import Navbar from '../Navbar';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {component}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('renders correctly with all navigation links', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Product Store')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /produtos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '', hidden: true, })).toHaveAttribute('href', '/cart');
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('displays cart link', () => {
    renderWithProviders(<Navbar />);
    
    const cartLink = screen.getByRole('link', { name: '', hidden: true });
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderWithProviders(<Navbar />);
    
    const hamburgerButton = screen.getByRole('button', { name: /abrir menu/i });
    expect(hamburgerButton).toBeInTheDocument();
    
    fireEvent.click(hamburgerButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes mobile menu when close button is clicked', () => {
    renderWithProviders(<Navbar />);
    
    const hamburgerButton = screen.getByRole('button', { name: /abrir menu/i });
    fireEvent.click(hamburgerButton);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
}); 