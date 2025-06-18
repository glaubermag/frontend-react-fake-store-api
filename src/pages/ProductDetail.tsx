import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
  rating?: {
    rate: number;
    count: number;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      return response.json();
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Produto não encontrado</h2>
          <Link to="/products">
            <Button>
              Voltar aos Produtos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/products">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Produtos
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <div className="text-4xl font-bold text-green-600 mb-6">
                {`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400" fill="#facc15" />
                  <span className="text-lg font-semibold">{product.rating.rate}</span>
                  <span className="text-slate-500">({product.rating.count})</span>
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold leading-none tracking-tight">Descrição do Produto</h2>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/products')}
              >
                Continuar Comprando
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
