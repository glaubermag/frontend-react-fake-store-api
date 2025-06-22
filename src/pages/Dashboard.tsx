import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductForm from '@/components/ProductForm';
import { useToast } from '@/hooks/use-toast';

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

interface Category {
  id: number;
  name: string;
  image: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('default');
  const itemsPerPage = 12;
  
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Resetar página ao mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, searchTerm, selectedCategory]);

  // Fetch products
  const { data: products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await fetch('https://api.escuelajs.co/api/v1/products', {
        cache: 'no-cache', // Forçar sempre buscar da API
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      const data = await response.json();
      return data;
    },
    staleTime: 0, // Sempre considerar stale para forçar refetch
    gcTime: 0, // Não manter no cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      return response.json();
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'category'> & { categoryId: number }) => {
      const response = await fetch('https://api.escuelajs.co/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }
      return response.json();
    },
    onSuccess: () => {
      // Forçar invalidação e refresh do cache
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      
      // Limpar cache específico se necessário
      queryClient.removeQueries({ queryKey: ['products'], exact: false });
      
      // Forçar refetch imediato
      refetchProducts();
      
      setIsFormOpen(false);
      toast({
        title: "Sucesso!",
        description: "Produto criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: { id: number } & Omit<Product, 'id' | 'category'> & { categoryId: number }) => {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }
      return response.json();
    },
    onSuccess: () => {
      // Forçar invalidação e refresh do cache
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      
      // Limpar cache específico se necessário
      queryClient.removeQueries({ queryKey: ['products'], exact: false });
      
      // Forçar refetch imediato
      refetchProducts();
      
      setEditingProduct(null);
      setIsFormOpen(false);
      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }
      return response.json();
    },
    onSuccess: () => {
      // Forçar invalidação e refresh do cache
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      
      // Limpar cache específico se necessário
      queryClient.removeQueries({ queryKey: ['products'], exact: false });
      
      // Forçar refetch imediato
      refetchProducts();
      
      setDeletingProductId(null);
      toast({
        title: "Sucesso!",
        description: "Produto removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover produto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.id.toString() === selectedCategory;
    const price = product.price;
    const min = minPrice ? parseFloat(minPrice.replace(',', '.')) : null;
    const max = maxPrice ? parseFloat(maxPrice.replace(',', '.')) : null;
    const matchesMin = min === null || price >= min;
    const matchesMax = max === null || price <= max;
    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  }) || [];

  // ORDENAR PRODUTOS
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') return a.price - b.price;
    if (sortOrder === 'price-desc') return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
    });
  };

  const handleCreateProduct = (productData: Omit<Product, 'id' | 'category'> & { categoryId: number }) => {
    createProductMutation.mutate(productData);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'category'> & { categoryId: number }) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...productData });
    }
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold text-blue-600">Carregando...</div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar produtos</div>
          <div className="text-gray-600">Tente novamente mais tarde</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8 pt-8 min-h-[calc(100vh-80px)] max-w-full overflow-x-hidden" role="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nossos Produtos
            </h1>
            {isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button onClick={() => setIsFormOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
                <Button 
                  onClick={() => {
                    refetchProducts();
                    toast({
                      title: "Atualizando...",
                      description: "Buscando dados mais recentes da API.",
                    });
                  }}
                  variant="outline"
                  disabled={productsLoading}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${productsLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48" aria-label="Categoria">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro de preço */}
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço mín."
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="border rounded px-2 py-1 w-24 text-sm"
                aria-label="Preço mínimo"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço máx."
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="border rounded px-2 py-1 w-24 text-sm"
                aria-label="Preço máximo"
              />
            </div>

            {/* Select de ordenação */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-48" aria-label="Ordenar por">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Padrão</SelectItem>
                <SelectItem value="price-asc">Preço: Menor para Maior</SelectItem>
                <SelectItem value="price-desc">Preço: Maior para Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
            <div className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum produto encontrado
            </div>
            <div className="text-gray-500">
              {searchTerm || selectedCategory !== 'all'
                ? `Tente ajustar os filtros de busca` 
                : 'Não há produtos cadastrados no momento'
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <CardHeader className="p-4">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {product.category.name}
                    </Badge>
                    <h2 className="text-lg line-clamp-2 leading-tight font-semibold tracking-tight">
                      {product.title}
                    </h2>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
                    <div>
                      <CardDescription className="line-clamp-2 mb-3">
                        {product.description}
                      </CardDescription>
                    </div>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-green-600">
                        {`R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </div>
                      {product.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500 font-semibold">{product.rating.rate}</span>
                          <span className="text-gray-500">({product.rating.count})</span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Button asChild variant="outline" className="w-full sm:flex-1 min-w-0">
                          <Link to={`/products/${product.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full sm:flex-1 min-w-0 bg-blue-600 hover:bg-blue-700"
                          aria-label="Adicionar ao carrinho"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao carrinho
                        </Button>
                      </div>
                      {isAuthenticated && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditForm(product)}
                            className="flex-1"
                            aria-label="Editar"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingProductId(product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            aria-label="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Product Dialog */}
        <Dialog open={isFormOpen} onOpenChange={closeForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct ? {
                id: editingProduct.id,
                title: editingProduct.title,
                price: editingProduct.price,
                description: editingProduct.description,
                categoryId: editingProduct.category.id,
                images: editingProduct.images,
              } : undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={closeForm}
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingProductId && handleDeleteProduct(deletingProductId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Paginação real */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-8 gap-2 items-center">
            <Button
              variant="outline"
              aria-label="Anterior"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >Anterior</Button>
            {/* Botões numerados */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNum =>
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              )
              .map((pageNum, idx, arr) => (
                <span key={pageNum} className="flex">
                  {/* Ellipsis para páginas distantes */}
                  {idx > 0 && pageNum - arr[idx - 1] > 1 && (
                    <span className="px-1 text-gray-400">...</span>
                  )}
                  <Button
                    variant={pageNum === currentPage ? "default" : "outline"}
                    className={`w-10 h-10 p-0 rounded-full font-bold ${pageNum === currentPage ? 'bg-blue-600 text-white' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </Button>
                </span>
              ))}
            <Button
              variant="outline"
              aria-label="Próximo"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >Próximo</Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
