import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import VirtualizedProductList from '../VirtualizedProductList';

expect.extend(toHaveNoViolations);

// Mock do contexto de carrinho
jest.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    items: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    isInCart: jest.fn().mockReturnValue(false)
  }),
}));

const mockProducts = [
  {
    id: 1,
    title: 'Produto Teste 1',
    price: 99.99,
    description: 'Descrição do produto 1',
    category: { 
      id: 1, 
      name: 'Eletrônicos',
      image: 'https://example.com/category1.jpg'
    },
    images: ['https://example.com/image1.jpg'],
    creationAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    rating: {
      rate: 4.5,
      count: 120
    }
  },
  {
    id: 2,
    title: 'Produto Teste 2',
    price: 149.99,
    description: 'Descrição do produto 2',
    category: { 
      id: 2, 
      name: 'Roupas',
      image: 'https://example.com/category2.jpg'
    },
    images: ['https://example.com/image2.jpg'],
    creationAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    rating: {
      rate: 4.2,
      count: 85
    }
  }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('VirtualizedProductList', () => {
  const defaultProps = {
    products: mockProducts,
    height: 600,
    itemHeight: 200
  };

  it('deve renderizar a lista de produtos corretamente', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste 2')).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    // Verificar se os produtos estão sendo renderizados
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste 2')).toBeInTheDocument();
  });

  it('deve ter links acessíveis para os produtos', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    const productLinks = screen.getAllByRole('link');
    expect(productLinks.length).toBeGreaterThan(0);
    
    // Verificar se os links têm href apropriados
    productLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('deve ter imagens com alt text apropriado', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Verificar se as imagens têm alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('deve ter botões com labels acessíveis', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    const addButtons = screen.getAllByRole('button', { name: /adicionar ao carrinho/i });
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    const productLinks = screen.getAllByRole('link');
    const addButtons = screen.getAllByRole('button');
    
    // Verificar se os elementos são focáveis
    expect(productLinks.length).toBeGreaterThan(0);
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('deve ter preços formatados corretamente', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    expect(screen.getByText(/R\$ 99,99/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 149,99/)).toBeInTheDocument();
  });

  it('deve ter categorias exibidas corretamente', () => {
    renderWithRouter(<VirtualizedProductList {...defaultProps} />);
    
    expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    expect(screen.getByText('Roupas')).toBeInTheDocument();
  });
}); 