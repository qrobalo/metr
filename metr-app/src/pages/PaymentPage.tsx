import React, { useState } from 'react';
import { CreditCard, Lock, Check, ArrowLeft, Shield, Users, Zap, Crown, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentPageProps {
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentPage({ onBack, onPaymentSuccess }: PaymentPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    acceptTerms: false
  });

  const plans = {
    monthly: {
      price: 29,
      period: 'mois',
      total: 29,
      savings: 0
    },
    annual: {
      price: 24,
      period: 'mois',
      total: 288,
      savings: 60
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      alert('⚠️ Veuillez accepter les conditions générales de vente');
      return;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        alert('⚠️ Veuillez remplir tous les champs de la carte');
        return;
      }

      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        alert('⚠️ Le numéro de carte doit contenir 16 chiffres');
        return;
      }

      if (formData.cvv.length !== 3) {
        alert('⚠️ Le CVV doit contenir 3 chiffres');
        return;
      }
    }

    setIsProcessing(true);

    // Simulation d'appel API
    setTimeout(() => {
      setIsProcessing(false);
      alert('🎉 Paiement réussi !\n\nVotre abonnement Pro a été activé.\nVous pouvez maintenant inviter votre équipe.');
      onPaymentSuccess();
    }, 2000);
  };

  const currentPlan = plans[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux paramètres
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Passez à Metr Pro</h1>
          <p className="text-lg text-gray-600">Débloquez toutes les fonctionnalités avancées</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - Plan Selection & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choisissez votre formule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Plan */}
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                    selectedPlan === 'monthly'
                      ? 'border-[#1e3a8a] bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selectedPlan === 'monthly' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-[#1e3a8a]" />
                    </div>
                  )}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Mensuel</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">29€</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                  <p className="text-sm text-gray-500">Facturation mensuelle</p>
                </button>

                {/* Annual Plan */}
                <button
                  onClick={() => setSelectedPlan('annual')}
                  className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                    selectedPlan === 'annual'
                      ? 'border-[#1e3a8a] bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="absolute top-3 right-3">
                    {selectedPlan === 'annual' ? (
                      <CheckCircle className="w-6 h-6 text-[#1e3a8a]" />
                    ) : (
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">-17%</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Annuel</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-gray-900">24€</span>
                    <span className="text-gray-600">/mois</span>
                  </div>
                  <p className="text-sm text-gray-500">288€ facturés annuellement</p>
                  <p className="text-sm font-medium text-green-600 mt-1">Économisez 60€/an</p>
                </button>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-500" />
                Fonctionnalités incluses
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Jusqu\'à 10 membres par équipe',
                  'Projets illimités',
                  'Stockage de 100 GB',
                  'Collaboration en temps réel',
                  'Gestion des rôles et permissions',
                  'Historique complet des modifications',
                  'Export avancé (PDF, DWG, Excel)',
                  'Support prioritaire 24/7',
                  'Intégrations API',
                  'Rapports personnalisés',
                  'Bibliothèques partagées illimitées',
                  'Sauvegarde automatique quotidienne'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trial Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">14 jours d'essai gratuit</h4>
                  <p className="text-sm text-gray-700">
                    Testez toutes les fonctionnalités Pro sans engagement. Annulez à tout moment pendant la période d'essai et vous ne serez pas débité.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de paiement</h3>

              <div className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Méthode de paiement
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#1e3a8a] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">Carte</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-[#1e3a8a] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg font-bold text-blue-600 mb-1">PayPal</div>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        />
                        <CreditCard className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Card Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom sur la carte
                      </label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                        placeholder="JEAN DUPONT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-700 mb-3">
                      Vous serez redirigé vers PayPal pour finaliser le paiement de manière sécurisée.
                    </p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan {selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                    <span className="font-medium text-gray-900">{currentPlan.price}€/{currentPlan.period}</span>
                  </div>
                  {selectedPlan === 'annual' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Économies annuelles</span>
                      <span className="font-medium text-green-600">-{plans.annual.savings}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Essai gratuit</span>
                    <span className="font-medium text-gray-900">14 jours</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-bold text-gray-900">Total aujourd'hui</span>
                    <span className="font-bold text-gray-900 text-lg">0€</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center pt-2">
                    Vous serez débité de {currentPlan.total}€ après 14 jours
                  </p>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-xs text-gray-600">
                    J'accepte les <span className="text-[#1e3a8a] underline cursor-pointer">conditions générales de vente</span> et la <span className="text-[#1e3a8a] underline cursor-pointer">politique de confidentialité</span>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Démarrer l'essai gratuit
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé • SSL • Cryptage 256-bit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Paiement sécurisé par</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-gray-400 font-bold text-lg">Stripe</div>
            <div className="text-gray-400 font-bold text-lg">PayPal</div>
            <div className="text-gray-400 font-bold text-sm">🔒 SSL Secure</div>
            <div className="text-gray-400 font-bold text-sm">💳 Visa • Mastercard</div>
          </div>
        </div>
      </div>
    </div>
  );
}