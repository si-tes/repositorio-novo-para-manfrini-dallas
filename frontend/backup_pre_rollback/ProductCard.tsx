import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  team?: string;
}

export default function ProductCard({ id, name, price, image, team }: ProductCardProps) {
  return (
    <motion.div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5"
      whileHover={{ y: -8 }}
    >
      <Link to={`/product/${id}`}>
        <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          
          <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-colors">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-5">
        {team && (
          <p className="text-[10px] text-red-600 mb-1 font-black uppercase tracking-[0.2em] italic">{team}</p>
        )}
        <Link to={`/product/${id}`}>
          <h3 className="text-black font-bold mb-2 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">{name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-black font-black text-xl italic">
            R$ {price.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[10px] text-black/40 font-bold uppercase">12x s/ juros</span>
        </div>
      </div>
    </motion.div>
  );
}

