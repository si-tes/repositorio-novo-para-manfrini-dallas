import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function HeroSection() {
  return (
    <motion.section 
      className="relative h-[60vh] md:h-[80vh] overflow-hidden rounded-3xl mx-4 md:mx-8 mt-20 md:mt-24 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-700" />
      
      <motion.div 
        className="w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1551479460-5e76c686816a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGZvb3RiYWxsJTIwamVyc2V5JTIwY29sbGVjdGlvbiUyMHNob3B8ZW58MXx8fHwxNzc0NDYyODgwfDA&ixlib=rb-4.1.0&q=80&w=1920&utm_source=figma&utm_medium=referral"
          alt="Relíquias do Futebol"
          className="w-full h-full object-cover shadow-2xl"
        />
      </motion.div>
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] px-3 py-1 mb-4 italic"
          >
            Coleção Retrô 2026
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-8xl font-black text-white mb-4 leading-[0.9] tracking-tighter italic uppercase"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Relíquias do <br />
            <span className="text-red-600">Futebol</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 mb-8 max-w-lg font-medium leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Vista a história. Camisas lendárias que transcendem o tempo, com qualidade impecável e frete grátis.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button 
              className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all transform flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar Coleção
            </motion.button>
            <motion.button 
              className="bg-transparent text-white border-2 border-white/30 backdrop-blur-md px-10 py-4 rounded-full font-black uppercase tracking-wider hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Lançamentos
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

