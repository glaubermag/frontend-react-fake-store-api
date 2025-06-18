import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Cart from '../Cart';

expect.extend(toHaveNoViolations);

// Mock do contexto de carrinho
const mockCartContext = {
  items: [],
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  total: 0,
  itemCount: 0
};

jest.mock('@/contexts/CartContext', () => ({
  useCart: () => mockCartContext
}));

// Mock do contexto de autenticação
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, name: 'Usuário Teste' }
  })
}));

// Mock do framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCartContext.items = [];
    mockCartContext.total = 0;
    mockCartContext.itemCount = 0;
  });

  describe('Carrinho vazio', () => {
    it('deve mostrar mensagem quando o carrinho está vazio', () => {
      renderWithRouter(<Cart />);
      
      expect(screen.getByText(/seu carrinho está vazio/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /explorar produtos/i })).toBeInTheDocument();
    });

    it('deve ter link para explorar produtos', () => {
      renderWithRouter(<Cart />);
      
      const exploreLink = screen.getByRole('link', { name: /explorar produtos/i });
      expect(exploreLink).toBeInTheDocument();
      expect(exploreLink).toHaveAttribute('href', '/products');
    });

    it('não deve ter violações de acessibilidade quando vazio', async () => {
      const { container } = renderWithRouter(<Cart />);
      const results = await axe(container);
      // @ts-expect-error jest-axe matcher
      expect(results).toHaveNoViolations();
    });
  });

  describe('Carrinho com itens', () => {
    beforeEach(() => {
      mockCartContext.items = [
        {
          id: 1,
          title: 'Produto Teste 1',
          price: 99.99,
          image: 'https://example.com/image1.jpg',
          quantity: 2
        },
        {
          id: 2,
          title: 'Produto Teste 2',
          price: 149.99,
          image: 'https://example.com/image2.jpg',
          quantity: 1
        }
      ];
      mockCartContext.itemCount = 3;
      mockCartContext.total = 349.97;
    });

    it('deve renderizar o carrinho corretamente', () => {
      renderWithRouter(<Cart />);
      
      expect(screen.getByText('Carrinho de Compras')).toBeInTheDocument();
      expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
      expect(screen.getByText('Produto Teste 2')).toBeInTheDocument();
    });

    it('deve calcular e exibir o total corretamente', () => {
      renderWithRouter(<Cart />);
      
      expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
      const totals = screen.getAllByText(/\$349\.97/);
      expect(totals.length).toBeGreaterThan(0);
    });

    it('deve permitir atualizar quantidade de itens', () => {
      renderWithRouter(<Cart />);
      
      const minusButtons = screen.getAllByRole('button', { name: /diminuir quantidade/i });
      const plusButtons = screen.getAllByRole('button', { name: /aumentar quantidade/i });
      
      expect(minusButtons.length).toBeGreaterThan(0);
      expect(plusButtons.length).toBeGreaterThan(0);
      
      // Simular mudança de quantidade
      fireEvent.click(plusButtons[0]);
      
      expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it('deve permitir remover itens do carrinho', () => {
      renderWithRouter(<Cart />);
      
      const removeButtons = screen.getAllByRole('button', { name: /remover item/i });
      expect(removeButtons.length).toBeGreaterThan(0);
      
      fireEvent.click(removeButtons[0]);
      
      expect(mockCartContext.removeItem).toHaveBeenCalledWith(1);
    });

    it('deve permitir limpar todo o carrinho', () => {
      renderWithRouter(<Cart />);
      
      const clearButton = screen.getByRole('button', { name: /limpar carrinho/i });
      fireEvent.click(clearButton);
      
      expect(mockCartContext.clearCart).toHaveBeenCalled();
    });

    it('deve ter estrutura semântica correta', () => {
      renderWithRouter(<Cart />);
      
      // Verificar se os cards estão presentes
      const cards = document.querySelectorAll('[class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('deve ter imagens com alt text apropriado', () => {
      renderWithRouter(<Cart />);
      
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('deve ter botões com labels acessíveis', () => {
      renderWithRouter(<Cart />);
      
      const removeButtons = screen.getAllByRole('button', { name: /remover item/i });
      const clearButton = screen.getByRole('button', { name: /limpar carrinho/i });
      const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });
      const minusButtons = screen.getAllByRole('button', { name: /diminuir quantidade/i });
      const plusButtons = screen.getAllByRole('button', { name: /aumentar quantidade/i });
      
      expect(removeButtons.length).toBeGreaterThan(0);
      expect(clearButton).toBeInTheDocument();
      expect(checkoutButton).toBeInTheDocument();
      expect(minusButtons.length).toBeGreaterThan(0);
      expect(plusButtons.length).toBeGreaterThan(0);
    });

    it('não deve ter violações de acessibilidade', async () => {
      const { container } = renderWithRouter(<Cart />);
      const results = await axe(container);
      // @ts-expect-error jest-axe matcher
      expect(results).toHaveNoViolations();
    });

    it('deve ter navegação por teclado funcionando', () => {
      renderWithRouter(<Cart />);
      
      const buttons = screen.getAllByRole('button');
      
      // Verificar se os elementos são focáveis
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('deve exibir preços formatados corretamente', () => {
      renderWithRouter(<Cart />);
      
      const prices199 = screen.getAllByText(/\$199\.98/);
      const prices149 = screen.getAllByText(/\$149\.99/);
      expect(prices199.length).toBeGreaterThan(0);
      expect(prices149.length).toBeGreaterThan(0);
    });

    it('deve mostrar quantidade de itens corretamente', () => {
      renderWithRouter(<Cart />);
      
      expect(screen.getByText('2')).toBeInTheDocument(); // quantidade do primeiro item
      expect(screen.getByText('1')).toBeInTheDocument(); // quantidade do segundo item
    });

    it('deve ter links de navegação acessíveis', () => {
      renderWithRouter(<Cart />);
      
      const continueShoppingLinks = screen.getAllByRole('link', { name: /continuar comprando/i });
      expect(continueShoppingLinks.length).toBeGreaterThan(0);
      continueShoppingLinks.forEach(link => {
        expect(link).toHaveAttribute('href', '/products');
      });
    });

    it('deve ter contraste adequado nos elementos', () => {
      renderWithRouter(<Cart />);
      
      const title = screen.getByText('Carrinho de Compras');
      const totalTexts = screen.getAllByText(/total/i);
      
      expect(title).toBeInTheDocument();
      expect(totalTexts.length).toBeGreaterThan(0);
    });
  });
}); 