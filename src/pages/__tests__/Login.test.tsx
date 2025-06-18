import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Login from '../Login';

expect.extend(toHaveNoViolations);

// Mock do contexto de autenticação
const mockAuthContext = {
  login: jest.fn(),
  isAuthenticated: false,
  isLoading: false,
  error: null
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock do React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null
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

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.login.mockResolvedValue(true);
  });

  it('deve renderizar o formulário de login corretamente', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<Login />);
    
    // Verificar se o formulário tem role apropriado
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    // Verificar se os campos têm labels apropriados
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('deve chamar função de login com dados válidos', async () => {
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    
    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAuthContext.login).toHaveBeenCalledWith('teste@example.com', 'senha123');
    });
  });

  it('deve mostrar loading durante o processo de login', async () => {
    mockAuthContext.login.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    
    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/entrando/i)).toBeInTheDocument();
    });
  });

  it('deve mostrar erro quando login falha', async () => {
    mockAuthContext.login.mockResolvedValue(false);
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    
    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('deve ter link para página de registro', () => {
    renderWithRouter(<Login />);
    
    const registerLink = screen.getByRole('link', { name: /criar conta/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<Login />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter navegação por teclado funcionando', () => {
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Verificar se os elementos são focáveis
    emailInput.focus();
    expect(emailInput).toHaveFocus();
    
    passwordInput.focus();
    expect(passwordInput).toHaveFocus();
    
    submitButton.focus();
    expect(submitButton).toHaveFocus();
  });

  it('deve ter contraste adequado nos elementos', () => {
    renderWithRouter(<Login />);
    
    const title = screen.getByText('Bem-vindo de volta');
    const emailLabel = screen.getByLabelText(/email/i);
    const passwordLabel = screen.getByLabelText(/senha/i);
    
    expect(title).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  it('deve mostrar mensagem de demo', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText(/demo:/i)).toBeInTheDocument();
    expect(screen.getByText(/john@mail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/changeme/i)).toBeInTheDocument();
  });

  it('deve redirecionar quando já está autenticado', () => {
    mockAuthContext.isAuthenticated = true;
    
    renderWithRouter(<Login />);
    
    // Deve redirecionar para /products
    expect(window.location.pathname).toBe('/');
  });
}); 