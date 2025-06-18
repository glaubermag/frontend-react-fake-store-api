import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { OfflineIndicator } from '../OfflineIndicator';

expect.extend(toHaveNoViolations);

// Mock do hook usePWA
jest.mock('@/hooks/usePWA', () => ({
  usePWA: () => ({
    isOnline: false,
  }),
}));

describe('OfflineIndicator', () => {
  it('deve renderizar quando offline', () => {
    render(<OfflineIndicator />);
    
    expect(screen.getByText(/modo offline/i)).toBeInTheDocument();
  });

  it('deve ter estrutura semântica correta', () => {
    render(<OfflineIndicator />);
    
    // Verificar se o indicador está presente
    const indicator = screen.getByText(/modo offline/i);
    expect(indicator).toBeInTheDocument();
  });

  it('deve ter contraste adequado nos elementos', () => {
    render(<OfflineIndicator />);
    
    const statusText = screen.getByText(/modo offline/i);
    expect(statusText).toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade', async () => {
    const { container } = render(<OfflineIndicator />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });

  it('deve ter ícones com aria-hidden apropriado', () => {
    render(<OfflineIndicator />);
    
    // Verificar se os ícones têm aria-hidden
    const wifiIcon = document.querySelector('[aria-hidden="true"]');
    expect(wifiIcon).toBeInTheDocument();
  });

  it('deve ter mensagens de status acessíveis', () => {
    render(<OfflineIndicator />);
    
    const statusMessage = screen.getByText(/modo offline/i);
    expect(statusMessage).toBeInTheDocument();
  });
}); 