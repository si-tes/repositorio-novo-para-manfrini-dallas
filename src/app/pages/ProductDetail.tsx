import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { obterProduto, obterGaleriaProduto } from '../../services/produtoService';
import { mapProdutoToVisual, VisualProduto } from '../adapters/produtoMapper';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [visualData, setVisualData] = useState<VisualProduto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        
        const produtoDb = await obterProduto(Number(id));
        const galeriaDb = await obterGaleriaProduto(Number(id));
        
        const produtoMapeado = mapProdutoToVisual(produtoDb, galeriaDb);
        setVisualData(produtoMapeado);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar o produto.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-10 container mx-auto px-4 text-center">
        <p className="text-xl font-bold">Carregando dados do servidor...</p>
      </div>
    );
  }

  if (error || !visualData) {
    return (
      <div className="pt-32 pb-10 container mx-auto px-4 text-center">
        <p className="text-xl font-bold text-red-600">Erro: {error}</p>
        <Link to="/" className="text-blue-500 underline mt-4 block">Voltar para Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-10 container mx-auto px-4">
      <Link to="/" className="text-blue-500 underline mb-8 block">&larr; Voltar para Home</Link>
      
      <h2 className="text-2xl font-black mb-4 uppercase">Debug de Integração: ProductDetail</h2>
      
      <div className="bg-gray-100 p-6 rounded-lg font-mono text-sm border border-black/20 overflow-auto">
        <pre>{JSON.stringify(visualData, null, 2)}</pre>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm">
        <div>
          <p className="font-bold mb-2">Imagem Principal (image)</p>
          <img src={visualData.image} alt={visualData.name} className="w-full h-auto border border-black/10" />
        </div>
        <div>
          <p className="font-bold mb-2">Imagem Secundária (img2)</p>
          <img src={visualData.img2} alt={`${visualData.name} hover`} className="w-full h-auto border border-black/10" />
        </div>
      </div>
    </div>
  );
}