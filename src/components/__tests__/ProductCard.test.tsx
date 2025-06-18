import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../contexts/CartContext';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test description',
  category: {
    id: 1,
    name: 'Electronics',
    image: 'test-category.jpg'
  },
  images: ['test-image.jpg'],
  creationAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('displays product image with alt text', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('navigates to product detail when clicking the details button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    // O botão de detalhes é um link com o texto "Ver Detalhes"
    const detailsLink = screen.getByRole('link', { name: /ver detalhes/i });
    expect(detailsLink).toHaveAttribute('href', '/product/1');
  });

  it('adds product to cart when add to cart button is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const addToCartButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    fireEvent.click(addToCartButton);
    expect(screen.getByText('Adicionado')).toBeInTheDocument();
  });

  it('handles missing product image gracefully', () => {
    const productWithoutImage = {
      ...mockProduct,
      images: []
    };
    renderWithProviders(<ProductCard product={productWithoutImage} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/placeholder.svg');
  });
}); 