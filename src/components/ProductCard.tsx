import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

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
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
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
      
      <CardFooter className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-xl font-bold text-green-600">
            {formattedPrice}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            className="flex-1 ml-2"
            variant={isInCart ? "secondary" : "default"}
          >
            {isInCart ? 'Adicionado' : 'Adicionar ao Carrinho'}
          </Button>
        </div>
        
        <Link 
          to={`/product/${product.id}`}
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 