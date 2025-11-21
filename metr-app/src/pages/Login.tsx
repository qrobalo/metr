import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="text-center">
          <span className="text-5xl font-bold text-primary-900">Metr</span>
          <span className="text-5xl font-bold text-secondary-500">.</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Connexion
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Adresse mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="input-field"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="text-right mt-2">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full py-3 text-lg">
            Se connecter
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Inscription
            </button>
          </p>
        </form>
      </div>

      {/* Back Button */}
      <button className="absolute bottom-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
        <ArrowLeft className="w-5 h-5" />
        Retour au site
      </button>
    </div>
  );
}