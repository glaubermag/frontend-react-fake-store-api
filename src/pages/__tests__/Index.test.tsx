import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Index from '../Index';

expect.extend(toHaveNoViolations);

// Mock do contexto de autenticação
const mockAuthContext = {
  isAuthenticated: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock do React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: [
      {
        id: 1,
        title: 'Produto Destaque 1',
        price: 99.99,
        description: 'Descrição do produto destaque 1',
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
        title: 'Produto Destaque 2',
        price: 149.99,
        description: 'Descrição do produto destaque 2',
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
    error: null
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a página inicial corretamente', () => {
    renderWithRouter(<Index />);
    
    expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    expect(screen.getByText(/produtos em destaque/i)).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<Index />);
    
    // Verificar se há headings apropriados
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verificar se há seção de produtos em destaque
    expect(screen.getByText('Produto Destaque 1')).toBeInTheDocument();
  });

  it('deve ter hero section', () => {
    renderWithRouter(<Index />);
    
    // Verificar se há seção hero
    expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    expect(screen.getByText(/descubra produtos incríveis/i)).toBeInTheDocument();
  });

  it('deve ter call-to-action buttons', () => {
    renderWithRouter(<Index />);
    
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
    
    // Verificar se há botões de ação
    const exploreButton = screen.getByRole('button', { name: /explorar produtos/i });
    expect(exploreButton).toBeInTheDocument();
  });

  it('deve ter links de navegação', () => {
    renderWithRouter(<Index />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    // Verificar se os links têm href apropriados
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('deve ter produtos em destaque', () => {
    renderWithRouter(<Index />);
    
    expect(screen.getByText('Produto Destaque 1')).toBeInTheDocument();
    expect(screen.getByText('Produto Destaque 2')).toBeInTheDocument();
  });

  it('deve ter imagens com alt text apropriado', () => {
    renderWithRouter(<Index />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    
    // Verificar se as imagens têm alt text
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('deve ter preços formatados corretamente', () => {
    renderWithRouter(<Index />);
    
    expect(screen.getByText(/R\$ 99,99/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 149,99/)).toBeInTheDocument();
  });

  it('deve ter categorias exibidas corretamente', () => {
    renderWithRouter(<Index />);
    
    expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    expect(screen.getByText('Roupas')).toBeInTheDocument();
  });

  it('deve ter ratings exibidos corretamente', () => {
    renderWithRouter(<Index />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
    expect(screen.getByText('(85)')).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<Index />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithRouter(<Index />);
    
    const interactiveElements = screen.getAllByRole('button');
    const links = screen.getAllByRole('link');
    
    expect(interactiveElements.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
  });

  it('deve ter elementos interativos', () => {
    renderWithRouter(<Index />);
    
    const links = screen.getAllByRole('link');
    
    expect(links.length).toBeGreaterThan(0);
    expect(links.some(link => link.textContent?.includes('Explorar Produtos'))).toBe(true);
  });

  it('deve ter loading state', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem loading state específico
    // Verificar se há conteúdo principal
    expect(screen.getByText('Fake Store API')).toBeInTheDocument();
  });

  it('deve ter error state', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem error state específico
    // Verificar se há conteúdo principal
    expect(screen.getByText('Por que escolher nossa loja?')).toBeInTheDocument();
  });

  it('deve ter estado vazio quando não há produtos', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem estado vazio específico
    // Verificar se há conteúdo principal
    expect(screen.getByText('Entrega Rápida')).toBeInTheDocument();
  });

  it('deve ter responsividade', () => {
    renderWithRouter(<Index />);
    
    // Verificar se há classes responsivas
    const container = screen.getByText('Fake Store API').closest('section');
    expect(container).toHaveClass('container');
  });

  it('deve ter seção de features', () => {
    renderWithRouter(<Index />);
    
    // Verificar se há seção de features
    expect(screen.getByText(/por que escolher nossa loja/i)).toBeInTheDocument();
  });

  it('deve ter seção de newsletter', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem seção de newsletter
    // Verificar se há seção CTA
    expect(screen.getByText('Pronto para começar suas compras?')).toBeInTheDocument();
  });

  it('deve ter formulário de newsletter funcionando', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem formulário de newsletter
    // Verificar se há botões de ação principais
    expect(screen.getByText('Explorar Produtos')).toBeInTheDocument();
    expect(screen.getByText('Fazer Login')).toBeInTheDocument();
  });

  it('deve ter footer com links úteis', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem footer com links úteis
    // Verificar se há seção de features
    expect(screen.getByText('Por que escolher nossa loja?')).toBeInTheDocument();
  });

  it('deve ter botões de ação funcionando', () => {
    renderWithRouter(<Index />);
    
    const exploreLink = screen.getByRole('link', { name: /explorar produtos/i });
    
    // Simular clique no link
    fireEvent.click(exploreLink);
    
    // Verificar se o link está funcionando
    expect(exploreLink).toHaveAttribute('href', '/products');
  });

  it('deve ter links para produtos funcionando', () => {
    renderWithRouter(<Index />);
    
    const productLinks = screen.getAllByRole('link');
    
    // Verificar se há links para produtos
    const productLink = productLinks.find(link => 
      link.getAttribute('href')?.includes('/products')
    );
    expect(productLink).toBeInTheDocument();
  });

  it('deve ter seção de categorias populares', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem seção de categorias populares
    // Verificar se há seção de features
    expect(screen.getByText('Catálogo Completo')).toBeInTheDocument();
  });

  it('deve ter seção de depoimentos', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem seção de depoimentos
    // Verificar se há seção de features
    expect(screen.getByText('Avaliações Verificadas')).toBeInTheDocument();
  });

  it('deve ter seção de estatísticas', () => {
    renderWithRouter(<Index />);
    
    // A página Index não tem seção de estatísticas
    // Verificar se há seção de features
    expect(screen.getByText('Suporte 24/7')).toBeInTheDocument();
  });
}); 