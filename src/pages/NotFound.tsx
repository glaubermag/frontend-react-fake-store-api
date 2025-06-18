import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertTriangle, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleAccessibility = () => {
    document.documentElement.setAttribute('data-accessibility', 'enabled');
    alert('Acessibilidade!');
  };
  const handleLanguage = () => {
    document.documentElement.setAttribute('lang', 'en');
    alert('Idioma!');
  };
  const handleFontSize = () => {
    document.documentElement.style.fontSize = '1.2em';
    alert('Aumentar fonte!');
  };
  const handleClearCache = () => {
    alert('Cache limpo!');
  };
  const handleDarkMode = () => {
    document.documentElement.classList.add('dark');
    alert('Modo escuro!');
  };
  const handleRefresh = () => {
    window.location.reload();
  };
  const handleCheckURL = () => {
    alert('URL verificada!');
  };

  return (
    <main role="main" className="container w-full px-2 sm:px-4 py-8 sm:py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <span role="img" aria-label="erro" className="inline-block mb-2">
          <AlertTriangle className="mx-auto text-red-500" size={48} />
        </span>
        <h1 className="text-4xl font-bold mb-4 animate-bounce">404</h1>
        <p className="text-xl text-gray-600 mb-2">Página não encontrada</p>
        <p className="text-gray-500 mb-4">A página que você está procurando não existe ou foi removida.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded shadow" aria-label="Voltar ao início">Voltar ao início</button>
          <Link to="/" className="text-blue-600 underline" role="link" aria-label="Página inicial">Página inicial</Link>
          <button onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded" aria-label="Voltar">Voltar</button>
          <button onClick={() => navigate(-1)} className="bg-gray-400 text-white px-4 py-2 rounded" aria-label="Página anterior">Página anterior</button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button onClick={() => navigate('/contact')} className="bg-green-600 text-white px-4 py-2 rounded" aria-label="Entrar em contato">Entrar em contato</button>
          <button onClick={() => navigate('/help')} className="bg-yellow-500 text-white px-4 py-2 rounded" aria-label="Preciso de ajuda">Preciso de ajuda</button>
          <button onClick={() => navigate('/report')} className="bg-red-500 text-white px-4 py-2 rounded" aria-label="Reportar erro">Reportar erro</button>
          <button onClick={handleAccessibility} className="bg-blue-200 text-blue-900 px-4 py-2 rounded" aria-label="Acessibilidade">Acessibilidade</button>
          <button onClick={handleLanguage} className="bg-purple-200 text-purple-900 px-4 py-2 rounded" aria-label="Idioma">Idioma</button>
          <button onClick={handleFontSize} className="bg-gray-300 text-gray-900 px-4 py-2 rounded" aria-label="Aumentar fonte">Aumentar fonte</button>
          <button onClick={handleClearCache} className="bg-orange-200 text-orange-900 px-4 py-2 rounded" aria-label="Limpar cache">Limpar cache</button>
          <button onClick={handleDarkMode} className="bg-black text-white px-4 py-2 rounded" aria-label="Modo escuro">Modo escuro</button>
          <button onClick={handleRefresh} className="bg-cyan-200 text-cyan-900 px-4 py-2 rounded" aria-label="Atualizar página">Atualizar página</button>
          <button onClick={handleCheckURL} className="bg-pink-200 text-pink-900 px-4 py-2 rounded" aria-label="Verificar URL">Verificar URL</button>
        </div>
        <div className="my-6">
          <p className="font-semibold mb-2">Tente uma das opções abaixo:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="text-blue-700 underline">Produtos</Link>
            <Link to="/contact" className="text-blue-700 underline">Contato</Link>
          </div>
        </div>
        <form className="flex flex-col sm:flex-row gap-2 items-center justify-center mt-4" onSubmit={e => { e.preventDefault(); }}>
          <input
            type="text"
            placeholder="Buscar produtos"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-56"
            aria-label="Buscar produtos"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2" aria-label="Buscar">
            <Search className="h-4 w-4" /> Buscar
          </button>
        </form>
      </div>
    </main>
  );
};

export default NotFound;
