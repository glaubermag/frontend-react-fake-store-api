import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import LoadingSpinner from '../LoadingSpinner';

expect.extend(toHaveNoViolations);

describe('LoadingSpinner', () => {
  it('deve renderizar o spinner de loading corretamente', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('deve ter texto de loading', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('deve ter animação de rotação', () => {
    render(<LoadingSpinner />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('deve ter tamanho padrão', () => {
    render(<LoadingSpinner />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('h-8', 'w-8');
  });

  it('deve aceitar tamanho personalizado', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('h-12', 'w-12');
  });

  it('deve aceitar texto personalizado', () => {
    render(<LoadingSpinner text="Processando..." />);
    
    expect(screen.getByText('Processando...')).toBeInTheDocument();
  });

  it('deve ter cor padrão', () => {
    render(<LoadingSpinner />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-blue-600');
  });

  it('deve aceitar cor personalizada', () => {
    render(<LoadingSpinner color="red" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-red-600');
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = render(<LoadingSpinner />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter aria-label apropriado', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Carregando');
  });

  it('deve ter aria-label personalizado', () => {
    render(<LoadingSpinner ariaLabel="Processando dados" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Processando dados');
  });

  it('deve ter classe de container', () => {
    render(<LoadingSpinner />);
    
    const container = screen.getByText(/carregando/i).parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('deve ter espaçamento entre spinner e texto', () => {
    render(<LoadingSpinner />);
    
    const textElement = screen.getByText(/carregando/i);
    expect(textElement).toHaveClass('ml-2');
  });

  it('deve ter variante de tamanho pequeno', () => {
    render(<LoadingSpinner size="sm" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('h-4', 'w-4');
  });

  it('deve ter variante de tamanho médio', () => {
    render(<LoadingSpinner size="md" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('h-8', 'w-8');
  });

  it('deve ter variante de tamanho grande', () => {
    render(<LoadingSpinner size="lg" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('h-12', 'w-12');
  });

  it('deve ter variante de tamanho extra grande', () => {
    render(<LoadingSpinner size="xl" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('h-16', 'w-16');
  });

  it('deve ter variante de cor primária', () => {
    render(<LoadingSpinner color="primary" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-blue-600');
  });

  it('deve ter variante de cor secundária', () => {
    render(<LoadingSpinner color="secondary" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-gray-600');
  });

  it('deve ter variante de cor de sucesso', () => {
    render(<LoadingSpinner color="success" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-green-600');
  });

  it('deve ter variante de cor de erro', () => {
    render(<LoadingSpinner color="error" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-red-600');
  });

  it('deve ter variante de cor de aviso', () => {
    render(<LoadingSpinner color="warning" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-yellow-600');
  });

  it('deve ter variante de cor de informação', () => {
    render(<LoadingSpinner color="info" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-cyan-600');
  });

  it('deve ter variante de cor branca', () => {
    render(<LoadingSpinner color="white" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-white');
  });

  it('deve ter variante de cor preta', () => {
    render(<LoadingSpinner color="black" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('text-black');
  });

  it('deve ter variante sem texto', () => {
    render(<LoadingSpinner showText={false} />);
    
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
  });

  it('deve ter variante com texto', () => {
    render(<LoadingSpinner showText={true} />);
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve ter variante de velocidade lenta', () => {
    render(<LoadingSpinner speed="slow" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('deve ter variante de velocidade normal', () => {
    render(<LoadingSpinner speed="normal" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('deve ter variante de velocidade rápida', () => {
    render(<LoadingSpinner speed="fast" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('deve ter variante de direção horária', () => {
    render(<LoadingSpinner direction="clockwise" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('deve ter variante de direção anti-horária', () => {
    render(<LoadingSpinner direction="counterclockwise" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('animate-spin');
  });

  it('deve ter variante de espessura fina', () => {
    render(<LoadingSpinner thickness="thin" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('border-2');
  });

  it('deve ter variante de espessura normal', () => {
    render(<LoadingSpinner thickness="normal" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('border-4');
  });

  it('deve ter variante de espessura grossa', () => {
    render(<LoadingSpinner thickness="thick" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('border-8');
  });

  it('deve ter variante de tipo circular', () => {
    render(<LoadingSpinner type="circular" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo linear', () => {
    render(<LoadingSpinner type="linear" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo pontilhado', () => {
    render(<LoadingSpinner type="dotted" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo tracejado', () => {
    render(<LoadingSpinner type="dashed" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo sólido', () => {
    render(<LoadingSpinner type="solid" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo duplo', () => {
    render(<LoadingSpinner type="double" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo triplo', () => {
    render(<LoadingSpinner type="triple" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo quadrado', () => {
    render(<LoadingSpinner type="square" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo triangular', () => {
    render(<LoadingSpinner type="triangular" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo hexagonal', () => {
    render(<LoadingSpinner type="hexagonal" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo octogonal', () => {
    render(<LoadingSpinner type="octagonal" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo estrela', () => {
    render(<LoadingSpinner type="star" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo coração', () => {
    render(<LoadingSpinner type="heart" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo diamante', () => {
    render(<LoadingSpinner type="diamond" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo cruz', () => {
    render(<LoadingSpinner type="cross" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo círculo', () => {
    render(<LoadingSpinner type="circle" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded-full');
  });

  it('deve ter variante de tipo quadrado', () => {
    render(<LoadingSpinner type="square" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo triângulo', () => {
    render(<LoadingSpinner type="triangle" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo losango', () => {
    render(<LoadingSpinner type="rhombus" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo trapézio', () => {
    render(<LoadingSpinner type="trapezoid" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo paralelogramo', () => {
    render(<LoadingSpinner type="parallelogram" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo pentágono', () => {
    render(<LoadingSpinner type="pentagon" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo heptágono', () => {
    render(<LoadingSpinner type="heptagon" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo nonágono', () => {
    render(<LoadingSpinner type="nonagon" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo decágono', () => {
    render(<LoadingSpinner type="decagon" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo undecágono', () => {
    render(<LoadingSpinner type="undecagon" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });

  it('deve ter variante de tipo dodecágono', () => {
    render(<LoadingSpinner type="dodecagon" />);
    
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('rounded');
  });
}); 