import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PWAInstallPrompt } from '../PWAInstallPrompt';

expect.extend(toHaveNoViolations);

// Mock do toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock do service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getRegistrations: jest.fn().mockResolvedValue([]),
  },
  writable: true,
});

describe('PWAInstallPrompt', () => {
  it('não deve renderizar quando não há prompt de instalação', () => {
    render(<PWAInstallPrompt />);
    expect(screen.queryByText('Instalar App')).not.toBeInTheDocument();
  });

  it('não deve ter violações de acessibilidade quando não renderizado', async () => {
    const { container } = render(<PWAInstallPrompt />);
    const results = await axe(container);
    // @ts-expect-error jest-axe matcher
    expect(results).toHaveNoViolations();
  });
}); 