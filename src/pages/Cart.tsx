import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();

  // Estado para CEP e endereço
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [cepError, setCepError] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const handleBuscarCep = async () => {
    setCepError('');
    setEndereco(null);
    const cleanCep = cep.replace(/\D/g, '');
    if (!/^\d{8}$/.test(cleanCep)) {
      setCepError('CEP inválido. Digite 8 números.');
      return;
    }
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (!res.ok) {
        setCepError('Erro ao buscar CEP.');
        setLoadingCep(false);
        return;
      }
      const data = await res.json();
      if (data.erro) {
        setCepError('CEP não encontrado.');
        setLoadingCep(false);
        return;
      }
      setEndereco(data);
    } catch (e) {
      setCepError('Erro ao buscar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Adicione alguns produtos incríveis ao seu carrinho
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/products">
              Explorar Produtos
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto px-2 sm:px-4 py-4 sm:py-8 min-h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8 mt-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'itens'} no seu carrinho
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Carrinho
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="font-semibold text-lg line-clamp-2">
                            {item.title}
                          </h2>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            aria-label="Remover item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Badge variant="secondary" className="px-3 py-1">
                              {item.quantity}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} cada
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} itens)</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
                {/* Campo de CEP e endereço integrado */}
                <div className="my-4 bg-slate-50 rounded-lg p-3 flex flex-col gap-2 border border-slate-200">
                  <label htmlFor="cep" className="font-semibold text-slate-700">Calcule seu frete (CEP):</label>
                  <div className="flex gap-2">
                    <input
                      id="cep"
                      type="text"
                      value={cep}
                      onChange={e => setCep(e.target.value.replace(/\D/g, ''))}
                      maxLength={8}
                      placeholder="Digite seu CEP"
                      className="border border-slate-300 rounded px-3 py-2 w-full max-w-[160px] text-sm bg-white focus:ring-2 focus:ring-blue-200"
                    />
                    <Button type="button" onClick={handleBuscarCep} disabled={loadingCep || cep.length !== 8}>
                      {loadingCep ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>
                  {cepError && <span className="text-red-600 text-sm">{cepError}</span>}
                  {endereco && (
                    <div className="text-sm text-slate-700 mt-2">
                      <div><b>Logradouro:</b> {endereco.logradouro}</div>
                      <div><b>Bairro:</b> {endereco.bairro}</div>
                      <div><b>Cidade:</b> {endereco.localidade} - {endereco.uf}</div>
                      {endereco.complemento && <div><b>Complemento:</b> {endereco.complemento}</div>}
                    </div>
                  )}
                </div>
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                >
                  Finalizar Compra
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/products">
                    Continuar Comprando
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
