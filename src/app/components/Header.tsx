import { Search, Menu, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        {/* Lado Esquerdo - Menu */}
        <div className="flex items-center w-1/3">
          <button className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <Menu size={24} className="text-black" />
          </button>
        </div>

        {/* Centro - Logo */}
        <div className="flex items-center justify-center w-1/3">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase italic">
              Dalla<span className="text-red-600">.</span>
            </h1>
          </Link>
        </div>
        
        {/* Lado Direito - Ações */}
        <div className="flex items-center justify-end gap-2 md:gap-4 w-1/3">
          <button className="p-2 hover:bg-black/10 rounded-full transition-colors hidden md:block">
            <Search size={20} className="text-black" />
          </button>
          <button className="p-2 hover:bg-black/10 rounded-full transition-colors relative">
            <ShoppingCart size={20} className="text-black" />
            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              0
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
