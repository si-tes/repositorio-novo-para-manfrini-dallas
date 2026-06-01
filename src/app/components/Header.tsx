import { Search, Gift, User, ShoppingCart, Menu } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { carrinhoService } from '../../services/carrinhoService';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTotalItems(carrinhoService.getTotalItens());

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors">
            <Menu size={24} className="text-black" />
          </button>
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase italic">
              Dallas<span className="text-red-600">.</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/lancamentos" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Lançamentos</Link>
          <Link to="/brasil" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Brasil</Link>
          <Link to="/europeus" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Europeus</Link>
          <Link to="/retro" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Retrô</Link>
        </nav>
        
        <div className="flex items-center gap-1 md:gap-4">
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
            <Search size={20} className="text-black" />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 rounded-full transition-colors"
            >
              <User size={20} className={`text-black transition-colors ${isDropdownOpen ? 'text-red-600' : ''}`} />
              <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block transition-colors ${isDropdownOpen ? 'text-red-600' : ''}`}>
                {isAuthenticated ? `Olá, ${user?.nome.split(' ')[0]}` : 'Minha Conta'}
              </span>
            </button>

            <div 
              className={`absolute right-0 top-full mt-2 w-48 bg-white border border-black/5 rounded-2xl shadow-xl transition-all flex flex-col overflow-hidden origin-top-right ${
                isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Link to="/minha-conta" onClick={closeDropdown} className="px-4 py-3 text-sm font-bold hover:bg-black/5 transition-colors">Minha Conta</Link>
                  <Link to="/minha-conta/pedidos" onClick={closeDropdown} className="px-4 py-3 text-sm font-bold hover:bg-black/5 transition-colors">Minhas Compras</Link>
                  <Link to="/minha-conta/senha" onClick={closeDropdown} className="px-4 py-3 text-sm font-bold hover:bg-black/5 transition-colors">Alterar Senha</Link>
                  <button 
                    onClick={() => { logout(); closeDropdown(); }} 
                    className="px-4 py-3 text-sm font-bold text-left text-red-600 hover:bg-red-50 transition-colors border-t border-black/5"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeDropdown} className="px-4 py-3 text-sm font-bold hover:bg-black/5 transition-colors">Entrar</Link>
                  <Link to="/cadastro" onClick={closeDropdown} className="px-4 py-3 text-sm font-bold hover:bg-black/5 transition-colors">Cadastrar</Link>
                </>
              )}
            </div>
          </div>
          <Link to="/carrinho" className="p-2 hover:bg-black/5 rounded-full transition-colors relative block">
            <ShoppingCart size={20} className="text-black" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

