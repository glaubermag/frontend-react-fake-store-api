import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWASplashScreen } from './components/PWASplashScreen';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Dashboard from './pages/Dashboard';
import './App.css';

// Lazy loading de todas as páginas
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App component rendered - routes should be working');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="w-full min-h-screen bg-gray-50">
              <PWASplashScreen />
              <OfflineIndicator />
              <PWAInstallPrompt />
              <Navbar />
              
              <main className="w-full px-2 sm:px-4 py-4 sm:py-8 pt-20">
                <Suspense fallback={
                  <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner />
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/products" 
                      element={<Dashboard />}
                    />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route 
                      path="/cart" 
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/test" element={<div>Teste de rota funcionando!</div>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </Router>
          <Toaster position="top-right" richColors />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
