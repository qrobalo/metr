import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Mail } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
  onResetPassword: (email: string) => Promise<void>;
}

export default function ForgotPassword({ onBack, onResetPassword }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);
    try {
      await onResetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#e8eef7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#1E3A8A] mb-8">
            Metr<span className="text-[#F97316]">.</span>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-8 overflow-hidden">
          {/* Bouton retour */}
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour à la connexion</span>
          </button>

          {!success ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1E3A8A] bg-opacity-10 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Mot de passe oublié ?
                </h2>
                <p className="text-sm text-gray-600">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-md hover:bg-[#142a5e] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien de réinitialisation'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Email envoyé !
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Pensez à vérifier vos spams si vous ne recevez pas l'email.
              </p>
              <button
                onClick={onBack}
                className="text-sm text-[#1E3A8A] hover:text-[#142a5e] font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}