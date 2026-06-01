import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, QrCode, FileText, Check, ShoppingBag, MapPin, Truck, AlertCircle } from 'lucide-react';

import { carrinhoService, ItemCarrinho } from '../../services/carrinhoService';
import { pedidoService } from '../../services/pedidoService';
import { userService } from '../../services/userService';
import { cupomService, Cupom } from '../../services/cupomService';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [total, setTotal] = useState(0);
  const [valorFrete, setValorFrete] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [cupomCodigoInput, setCupomCodigoInput] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<Cupom | null>(null);
  const [cupomLoading, setCupomLoading] = useState(false);
  const [cupomError, setCupomError] = useState<string | null>(null);
  const [valorDesconto, setValorDesconto] = useState(0);

  const [formData, setFormData] = useState({
    usuario_id: user?.id,
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: '',
    cpf: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (token) {
      userService.getProfile(token).then(profile => {
        setFormData(prev => ({
          ...prev,
          nome: profile.nome || prev.nome,
          email: profile.email || prev.email,
          cpf: profile.cpf || prev.cpf,
          telefone: profile.telefone || prev.telefone,
          cep: profile.endereco_cep || prev.cep,
          rua: profile.endereco_rua || prev.rua,
          numero: profile.endereco_numero || prev.numero,
          bairro: profile.endereco_bairro || prev.bairro,
          cidade: profile.endereco_cidade || prev.cidade,
          estado: profile.endereco_estado || prev.estado,
          complemento: profile.endereco_complemento || prev.complemento
        }));
      }).catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    const carregarCarrinho = () => {
      const carrinhoAtual = carrinhoService.getCarrinho();
      if (carrinhoAtual.length === 0 && step !== 'success') {
        navigate('/carrinho'); // Se não tiver itens, volta pro carrinho
        return;
      }
      setItens(carrinhoAtual);
      const novoTotal = carrinhoAtual.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
      setTotal(novoTotal);
    };

    carregarCarrinho();
    window.scrollTo(0, 0);
  }, [navigate, step]);

  useEffect(() => {
    // Normalizar a cidade para ignorar acentos e transformar tudo em maiúsculo
    const cidadeNormalizada = formData.cidade
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
      
    // Itens antigos sem estoqueLocal serão considerados false
    const todosEstoqueLocal = itens.every(item => item.estoqueLocal === true);
    
    let freteCalculado = 40;
    if (!cidadeNormalizada) {
      freteCalculado = 0;
    } else if (cidadeNormalizada === 'ARAXA') {
      if (todosEstoqueLocal) {
        freteCalculado = 12;
      } else {
        freteCalculado = 40;
      }
    } else {
      freteCalculado = 40;
    }

    // LOG PARA DIAGNÓSTICO
    console.log("ITENS CARRINHO COMPLETO:", JSON.stringify(itens, null, 2));
    console.log({
      cidadeOriginal: formData.cidade,
      cidadeNormalizada,
      itensCarrinho: itens,
      todosTemEstoqueLocal: todosEstoqueLocal,
      freteCalculado
    });

    setValorFrete(freteCalculado);
  }, [formData.cidade, itens]);

  // Efeito para recalcular desconto sempre que o total ou o cupom mudar
  useEffect(() => {
    if (!cupomAplicado) {
      setValorDesconto(0);
      return;
    }
    let desconto = 0;
    const valorCupom = Number(cupomAplicado.valor);
    if (cupomAplicado.tipo_desconto === 'percentual') {
      desconto = total * (valorCupom / 100);
    } else if (cupomAplicado.tipo_desconto === 'fixo') {
      desconto = valorCupom;
    }
    // Não pode dar desconto maior que os produtos
    const descontoFinal = Math.min(desconto, total);

    setValorDesconto(descontoFinal);
  }, [total, cupomAplicado, valorFrete]);

  const handleApplyCupom = async () => {
    if (!cupomCodigoInput.trim()) return;
    setCupomLoading(true);
    setCupomError(null);
    try {
      const cupom = await cupomService.validarCupom(cupomCodigoInput.trim());
      setCupomAplicado(cupom);
      setCupomCodigoInput(''); // limpa o input após sucesso
    } catch (error: any) {
      setCupomError(error.message || 'Cupom inválido');
      setCupomAplicado(null);
    } finally {
      setCupomLoading(false);
    }
  };

  const handleRemoverCupom = () => {
    setCupomAplicado(null);
    setValorDesconto(0);
    setCupomError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa o erro ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['nome', 'email', 'telefone', 'cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado'];
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (typeof value === 'string' && !value.trim()) {
        newErrors[field] = 'Campo obrigatório';
      } else if (!value) {
        newErrors[field] = 'Campo obrigatório';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (formData.cpf) {
      const cpfNumeros = formData.cpf.replace(/\D/g, '');
      if (cpfNumeros.length !== 11) {
        newErrors.cpf = 'CPF inválido (deve conter 11 dígitos)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateDetails()) {
      setStep('payment');
      window.scrollTo(0, 0);
    }
  };

  const handlePayment = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const data = await pedidoService.criarPedido(formData, itens, total - valorDesconto + valorFrete, valorFrete, cupomAplicado?.codigo);
      
      carrinhoService.salvarCarrinho([]); // Limpa o carrinho
      
      if (data && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("URL de checkout indisponível");
      }
    } catch (error: any) {
      setSubmitError('Pagamento temporariamente indisponível. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">


      <main className="pt-24 md:pt-32 pb-20 container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {step !== 'success' ? (
              <motion.div 
                key="checkout-flow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col lg:flex-row gap-12"
              >
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black italic ${step === 'details' ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>1</div>
                    <div className="h-px bg-black/10 flex-1" />
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black italic ${step === 'payment' ? 'bg-red-600 text-white' : 'bg-black/5 text-black/20'}`}>2</div>
                  </div>

                  {step === 'details' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Dados de Entrega</h2>
                      
                      <div className="space-y-6">
                        <h3 className="font-bold text-lg uppercase italic border-b pb-2">Informações Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Nome Completo</label>
                            <input name="nome" value={formData.nome} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.nome ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="Ex: Pelé Eterno" />
                            {errors.nome && <p className="text-red-500 text-xs font-bold">{errors.nome}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">E-mail</label>
                            <input name="email" value={formData.email} onChange={handleChange} type="email" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="seu@email.com" />
                            {errors.email && <p className="text-red-500 text-xs font-bold">{errors.email}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">CPF</label>
                            <input name="cpf" value={formData.cpf} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.cpf ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="000.000.000-00" />
                            {errors.cpf && <p className="text-red-500 text-xs font-bold">{errors.cpf}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Telefone / WhatsApp</label>
                            <input name="telefone" value={formData.telefone} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.telefone ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="(00) 00000-0000" />
                            {errors.telefone && <p className="text-red-500 text-xs font-bold">{errors.telefone}</p>}
                          </div>
                        </div>

                        <h3 className="font-bold text-lg uppercase italic border-b pb-2 pt-4">Endereço</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">CEP</label>
                            <input name="cep" value={formData.cep} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.cep ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="00000-000" />
                            {errors.cep && <p className="text-red-500 text-xs font-bold">{errors.cep}</p>}
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Rua</label>
                            <input name="rua" value={formData.rua} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.rua ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="Nome da rua" />
                            {errors.rua && <p className="text-red-500 text-xs font-bold">{errors.rua}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Número</label>
                            <input name="numero" value={formData.numero} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.numero ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="123" />
                            {errors.numero && <p className="text-red-500 text-xs font-bold">{errors.numero}</p>}
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Complemento (Opcional)</label>
                            <input name="complemento" value={formData.complemento} onChange={handleChange} type="text" className="w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ring-red-600/20" placeholder="Apto, Bloco, etc" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Bairro</label>
                            <input name="bairro" value={formData.bairro} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.bairro ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="Bairro" />
                            {errors.bairro && <p className="text-red-500 text-xs font-bold">{errors.bairro}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Cidade</label>
                            <input name="cidade" value={formData.cidade} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.cidade ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="Cidade" />
                            {errors.cidade && <p className="text-red-500 text-xs font-bold">{errors.cidade}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic tracking-widest text-black/40">Estado</label>
                            <input name="estado" value={formData.estado} onChange={handleChange} type="text" className={`w-full bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold focus:ring-2 ${errors.estado ? 'ring-2 ring-red-500' : 'ring-red-600/20'}`} placeholder="UF" />
                            {errors.estado && <p className="text-red-500 text-xs font-bold">{errors.estado}</p>}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleContinue}
                        className="w-full mt-8 bg-red-600 text-white py-5 rounded-full font-black text-xl uppercase italic tracking-wider hover:bg-black transition-all shadow-xl"
                      >
                        Continuar para Pagamento
                      </button>
                    </div>
                  )}

                  {step === 'payment' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Pagamento</h2>
                      <div className="bg-[#f5f5f5] rounded-2xl p-6 text-center border border-black/5">
                        <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png" alt="Mercado Pago" className="h-12 mx-auto mb-4 object-contain" />
                        <h3 className="font-black italic text-lg uppercase mb-2">Ambiente Seguro</h3>
                        <p className="text-black/60 text-sm font-bold">Você será redirecionado para o Mercado Pago para pagar com PIX, Cartão ou Boleto com total segurança.</p>
                      </div>

                      {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3">
                          <AlertCircle size={20} className="flex-shrink-0" />
                          <p className="font-bold text-sm">{submitError}</p>
                        </div>
                      )}

                      <button 
                        onClick={handlePayment}
                        disabled={isSubmitting}
                        className={`w-full mt-8 text-white py-5 rounded-full font-black text-xl uppercase italic tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all ${
                          isSubmitting ? 'bg-black/50 cursor-not-allowed' : 'bg-red-600 hover:bg-black'
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Processando...</span>
                        ) : (
                          <>
                            <ShoppingBag size={24} />
                            Ir para o Pagamento
                          </>
                        )}
                      </button>
                      <button onClick={() => setStep('details')} className="w-full text-black/40 font-black uppercase italic text-xs hover:text-black transition-colors">Voltar para Endereço</button>
                    </div>
                  )}
                </div>

                {/* Sidebar Summary */}
                <div className="w-full lg:w-96">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm sticky top-32 space-y-6">
                    <h3 className="font-black uppercase italic tracking-tighter text-xl">Resumo do Pedido</h3>
                    
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {itens.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                            <ImageWithFallback src={item.imagem} className="w-full h-full object-cover" alt={item.nome} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-black uppercase italic text-red-600 truncate">{item.nome}</p>
                            <div className="flex justify-between items-center mt-1">
                              <p className="font-bold text-xs text-black/60">Tam: {item.tamanho}</p>
                              <p className="font-bold text-xs text-black/60">Qtd: {item.quantidade}</p>
                            </div>
                            <p className="font-black italic mt-1 text-sm">
                              R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-black/5 w-full" />
                    
                    {/* Input de Cupom */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Cupom de Desconto</p>
                      {cupomAplicado ? (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-black italic uppercase text-green-700 text-sm">{cupomAplicado.codigo}</p>
                            <p className="font-bold text-[10px] text-green-600">Cupom aplicado com sucesso!</p>
                          </div>
                          <button onClick={handleRemoverCupom} className="text-red-500 font-bold text-[10px] uppercase hover:underline">
                            Remover
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={cupomCodigoInput}
                            onChange={(e) => setCupomCodigoInput(e.target.value.toUpperCase())}
                            placeholder="INSERIR CÓDIGO"
                            className="bg-[#f5f5f5] border-none rounded-xl px-4 py-3 font-bold flex-1 uppercase"
                          />
                          <button 
                            onClick={handleApplyCupom}
                            disabled={cupomLoading || !cupomCodigoInput.trim()}
                            className="bg-black text-white px-4 rounded-xl font-black italic uppercase text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {cupomLoading ? '...' : 'Aplicar'}
                          </button>
                        </div>
                      )}
                      {cupomError && <p className="text-red-500 text-[10px] font-bold">{cupomError}</p>}
                    </div>

                    <div className="h-px bg-black/5 w-full" />
                    
                    <div className="space-y-2 text-sm font-bold uppercase tracking-widest text-black/60">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                      </div>
                      {valorDesconto > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Desconto</span>
                          <span className="text-sm font-bold">
                            - R$ {valorDesconto.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-black">
                        <span>Frete</span>
                        <span className="text-sm font-bold">
                          {valorFrete === 0 ? 'Calcular...' : `R$ ${valorFrete.toFixed(2).replace('.', ',')}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-px bg-black/5 w-full" />
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-black uppercase italic tracking-tighter text-2xl">Total</span>
                      <span className="font-black italic text-2xl text-red-600">R$ {(total - valorDesconto + valorFrete).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto text-center py-20"
              >
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Check size={48} className="text-white" />
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">Pedido <br /><span className="text-red-600">Confirmado!</span></h2>
                <p className="text-black/60 font-medium mb-12">Obrigado pela compra, {formData.nome.split(' ')[0]}! Você receberá os detalhes no seu e-mail ({formData.email}) em instantes.</p>
                <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm mb-8 text-left">
                  <p className="text-[10px] font-black uppercase italic text-black/40 mb-1">Número do Pedido</p>
                  <p className="text-2xl font-black italic tracking-tighter">#{Math.floor(Math.random() * 100000).toString().padStart(6, '0')}</p>
                </div>
                <Link to="/">
                  <button className="w-full bg-black text-white py-5 rounded-full font-black text-xl uppercase italic tracking-wider hover:bg-red-600 transition-all shadow-xl">
                    Voltar para a Loja
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
