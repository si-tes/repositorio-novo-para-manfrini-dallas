import { useState } from 'react';

import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import BrazilSection from '../components/BrazilSection';
import NationalTeams from '../components/NationalTeams';
import GiftsSection from '../components/GiftsSection';
import CatalogSection from '../components/CatalogSection';
import { Truck, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import useProdutos from '../../hooks/useProdutos';

interface ProductCardData {
  id: string;
  name: string;
  price: number;
  image: string;
  team?: string;
}

export default function Home() {
  const loading = false;
  const erro = null;

  const produtosFormatados: ProductCardData[] = [
    { id: 'mock-1', name: 'Brasil Retrô 1970', price: 189.90, image: 'https://images.unsplash.com/photo-1551479460-5e76c686816a?w=800', team: 'Seleções' },
    { id: 'mock-2', name: 'Arsenal Home 2024', price: 189.90, image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', team: 'Premier League' },
    { id: 'mock-3', name: 'Real Madrid Away', price: 189.90, image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', team: 'La Liga' },
    { id: 'mock-4', name: 'Milan Third 2024', price: 189.90, image: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce7163?w=800', team: 'Serie A' },
    { id: 'mock-5', name: 'Boca Juniors 2000', price: 189.90, image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800', team: 'Outros' }
  ];

  const benefits = [
    { icon: <Truck size={32} />, title: 'Frete Grátis', desc: 'Em compras acima de R$ 299' },
    { icon: <ShieldCheck size={32} />, title: 'Segurança', desc: 'Pagamento 100% protegido' },
    { icon: <CreditCard size={32} />, title: 'Até 12x', desc: 'Parcele suas compras' },
    { icon: <RotateCcw size={32} />, title: 'Troca Fácil', desc: '30 dias para devolver' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-10">

      
      <main>
        <HeroSection />
        
        <section className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-black/5 shadow-sm"
              >
                <div className="text-red-600 mb-3">{b.icon}</div>
                <h4 className="font-black uppercase italic tracking-tighter text-sm">{b.title}</h4>
                <p className="text-xs text-black/40 font-bold uppercase">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {erro && (
          <section className="container mx-auto px-4 md:px-8 py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-800 font-bold">Erro ao carregar produtos: {erro}</p>
            </div>
          </section>
        )}

        {loading ? (
          <section className="container mx-auto px-4 md:px-8 py-12">
            <div className="text-center py-12">
              <p className="text-black/60 font-bold">Carregando produtos...</p>
            </div>
          </section>
        ) : (
          <div className="md:px-4">
            <ProductCarousel 
              title="Os Mais Procurados" 
              products={produtosFormatados.length > 0 ? produtosFormatados : []} 
            />
          </div>
        )}
        
        <BrazilSection />
        
        <NationalTeams />
        
        <GiftsSection />
        
        <CatalogSection />
      </main>

      <footer className="mt-20 bg-black text-white py-16 px-8 rounded-t-[3rem]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-4xl font-black italic uppercase mb-6 tracking-tighter">
                Dallas<span className="text-red-600">.</span> Imports
              </h2>
              <p className="text-white/60 max-w-sm mb-8">
                Especialistas em mantos sagrados. Trazemos a história do futebol mundial para a palma da sua mão com qualidade premium e autenticidade.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase italic mb-4 tracking-wider">Links Úteis</h4>
              <ul className="space-y-2 text-white/40 font-bold uppercase text-xs">
                <li className="hover:text-red-600 transition-colors cursor-pointer">Sobre Nós</li>
                <li className="hover:text-red-600 transition-colors cursor-pointer">Política de Troca</li>
                <li className="hover:text-red-600 transition-colors cursor-pointer">Rastrear Pedido</li>
                <li className="hover:text-red-600 transition-colors cursor-pointer">Fale Conosco</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase italic mb-4 tracking-wider">Redes Sociais</h4>
              <ul className="space-y-2 text-white/40 font-bold uppercase text-xs">
                <li className="hover:text-red-600 transition-colors cursor-pointer">Instagram</li>
                <li className="hover:text-red-600 transition-colors cursor-pointer">WhatsApp</li>
                <li className="hover:text-red-600 transition-colors cursor-pointer">Facebook</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
              © 2026 Dallas Imports. Made with passion for the game.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}