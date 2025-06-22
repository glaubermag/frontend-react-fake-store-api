import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
  creationAt: string;
  updatedAt: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
  const { addItem, items } = useCart();

  // Memoizar dados derivados
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(product.price);
  }, [product.price]);

  const productImage = useMemo(() => {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : '/placeholder.svg';
  }, [product.images]);

  const truncatedDescription = useMemo(() => {
    return product.description.length > 100 
      ? `${product.description.substring(0, 100)}...` 
      : product.description;
  }, [product.description]);

  const isInCart = useMemo(() => {
    return items.some(item => item.id === product.id);
  }, [items, product.id]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: productImage
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4">
        <Link 
          to={`/products/${product.id}`}
          className="block aspect-square overflow-hidden rounded-lg cursor-pointer group"
        >
          <img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </Link>
        <div className="mt-4 space-y-2">
          <Link 
            to={`/products/${product.id}`}
            className="block hover:text-blue-600 transition-colors duration-200"
          >
            <h3 className="font-semibold text-lg line-clamp-2 cursor-pointer">
              {product.title}
            </h3>
          </Link>
          <Badge variant="secondary" className="w-fit">
            {product.category.name}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 pt-0">
        <p className="text-gray-600 text-sm line-clamp-3">
          {truncatedDescription}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div className="flex items-center gap-1">
            {product.rating && (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating.rate}</span>
                <span className="text-sm text-gray-500">({product.rating.count})</span>
              </>
            )}
          </div>
          <span className="text-xl font-bold text-green-600">
            {formattedPrice}
          </span>
        </div>
        <div className="flex flex-row gap-1 w-full">
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            className="w-1/2 sm:w-auto text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap flex items-center justify-center"
            variant={isInCart ? "secondary" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">{isInCart ? 'Adicionado' : 'Adicionar'}</span>
          </Button>
          <Link 
            to={`/products/${product.id}`}
            className="w-1/2 sm:w-auto"
            tabIndex={-1}
          >
            <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap truncate flex items-center justify-center">
              <span className="truncate block sm:hidden">Ver</span>
              <span className="hidden sm:block">Ver Detalhes</span>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
});

export default ProductCard;