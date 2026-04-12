import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  const product = {
    id: id || '1',
    name: 'Brasil Retrô 1970',
    price: 349.90,
    team: 'Seleção Brasileira',
    image: 'https://images.unsplash.com/photo-1551479460-5e76c686816a?w=800',
    description: 'Camisa histórica da Seleção Brasileira de 1970. Réplica oficial com detalhes autênticos. Tricampeão Mundial.',
    sizes: ['P', 'M', 'G', 'GG', 'XG']
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-md">
          <Link to="/">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-white" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-white">Detalhes do Produto</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-32">
        {/* Product Image */}
        <motion.div 
          className="w-full aspect-square bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <div className="px-4 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-gray-400 text-sm mb-1">{product.team}</p>
            <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-[#76FF03] text-3xl font-bold">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white font-bold mb-2">Descrição</h2>
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </motion.div>

          {/* Size Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-white font-bold mb-3">Selecione o tamanho</h2>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-lg border transition-all ${
                    selectedSize === size
                      ? 'bg-[#76FF03] text-black border-[#76FF03] font-bold'
                      : 'bg-gray-900 text-white border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quantity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-white font-bold mb-3">Quantidade</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-900 text-white rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
              >
                -
              </button>
              <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-900 text-white rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4">
        <motion.button
          onClick={handleBuyNow}
          className="w-full bg-[#76FF03] text-black py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#FFEB3B] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={24} />
          Comprar agora
        </motion.button>
      </div>
    </div>
  );
}
