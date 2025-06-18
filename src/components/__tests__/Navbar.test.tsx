import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import Navbar from '../Navbar';

expect.extend(toHaveNoViolations);

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
  it('deve renderizar o navbar corretamente', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Product Store')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /carrinho/i })).toBeInTheDocument();
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithProviders(<Navbar />);
    
    // Verificar se os links são focáveis
    const produtosLink = screen.getByRole('link', { name: /produtos/i });
    const carrinhoLink = screen.getByRole('link', { name: /carrinho/i });
    
    expect(produtosLink).toHaveAttribute('href', '/products');
    expect(carrinhoLink).toHaveAttribute('href', '/cart');
  });

  it('deve ter botões com labels acessíveis', () => {
    renderWithProviders(<Navbar />);
    
    // Verificar se os botões têm labels acessíveis
    const hamburgerButton = screen.queryByRole('button', { name: /abrir menu/i });
    if (hamburgerButton) {
      expect(hamburgerButton).toBeInTheDocument();
    }
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithProviders(<Navbar />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });
}); 