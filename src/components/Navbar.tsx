import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, Store, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Product Store
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className={location.pathname === '/products' ? 'bg-blue-50 text-blue-600' : ''}>
              <Link to="/products">Produtos</Link>
            </Button>

            <Button asChild variant="ghost" className="relative">
              <Link to="/cart" aria-label={`Carrinho ${itemCount > 0 ? `(${itemCount} itens)` : ''}`}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Registrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <nav className="flex flex-col gap-2 p-6">
                  <Button asChild variant="ghost" className="justify-start w-full" onClick={() => setOpen(false)}>
                    <Link to="/products">Produtos</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start w-full" onClick={() => setOpen(false)}>
                    <Link to="/cart">
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Carrinho
                        {itemCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                            {itemCount}
                          </Badge>
                        )}
                      </span>
                    </Link>
                  </Button>
                  {isAuthenticated ? (
                    <Button variant="ghost" className="justify-start w-full" onClick={() => { logout(); setOpen(false); }}>
                      <span className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sair
                      </span>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="justify-start w-full mb-2" onClick={() => setOpen(false)}>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button asChild className="justify-start w-full" onClick={() => setOpen(false)}>
                        <Link to="/register">Registrar</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
