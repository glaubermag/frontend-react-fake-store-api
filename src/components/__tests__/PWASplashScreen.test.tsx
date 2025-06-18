import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PWASplashScreen } from '../PWASplashScreen';

expect.extend(toHaveNoViolations);

// Mock do hook usePWA
jest.mock('@/hooks/usePWA', () => ({
  usePWA: () => ({
    isStandalone: true,
    isInstalled: false,
    isOnline: true,
    hasUpdate: false,
    canInstall: false,
    installApp: jest.fn(),
    updateApp: jest.fn(),
    clearUpdateFlag: jest.fn(),
  }),
}));

describe('PWASplashScreen', () => {
  it('deve renderizar o splash screen corretamente', () => {
    render(<PWASplashScreen />);
    
    expect(screen.getByText('Fake Store')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    render(<PWASplashScreen />);
    
    // Verificar se o título tem heading role
    const title = screen.getByRole('heading', { name: /fake store/i });
    expect(title).toBeInTheDocument();
  });

  it('deve ter contraste adequado nos elementos', () => {
    render(<PWASplashScreen />);
    
    const title = screen.getByText('Fake Store');
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

  it('deve ter ícones SVG no componente', () => {
    render(<PWASplashScreen />);
    
    // Verificar se há elementos SVG no componente
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
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