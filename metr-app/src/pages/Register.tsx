import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onRegister: (data: any) => void;
  onNavigateToLogin: () => void;
}

export default function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // remove confirmPassword before sending
    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      telephone: formData.telephone,
      email: formData.email,
      password: formData.password
    };

    onRegister(payload);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      {/* Register Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Dites-nous en plus sur vous !
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => handleChange('prenom', e.target.value)}
              placeholder="Votre prénom"
              className="input-field"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Votre nom"
              className="input-field"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              placeholder="06 12 34 56 78"
              className="input-field"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Adresse mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
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
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full py-3 text-lg">
            Créer mon compte
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Connexion
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
