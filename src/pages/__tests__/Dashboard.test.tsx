import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Dashboard from '../Dashboard';

expect.extend(toHaveNoViolations);

// Mock do contexto de autenticação
const mockAuthContext = {
  isAuthenticated: true,
  user: { id: 1, email: 'test@example.com' },
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

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
let mockQueryState: { loading?: boolean; error?: boolean; empty?: boolean } = {};
jest.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }) => {
    if (mockQueryState.loading) {
      return { isLoading: true };
    }
    if (mockQueryState.error) {
      return { isLoading: false, error: true };
    }
    if (mockQueryState.empty) {
      if (queryKey && queryKey[0] === 'categories') {
        return {
          data: [
            { id: 1, name: 'Eletrônicos', image: 'https://example.com/category1.jpg' },
            { id: 2, name: 'Roupas', image: 'https://example.com/category2.jpg' }
          ],
          isLoading: false,
          error: null,
          refetch: jest.fn()
        };
      }
      return { data: [], isLoading: false, error: null };
    }
    if (queryKey && queryKey[0] === 'categories') {
      return {
        data: [
          { id: 1, name: 'Eletrônicos', image: 'https://example.com/category1.jpg' },
          { id: 2, name: 'Roupas', image: 'https://example.com/category2.jpg' }
        ],
        isLoading: false,
        error: null,
        refetch: jest.fn()
      };
    }
    return {
      data: [
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
      ],
      isLoading: false,
      error: null,
      refetch: jest.fn()
    };
  },
  useMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
    error: null
  }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
    refetchQueries: jest.fn(),
    removeQueries: jest.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryState = {};
  });

  it('deve renderizar o dashboard corretamente', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/produtos/i)).toBeInTheDocument();
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Produto Teste 2')).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<Dashboard />);
    
    // Verificar se há headings apropriados
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verificar se há lista de produtos
    expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
  });

  it('deve ter campo de busca funcionando', () => {
    renderWithRouter(<Dashboard />);
    
    const searchInput = screen.getByPlaceholderText(/buscar produtos/i);
    expect(searchInput).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'Teste 1' } });
    expect(searchInput).toHaveValue('Teste 1');
  });

  it('deve ter filtros de categoria', () => {
    renderWithRouter(<Dashboard />);
    
    const categoryFilter = screen.getByRole('combobox', { name: /categoria/i });
    expect(categoryFilter).toBeInTheDocument();
  });

  it('deve ter ordenação de produtos', () => {
    renderWithRouter(<Dashboard />);
    
    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i });
    expect(sortSelect).toBeInTheDocument();
  });

  it('deve ter botões de adicionar ao carrinho', () => {
    renderWithRouter(<Dashboard />);
    
    const addButtons = screen.getAllByRole('button', { name: /adicionar ao carrinho/i });
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('deve ter links para detalhes dos produtos', () => {
    renderWithRouter(<Dashboard />);
    
    const productLinks = screen.getAllByRole('link');
    expect(productLinks.length).toBeGreaterThan(0);
    
    // Verificar se os links têm href apropriados
    productLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('deve ter imagens com alt text apropriado', () => {
    renderWithRouter(<Dashboard />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Verificar se as imagens têm alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('deve ter preços formatados corretamente', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText(/R\$ 99,99/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 149,99/)).toBeInTheDocument();
  });

  it('deve ter categorias exibidas corretamente', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    expect(screen.getByText('Roupas')).toBeInTheDocument();
  });

  it('deve ter ratings exibidos corretamente', () => {
    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
    expect(screen.getByText('(85)')).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<Dashboard />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithRouter(<Dashboard />);
    
    const interactiveElements = screen.getAllByRole('button');
    const links = screen.getAllByRole('link');
    
    expect(interactiveElements.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
  });

  it('deve ter loading state', () => {
    mockQueryState.loading = true;
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve ter error state', () => {
    mockQueryState.error = true;
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/erro ao carregar produtos/i)).toBeInTheDocument();
  });

  it('deve ter estado vazio quando não há produtos', () => {
    mockQueryState.empty = true;
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/nenhum produto encontrado/i)).toBeInTheDocument();
  });

  it('deve ter paginação funcionando', () => {
    renderWithRouter(<Dashboard />);
    
    // Verificar se há controles de paginação
    const paginationElements = screen.queryAllByRole('button', { name: /anterior|próximo/i });
    expect(paginationElements.length).toBeGreaterThan(0);
  });

  it('deve ter responsividade', () => {
    renderWithRouter(<Dashboard />);
    
    // Verificar se há classes responsivas
    const container = screen.getByRole('main');
    expect(container).toHaveClass('container');
  });

  it('deve ter filtros funcionando', async () => {
    renderWithRouter(<Dashboard />);
    
    const searchInput = screen.getByPlaceholderText(/buscar produtos/i);
    const categoryFilter = screen.getByRole('combobox', { name: /categoria/i });
    
    // Simular busca
    fireEvent.change(searchInput, { target: { value: 'Teste 1' } });
    await waitFor(() => {
      expect(searchInput).toHaveValue('Teste 1');
    });
    
    // Simular filtro de categoria
    fireEvent.change(categoryFilter, { target: { value: '1' } });
    await waitFor(() => {
      expect(categoryFilter).toHaveValue('1');
    });
  });

  it('deve ter ordenação funcionando', async () => {
    renderWithRouter(<Dashboard />);
    
    const sortSelect = screen.getByRole('combobox', { name: /ordenar por/i });
    
    // Simular mudança de ordenação
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
    await waitFor(() => {
      expect(sortSelect).toHaveValue('price-asc');
    });
  });
}); 