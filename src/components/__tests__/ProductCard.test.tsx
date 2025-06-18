import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProductCard from '../ProductCard';

expect.extend(toHaveNoViolations);

// Mock do contexto do carrinho
const mockAddItem = jest.fn();
const mockItems: any[] = [];

jest.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    items: mockItems,
  }),
}));

const mockProduct = {
  id: 1,
  title: 'Produto Teste',
  price: 99.99,
  description: 'Descrição do produto teste para verificar se está funcionando corretamente',
  category: {
    id: 1,
    name: 'Eletrônicos',
    image: 'https://example.com/category.jpg'
  },
  images: ['https://example.com/product.jpg'],
  creationAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  rating: { rate: 4.5, count: 120 },
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o produto corretamente', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
    expect(screen.getByText('Ver Detalhes')).toBeInTheDocument();
  });

  it('deve ter imagem clicável que navega para detalhes do produto', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const productImage = screen.getByAltText('Produto Teste');
    expect(productImage).toBeInTheDocument();
    
    // Verificar se a imagem está dentro de um link
    const imageLink = productImage.closest('a');
    expect(imageLink).toHaveAttribute('href', '/products/1');
  });

  it('deve ter título clicável que navega para detalhes do produto', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const productTitle = screen.getByText('Produto Teste');
    expect(productTitle).toBeInTheDocument();
    
    // Verificar se o título está dentro de um link
    const titleLink = productTitle.closest('a');
    expect(titleLink).toHaveAttribute('href', '/products/1');
  });

  it('deve adicionar produto ao carrinho quando clicar no botão', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByText('Adicionar');
    fireEvent.click(addButton);
    
    expect(mockAddItem).toHaveBeenCalledWith({
      id: 1,
      title: 'Produto Teste',
      price: 99.99,
      image: 'https://example.com/product.jpg'
    });
  });

  it('deve mostrar botão "Ver Detalhes" que navega para detalhes do produto', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const detailsButton = screen.getByText('Ver Detalhes');
    expect(detailsButton).toBeInTheDocument();
    
    // Verificar se o botão está dentro de um link
    const detailsLink = detailsButton.closest('a');
    expect(detailsLink).toHaveAttribute('href', '/products/1');
  });

  it('deve truncar descrição longa', () => {
    const productWithLongDescription = {
      ...mockProduct,
      description: 'Esta é uma descrição muito longa que deve ser truncada para caber no card do produto. Ela deve ter mais de 100 caracteres para testar a funcionalidade de truncamento que foi implementada no componente ProductCard.'
    };
    
    renderWithRouter(<ProductCard product={productWithLongDescription} />);
    
    const description = screen.getByText(/Esta é uma descrição muito longa/);
    expect(description.textContent).toContain('...');
  });

  it('deve usar imagem placeholder quando não há imagens', () => {
    const productWithoutImages = {
      ...mockProduct,
      images: []
    };
    
    renderWithRouter(<ProductCard product={productWithoutImages} />);
    
    const productImage = screen.getByAltText('Produto Teste');
    expect(productImage).toHaveAttribute('src', '/placeholder.svg');
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<ProductCard product={mockProduct} />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });
}); 