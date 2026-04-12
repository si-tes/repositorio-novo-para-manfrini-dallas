import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import BrazilSection from '../components/BrazilSection';
import NationalTeams from '../components/NationalTeams';
import GiftsSection from '../components/GiftsSection';
import CatalogSection from '../components/CatalogSection';

export default function Home() {
  const bestSellers = [
    {
      id: '1',
      name: 'Brasil Retrô 1970',
      price: 349.90,
      image: 'https://images.unsplash.com/photo-1551479460-5e76c686816a?w=400',
      team: 'Seleção Brasileira'
    },
    {
      id: '2',
      name: 'Argentina 1986 Maradona',
      price: 399.90,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
      team: 'Seleção Argentina'
    },
    {
      id: '3',
      name: 'Brasil 1994 Romário',
      price: 379.90,
      image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400',
      team: 'Seleção Brasileira'
    },
    {
      id: '4',
      name: 'França 1998 Zidane',
      price: 389.90,
      image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400',
      team: 'Seleção Francesa'
    },
    {
      id: '5',
      name: 'Itália 2006 Azzurri',
      price: 359.90,
      image: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=400',
      team: 'Seleção Italiana'
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />
      
      <main>
        <HeroSection />
        
        <ProductCarousel title="Mais Vendidas" products={bestSellers} />
        
        <BrazilSection />
        
        <NationalTeams />
        
        <GiftsSection />
        
        <CatalogSection />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-black py-8 px-4 bg-black">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Dalla Imports
          </h3>
          <p className="text-white/60 text-sm">
            Camisas de futebol com história e paixão
          </p>
          <p className="text-white/40 text-xs mt-4">
            © 2026 Dalla Imports. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
