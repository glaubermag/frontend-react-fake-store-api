import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProtectedRoute from '../ProtectedRoute';

expect.extend(toHaveNoViolations);

// Mock do contexto de autenticação
const mockAuthContext = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

const TestComponent = () => <div>Conteúdo Protegido</div>;

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o conteúdo quando o usuário está autenticado', () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isLoading = false;
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('deve redirecionar para login quando o usuário não está autenticado', () => {
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    // Verificar se foi redirecionado para login
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
  });

  it('deve mostrar loading quando isLoading é true', () => {
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = true;
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    // Verificar se o loading está sendo exibido
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta quando autenticado', () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isLoading = false;
    
    const { container } = renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade quando autenticado', async () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isLoading = false;
    
    const { container } = renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve preservar a rota original para redirecionamento', () => {
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      ['/dashboard']
    );
    
    // Verificar se não está mostrando o conteúdo protegido
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
  });

  it('deve funcionar com múltiplos componentes filhos', () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isLoading = false;
    
    renderWithRouter(
      <ProtectedRoute>
        <div>Componente 1</div>
        <div>Componente 2</div>
        <TestComponent />
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Componente 1')).toBeInTheDocument();
    expect(screen.getByText('Componente 2')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });

  it('deve lidar com mudanças de estado de autenticação', () => {
    // Primeiro renderiza sem usuário
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.isLoading = false;
    const { rerender } = renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
    
    // Depois renderiza com usuário
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isLoading = false;
    rerender(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });
}); 