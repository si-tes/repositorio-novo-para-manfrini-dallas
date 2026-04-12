import { motion } from 'motion/react';
import { Link } from 'react-router';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  team?: string;
}

export default function ProductCard({ id, name, price, image, team }: ProductCardProps) {
  return (
    <Link to={`/product/${id}`}>
      <motion.div 
        className="bg-white rounded-xl overflow-hidden border-2 border-black/10 hover:border-black transition-all cursor-pointer"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          {team && (
            <p className="text-xs text-black/50 mb-1 font-semibold uppercase tracking-wide">{team}</p>
          )}
          <h3 className="text-black font-semibold mb-2 line-clamp-2">{name}</h3>
          <p className="text-black font-bold text-lg">
            R$ {price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
