import React, { useState } from 'react';
import { Check, Calendar } from 'lucide-react';

interface ProfileProps {
  userData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    dateNaissance: string;
    genre: string;
    pays: string;
    langue: string;
  };
  onSave: (data: any) => void;
}

export default function Profile({ userData, onSave }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Modification du profil' : 'Information du profil'}
          </h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#f97316] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
            >
              Modifier le profil
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Nom :
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.nom || 'Nicolas'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Prénom :
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.prenom || 'Pulin'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Adresse mail :
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.email || 'nicolas.pulin@gmail.com'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Date de naissance :
            </label>
            {isEditing ? (
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleChange('dateNaissance', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
                />
                <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.dateNaissance || '01/02/1993'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Numéro de téléphone :
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.telephone || '01 23 45 67 89'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Genre :
            </label>
            {isEditing ? (
              <select
                value={formData.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              >
                <option value="">Genre</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Autre">Autre</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.genre || 'M'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Pays */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Pays :
            </label>
            {isEditing ? (
              <select
                value={formData.pays}
                onChange={(e) => handleChange('pays', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              >
                <option value="">Sélectionnez un pays</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.pays || 'France'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>

          {/* Langue */}
          <div>
            <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
              Langue :
            </label>
            {isEditing ? (
              <select
                value={formData.langue}
                onChange={(e) => handleChange('langue', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              >
                <option value="">Sélectionnez une langue</option>
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
                <option value="Espagnol">Espagnol</option>
                <option value="Allemand">Allemand</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-900">{formData.langue || 'Français'}</span>
                <Check className="w-4 h-4 text-green-500 ml-auto" />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={handleCancel}
              className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-[#f97316] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
            >
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}