import React, { useState } from 'react';
import { Check, Calendar, User, Mail, Phone, MapPin, Globe, Edit2, Save, X, CheckCircle, LogOut } from 'lucide-react';

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
  onSave: (data: any) => Promise<void>;
  onLogout: () => void;
}

export default function Profile({ userData, onSave, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      onLogout();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                {formData.prenom?.[0] || 'U'}{formData.nom?.[0] || 'N'}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {isEditing ? 'Modification du profil' : 'Mon Profil'}
                </h2>
                <p className="text-blue-100">
                  {formData.prenom} {formData.nom}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white text-[#1e3a8a] px-6 py-3 rounded-lg hover:bg-blue-50 transition-all font-medium shadow-lg flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Nom
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">{formData.nom || 'Non renseigné'}</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Prénom
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  className="w-full max-w-2xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">{formData.prenom || 'Non renseigné'}</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">{formData.email || 'Non renseigné'}</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">{formData.telephone || 'Non renseigné'}</span>
                  {formData.telephone && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              )}
            </div>

            {/* Date naissance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Date de naissance
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleChange('dateNaissance', e.target.value)}
                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">
                    {formData.dateNaissance ? new Date(formData.dateNaissance).toLocaleDateString('fr-FR') : 'Non renseigné'}
                  </span>
                  {formData.dateNaissance && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              )}
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Genre
              </label>
              {isEditing ? (
                <select
                  value={formData.genre}
                  onChange={(e) => handleChange('genre', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all bg-white"
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">
                    {formData.genre === 'M' ? 'Homme' : formData.genre === 'F' ? 'Femme' : formData.genre || 'Non renseigné'}
                  </span>
                  {formData.genre && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              )}
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Pays
              </label>
              {isEditing ? (
                <select
                  value={formData.pays}
                  onChange={(e) => handleChange('pays', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all bg-white"
                >
                  <option value="">Sélectionner</option>
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Canada">Canada</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">{formData.pays || 'Non renseigné'}</span>
                  {formData.pays && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              )}
            </div>

            {/* Langue */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                Langue
              </label>
              {isEditing ? (
                <select
                  value={formData.langue}
                  onChange={(e) => handleChange('langue', e.target.value)}
                  className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all bg-white"
                >
                  <option value="">Sélectionner</option>
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Espagnol">Espagnol</option>
                  <option value="Allemand">Allemand</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 flex-1">{formData.langue || 'Non renseigné'}</span>
                  {formData.langue && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing ? (
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="border-2 border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <LogOut className="w-8 h-8 text-red-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Se déconnecter</h4>
                    <p className="text-sm text-gray-600">Déconnexion de votre session actuelle</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}