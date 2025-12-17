import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock } from 'lucide-react';

interface ResetPasswordProps {
  token: string;
  onResetComplete: (success: boolean) => void;
  onResetPassword: (token: string, newPassword: string) => Promise<void>;
}

export default function ResetPassword({ token, onResetComplete, onResetPassword }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Vérifier qu'on a bien un token
    if (!token) {
      setError('Token invalide ou manquant');
    }
  }, [token]);

  const validatePassword = () => {
    if (!newPassword) {
      setError('Veuillez entrer un nouveau mot de passe');
      return false;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (!confirmPassword) {
      setError('Veuillez confirmer votre mot de passe');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError('');

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    try {
      await onResetPassword(token, newPassword);
      setSuccess(true);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        onResetComplete(true);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getPasswordStrength = () => {
    if (newPassword.length === 0) return null;
    if (newPassword.length < 6) return { label: 'Faible', color: 'bg-red-500', width: 'w-1/3' };
    if (newPassword.length < 10) return { label: 'Moyen', color: 'bg-orange-500', width: 'w-2/3' };
    return { label: 'Fort', color: 'bg-green-500', width: 'w-full' };
  };

  const passwordStrength = getPasswordStrength();

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
          {!success ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1E3A8A] bg-opacity-10 rounded-full mb-4">
                  <Lock className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Nouveau mot de passe
                </h2>
                <p className="text-sm text-gray-600">
                  Choisissez un mot de passe sécurisé pour votre compte.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Minimum 6 caractères"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 p-0"
                      disabled={isLoading}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Indicateur de force */}
                  {passwordStrength && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className={`${passwordStrength.color} h-1.5 rounded-full transition-all ${passwordStrength.width}`}></div>
                        </div>
                        <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Confirmez votre mot de passe"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 p-0"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                      Modification en cours...
                    </>
                  ) : (
                    'Réinitialiser le mot de passe'
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
                Mot de passe modifié !
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Votre mot de passe a été réinitialisé avec succès.
              </p>
              <p className="text-xs text-gray-500">
                Redirection vers la page de connexion...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}