import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, QrCode, FileText, Check } from 'lucide-react';

export default function Checkout() {
  const [step, setStep] = useState<'auth' | 'payment' | 'success'>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'guest'>('guest');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');

  const handleContinueAsGuest = () => {
    setStep('payment');
  };

  const handlePayment = () => {
    setStep('success');
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
          <h1 className="text-lg font-bold text-white">Finalizar Compra</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-20 pb-8 px-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Authentication */}
          {step === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Como deseja continuar?</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={handleContinueAsGuest}
                    className="w-full bg-[#76FF03] text-black py-4 rounded-lg font-bold hover:bg-[#FFEB3B] transition-colors"
                  >
                    Continuar como convidado
                  </button>
                  
                  <button
                    onClick={() => setAuthMode('login')}
                    className="w-full bg-gray-800 text-white py-4 rounded-lg font-bold hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    Fazer login
                  </button>
                </div>

                {authMode === 'login' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="email"
                      placeholder="E-mail"
                      className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#76FF03] transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Senha"
                      className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#76FF03] transition-colors"
                    />
                    <button
                      onClick={() => setStep('payment')}
                      className="w-full bg-[#76FF03] text-black py-3 rounded-lg font-bold hover:bg-[#FFEB3B] transition-colors"
                    >
                      Entrar
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Resumo do pedido</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Brasil Retrô 1970 (M)</span>
                    <span>R$ 349,90</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Quantidade</span>
                    <span>1</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#76FF03]">R$ 349,90</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-4">Método de Pagamento</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                      paymentMethod === 'pix'
                        ? 'bg-[#76FF03] text-black border-[#76FF03]'
                        : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <QrCode size={24} />
                    <div className="flex-1 text-left">
                      <p className="font-bold">Pix</p>
                      <p className="text-sm opacity-75">Pagamento instantâneo</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                      paymentMethod === 'card'
                        ? 'bg-[#76FF03] text-black border-[#76FF03]'
                        : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <CreditCard size={24} />
                    <div className="flex-1 text-left">
                      <p className="font-bold">Cartão de Crédito</p>
                      <p className="text-sm opacity-75">Em até 12x sem juros</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('boleto')}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                      paymentMethod === 'boleto'
                        ? 'bg-[#76FF03] text-black border-[#76FF03]'
                        : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <FileText size={24} />
                    <div className="flex-1 text-left">
                      <p className="font-bold">Boleto</p>
                      <p className="text-sm opacity-75">Vencimento em 3 dias</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Número do cartão"
                      className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#76FF03] transition-colors"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Validade"
                        className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#76FF03] transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full bg-black text-white border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-[#76FF03] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-[#76FF03] text-black py-4 rounded-full font-bold text-lg hover:bg-[#FFEB3B] transition-colors"
              >
                Finalizar pagamento
              </button>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                className="w-24 h-24 bg-[#76FF03] rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Check size={48} className="text-black" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-2">Pedido confirmado!</h2>
              <p className="text-gray-300 mb-8">
                Você receberá um e-mail com os detalhes da compra
              </p>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6 text-left">
                <p className="text-gray-400 text-sm mb-1">Número do pedido</p>
                <p className="text-white font-bold text-xl">#DI-2026-001</p>
              </div>

              <Link to="/">
                <button className="w-full bg-[#76FF03] text-black py-4 rounded-full font-bold text-lg hover:bg-[#FFEB3B] transition-colors">
                  Voltar para a loja
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
