import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProductDetail from '../ProductDetail';

expect.extend(toHaveNoViolations);

// Mock do contexto de carrinho
const mockCartContext = {
  items: [],
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  isInCart: jest.fn().mockReturnValue(false)
};

jest.mock('@/contexts/CartContext', () => ({
  useCart: () => mockCartContext,
}));

// Mock do React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: {
      id: 1,
      title: 'Produto Detalhado',
      price: 199.99,
      description: 'Descrição detalhada do produto com muitas informações sobre suas características, benefícios e especificações técnicas.',
      category: { 
        id: 1, 
        name: 'Eletrônicos',
        image: 'https://example.com/category1.jpg'
      },
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ],
      creationAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      rating: {
        rate: 4.5,
        count: 120
      }
    },
    isLoading: false,
    error: null
  }),
}));

// Mock do useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os detalhes do produto corretamente', () => {
    renderWithRouter(<ProductDetail />);
    
    expect(screen.getByText('Produto Detalhado')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 199,99/)).toBeInTheDocument();
    expect(screen.getByText(/descrição detalhada/i)).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há headings apropriados
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verificar se há título do produto
    expect(screen.getByText('Produto Detalhado')).toBeInTheDocument();
  });

  it('deve ter galeria de imagens', () => {
    renderWithRouter(<ProductDetail />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Verificar se as imagens têm alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('deve ter informações do produto', () => {
    renderWithRouter(<ProductDetail />);
    
    expect(screen.getByText('Produto Detalhado')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 199,99/)).toBeInTheDocument();
    expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
  });

  it('deve ter descrição completa', () => {
    renderWithRouter(<ProductDetail />);
    
    expect(screen.getByText(/descrição detalhada do produto/i)).toBeInTheDocument();
  });

  it('deve ter rating e avaliações', () => {
    renderWithRouter(<ProductDetail />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  it('deve ter botão de adicionar ao carrinho', () => {
    renderWithRouter(<ProductDetail />);
    
    const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    expect(addButton).toBeInTheDocument();
  });

  it('deve ter seletor de quantidade', () => {
    renderWithRouter(<ProductDetail />);
    
    const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });
    expect(quantityInput).toBeInTheDocument();
  });

  it('deve ter breadcrumb de navegação', () => {
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há breadcrumb
    expect(screen.getByText(/início/i)).toBeInTheDocument();
    expect(screen.getByText(/produtos/i)).toBeInTheDocument();
  });

  it('deve ter produtos relacionados', () => {
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há seção de produtos relacionados
    expect(screen.getByText(/produtos relacionados/i)).toBeInTheDocument();
  });

  it('deve ter seção de avaliações', () => {
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há seção de avaliações
    expect(screen.getByText(/avaliações/i)).toBeInTheDocument();
  });

  it('deve ter seção de especificações', () => {
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há seção de especificações
    expect(screen.getByText(/especificações/i)).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<ProductDetail />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithRouter(<ProductDetail />);
    
    const interactiveElements = screen.getAllByRole('button');
    const links = screen.getAllByRole('link');
    
    expect(interactiveElements.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
  });

  it('deve ter loading state', () => {
    // Mock do loading state
    jest.doMock('@tanstack/react-query', () => ({
      useQuery: () => ({
        data: null,
        isLoading: true,
        error: null
      }),
    }));
    
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há indicador de loading
    const loadingElement = screen.getByText(/carregando/i);
    expect(loadingElement).toBeInTheDocument();
  });

  it('deve ter error state', () => {
    // Mock do error state
    jest.doMock('@tanstack/react-query', () => ({
      useQuery: () => ({
        data: null,
        isLoading: false,
        error: { message: 'Erro ao carregar produto' }
      }),
    }));
    
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há mensagem de erro
    const errorElement = screen.getByText(/erro ao carregar produto/i);
    expect(errorElement).toBeInTheDocument();
  });

  it('deve ter estado de produto não encontrado', () => {
    // Mock do estado de produto não encontrado
    jest.doMock('@tanstack/react-query', () => ({
      useQuery: () => ({
        data: null,
        isLoading: false,
        error: null
      }),
    }));
    
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há mensagem de produto não encontrado
    const notFoundElement = screen.getByText(/produto não encontrado/i);
    expect(notFoundElement).toBeInTheDocument();
  });

  it('deve ter responsividade', () => {
    renderWithRouter(<ProductDetail />);
    
    // Verificar se há classes responsivas
    const container = screen.getByRole('main');
    expect(container).toHaveClass('container');
  });

  it('deve ter funcionalidade de adicionar ao carrinho', async () => {
    renderWithRouter(<ProductDetail />);
    
    const addButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });
    
    // Simular mudança de quantidade
    fireEvent.change(quantityInput, { target: { value: '2' } });
    expect(quantityInput).toHaveValue(2);
    
    // Simular clique no botão
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockCartContext.addToCart).toHaveBeenCalled();
    });
  });

  it('deve ter funcionalidade de alterar quantidade', () => {
    renderWithRouter(<ProductDetail />);
    
    const quantityInput = screen.getByRole('spinbutton', { name: /quantidade/i });
    
    // Simular mudanças de quantidade
    fireEvent.change(quantityInput, { target: { value: '3' } });
    expect(quantityInput).toHaveValue(3);
    
    fireEvent.change(quantityInput, { target: { value: '1' } });
    expect(quantityInput).toHaveValue(1);
  });

  it('deve ter funcionalidade de navegação entre imagens', () => {
    renderWithRouter(<ProductDetail />);
    
    const imageButtons = screen.getAllByRole('button', { name: /imagem/i });
    expect(imageButtons.length).toBeGreaterThan(0);
    
    // Simular clique em uma imagem
    if (imageButtons.length > 0) {
      fireEvent.click(imageButtons[0]);
    }
  });

  it('deve ter funcionalidade de zoom na imagem', () => {
    renderWithRouter(<ProductDetail />);
    
    const mainImage = screen.getByAltText('Produto Detalhado');
    expect(mainImage).toBeInTheDocument();
    
    // Simular clique para zoom
    fireEvent.click(mainImage);
  });

  it('deve ter funcionalidade de compartilhamento', () => {
    renderWithRouter(<ProductDetail />);
    
    const shareButton = screen.getByRole('button', { name: /compartilhar/i });
    expect(shareButton).toBeInTheDocument();
    
    // Simular clique no botão de compartilhamento
    fireEvent.click(shareButton);
  });

  it('deve ter funcionalidade de favoritar', () => {
    renderWithRouter(<ProductDetail />);
    
    const favoriteButton = screen.getByRole('button', { name: /favoritar/i });
    expect(favoriteButton).toBeInTheDocument();
    
    // Simular clique no botão de favoritar
    fireEvent.click(favoriteButton);
  });

  it('deve ter funcionalidade de voltar', () => {
    renderWithRouter(<ProductDetail />);
    
    const backButton = screen.getByRole('button', { name: /voltar/i });
    expect(backButton).toBeInTheDocument();
    
    // Simular clique no botão de voltar
    fireEvent.click(backButton);
  });

  it('deve ter funcionalidade de adicionar avaliação', () => {
    renderWithRouter(<ProductDetail />);
    
    const reviewButton = screen.getByRole('button', { name: /adicionar avaliação/i });
    expect(reviewButton).toBeInTheDocument();
    
    // Simular clique no botão de adicionar avaliação
    fireEvent.click(reviewButton);
  });

  it('deve ter funcionalidade de ver todas as avaliações', () => {
    renderWithRouter(<ProductDetail />);
    
    const allReviewsButton = screen.getByRole('button', { name: /ver todas as avaliações/i });
    expect(allReviewsButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(allReviewsButton);
  });

  it('deve ter funcionalidade de filtrar avaliações', () => {
    renderWithRouter(<ProductDetail />);
    
    const filterSelect = screen.getByRole('combobox', { name: /filtrar avaliações/i });
    expect(filterSelect).toBeInTheDocument();
    
    // Simular mudança de filtro
    fireEvent.change(filterSelect, { target: { value: '5' } });
    expect(filterSelect).toHaveValue('5');
  });

  it('deve ter funcionalidade de ordenar avaliações', () => {
    renderWithRouter(<ProductDetail />);
    
    const sortSelect = screen.getByRole('combobox', { name: /ordenar avaliações/i });
    expect(sortSelect).toBeInTheDocument();
    
    // Simular mudança de ordenação
    fireEvent.change(sortSelect, { target: { value: 'recent' } });
    expect(sortSelect).toHaveValue('recent');
  });
}); 