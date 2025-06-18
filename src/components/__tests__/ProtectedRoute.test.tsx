import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    // Mock localStorage para simular usuário autenticado
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(mockUser));

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock localStorage para simular usuário não autenticado
    Storage.prototype.getItem = jest.fn(() => null);

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Verificar se o conteúdo protegido não é renderizado
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
}); 