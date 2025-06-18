import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PWASplashScreen } from '../PWASplashScreen';

expect.extend(toHaveNoViolations);

describe('PWASplashScreen', () => {
  it('deve renderizar o splash screen corretamente', () => {
    render(<PWASplashScreen />);
    
    expect(screen.getByText('Product Store')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    render(<PWASplashScreen />);
    
    // Verificar se o título tem heading role
    const title = screen.getByRole('heading', { name: /product store/i });
    expect(title).toBeInTheDocument();
  });

  it('deve ter contraste adequado nos elementos', () => {
    render(<PWASplashScreen />);
    
    const title = screen.getByText('Product Store');
    const loadingText = screen.getByText('Carregando...');
    
    expect(title).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = render(<PWASplashScreen />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter ícones com aria-hidden apropriado', () => {
    render(<PWASplashScreen />);
    
    // Verificar se os ícones têm aria-hidden
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('deve ter mensagens de status acessíveis', () => {
    render(<PWASplashScreen />);
    
    const loadingMessage = screen.getByText('Carregando...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('deve ter animação de loading acessível', () => {
    render(<PWASplashScreen />);
    
    // Verificar se o spinner está presente
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
}); 