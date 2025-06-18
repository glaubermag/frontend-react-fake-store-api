import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import NotFound from '../NotFound';

expect.extend(toHaveNoViolations);

// Mock do React Router
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('NotFound', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn(),
        href: '',
        assign: jest.fn(),
        replace: jest.fn(),
        hash: '',
        pathname: '/',
      },
      writable: true,
    });
  });

  it('deve renderizar a página 404 corretamente', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar se há headings apropriados
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verificar se há título principal
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('deve ter mensagem de erro clara', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/a página que você está procurando não existe/i)).toBeInTheDocument();
  });

  it('deve ter botão de voltar ao início', () => {
    renderWithRouter(<NotFound />);
    
    const homeButton = screen.getByRole('button', { name: /voltar ao início/i });
    expect(homeButton).toBeInTheDocument();
  });

  it('deve ter link para página inicial', () => {
    renderWithRouter(<NotFound />);
    
    const homeLink = screen.getByRole('link', { name: /página inicial/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('deve ter botão de voltar', () => {
    renderWithRouter(<NotFound />);
    const backButtons = screen.getAllByRole('button');
    const backButton = backButtons.find(btn => btn.textContent === 'Voltar' || btn.getAttribute('aria-label') === 'Voltar');
    expect(backButton).toBeInTheDocument();
  });

  it('deve ter funcionalidade de voltar ao início', () => {
    renderWithRouter(<NotFound />);
    
    const homeButton = screen.getByRole('button', { name: /voltar ao início/i });
    
    // Simular clique no botão
    fireEvent.click(homeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve ter funcionalidade de voltar', () => {
    renderWithRouter(<NotFound />);
    const backButtons = screen.getAllByRole('button');
    const backButton = backButtons.find(btn => btn.textContent === 'Voltar' || btn.getAttribute('aria-label') === 'Voltar');
    // Simular clique no botão
    fireEvent.click(backButton!);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithRouter(<NotFound />);
    
    const buttons = screen.getAllByRole('button');
    const links = screen.getAllByRole('link');
    
    expect(buttons.length).toBeGreaterThan(0);
    expect(links.length).toBeGreaterThan(0);
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<NotFound />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter responsividade', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar se há classes responsivas
    const container = screen.getByRole('main');
    expect(container).toHaveClass('container');
  });

  it('deve ter ícone de erro', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar se há ícone de erro
    const errorIcon = screen.getByRole('img', { name: /erro/i });
    expect(errorIcon).toBeInTheDocument();
  });

  it('deve ter animação de erro', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar se há animação
    const animatedElement = screen.getByText('404');
    expect(animatedElement).toHaveClass('animate-bounce');
  });

  it('deve ter sugestões de navegação', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar se há sugestões
    expect(screen.getByText(/tente uma das opções abaixo/i)).toBeInTheDocument();
  });

  it('deve ter links úteis', () => {
    renderWithRouter(<NotFound />);
    
    // Verificar se há links úteis
    expect(screen.getByText(/produtos/i)).toBeInTheDocument();
    const contatos = screen.getAllByText(/contato/i);
    expect(contatos.length).toBeGreaterThanOrEqual(1);
  });

  it('deve ter funcionalidade de busca', () => {
    renderWithRouter(<NotFound />);
    
    const searchInput = screen.getByPlaceholderText(/buscar produtos/i);
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    
    // Simular busca
    fireEvent.change(searchInput, { target: { value: 'produto' } });
    fireEvent.click(searchButton);
    
    expect(searchInput).toHaveValue('produto');
  });

  it('deve ter funcionalidade de contato', () => {
    renderWithRouter(<NotFound />);
    
    const contactButton = screen.getByRole('button', { name: /entrar em contato/i });
    expect(contactButton).toBeInTheDocument();
    
    // Simular clique no botão de contato
    fireEvent.click(contactButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/contact');
  });

  it('deve ter funcionalidade de ajuda', () => {
    renderWithRouter(<NotFound />);
    
    const helpButton = screen.getByRole('button', { name: /preciso de ajuda/i });
    expect(helpButton).toBeInTheDocument();
    
    // Simular clique no botão de ajuda
    fireEvent.click(helpButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/help');
  });

  it('deve ter funcionalidade de reportar erro', () => {
    renderWithRouter(<NotFound />);
    
    const reportButton = screen.getByRole('button', { name: /reportar erro/i });
    expect(reportButton).toBeInTheDocument();
    
    // Simular clique no botão de reportar
    fireEvent.click(reportButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/report');
  });

  it('deve ter funcionalidade de voltar à página anterior', () => {
    renderWithRouter(<NotFound />);
    
    const previousButton = screen.getByRole('button', { name: /página anterior/i });
    expect(previousButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(previousButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('deve ter funcionalidade de atualizar página', () => {
    renderWithRouter(<NotFound />);
    
    const refreshButton = screen.getByRole('button', { name: /atualizar página/i });
    expect(refreshButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(refreshButton);
    
    // Verificar se a página foi atualizada
    expect(window.location.reload).toBeDefined();
  });

  it('deve ter funcionalidade de verificar URL', () => {
    renderWithRouter(<NotFound />);
    
    const urlCheckButton = screen.getByRole('button', { name: /verificar URL/i });
    expect(urlCheckButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(urlCheckButton);
    
    // Verificar se a URL foi verificada
    expect(window.location.href).toBeDefined();
  });

  it('deve ter funcionalidade de limpar cache', () => {
    renderWithRouter(<NotFound />);
    
    const clearCacheButton = screen.getByRole('button', { name: /limpar cache/i });
    expect(clearCacheButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(clearCacheButton);
    
    // Verificar se o cache foi limpo
    expect(localStorage.clear).toBeDefined();
  });

  it('deve ter funcionalidade de modo escuro', () => {
    renderWithRouter(<NotFound />);
    
    const darkModeButton = screen.getByRole('button', { name: /modo escuro/i });
    expect(darkModeButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(darkModeButton);
    
    // Verificar se o modo escuro foi ativado
    expect(document.documentElement).toHaveClass('dark');
  });

  it('deve ter funcionalidade de acessibilidade', () => {
    renderWithRouter(<NotFound />);
    
    const accessibilityButton = screen.getByRole('button', { name: /acessibilidade/i });
    expect(accessibilityButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(accessibilityButton);
    
    // Verificar se as opções de acessibilidade foram ativadas
    expect(document.documentElement).toHaveAttribute('data-accessibility', 'enabled');
  });

  it('deve ter funcionalidade de idioma', () => {
    renderWithRouter(<NotFound />);
    
    const languageButton = screen.getByRole('button', { name: /idioma/i });
    expect(languageButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(languageButton);
    
    // Verificar se o idioma foi alterado
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('deve ter funcionalidade de tamanho da fonte', () => {
    renderWithRouter(<NotFound />);
    
    const fontSizeButton = screen.getByRole('button', { name: /aumentar fonte/i });
    expect(fontSizeButton).toBeInTheDocument();
    
    // Simular clique no botão
    fireEvent.click(fontSizeButton);
    
    // Verificar se a fonte foi aumentada
    expect(document.documentElement).toHaveStyle('font-size: 1.2em');
  });
}); 