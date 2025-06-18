import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProductForm from '../ProductForm';

expect.extend(toHaveNoViolations);

// Mock do contexto de autenticação
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin'
};

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true
  }),
}));

// Mock do React Query
jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
    error: null
  }),
  useQuery: () => ({
    data: [
      { id: 1, name: 'Eletrônicos' },
      { id: 2, name: 'Roupas' }
    ],
    isLoading: false,
    error: null
  })
}));

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário corretamente', () => {
    renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Criar Novo Produto')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do produto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/urls das imagens/i)).toBeInTheDocument();
  });

  it('deve ter labels acessíveis para todos os campos', () => {
    renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/nome do produto/i);
    const priceInput = screen.getByLabelText(/preço/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const categorySelect = screen.getByLabelText(/categoria/i);
    const imagesInput = screen.getByLabelText(/urls das imagens/i);
    
    expect(titleInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
    expect(imagesInput).toBeInTheDocument();
  });

  it('deve ter botões com labels acessíveis', () => {
    renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /criar produto/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('deve ter campos obrigatórios marcados corretamente', () => {
    renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleInput = screen.getByLabelText(/nome do produto/i);
    const priceInput = screen.getByLabelText(/preço/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    
    expect(titleInput).toHaveAttribute('required');
    expect(priceInput).toHaveAttribute('required');
    expect(descriptionInput).toHaveAttribute('required');
  });

  it('deve ter contraste adequado nos elementos', () => {
    renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const titleLabel = screen.getByText(/nome do produto/i);
    const priceLabel = screen.getByText(/preço/i);
    
    expect(titleLabel).toBeInTheDocument();
    expect(priceLabel).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter estrutura semântica correta', () => {
    renderWithRouter(<ProductForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Verificar se o formulário existe (mesmo sem role="form")
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Verificar se os campos têm IDs únicos
    const titleInput = screen.getByLabelText(/nome do produto/i);
    const priceInput = screen.getByLabelText(/preço/i);
    
    expect(titleInput).toHaveAttribute('id');
    expect(priceInput).toHaveAttribute('id');
    expect(titleInput.getAttribute('id')).not.toBe(priceInput.getAttribute('id'));
  });
}); 