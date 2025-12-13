import React, { useState } from 'react';
import { Calendar, FileText, AlertCircle } from 'lucide-react';

interface CreateProjectProps {
  onCancel: () => void;
  onCreate: (data: any) => void;
}

export default function CreateProject({ onCancel, onCreate }: CreateProjectProps) {
  const [formData, setFormData] = useState({
    nom: '',
    client: '',
    referenceInterne: '',
    typologie: '',
    adresse: '',
    dateLivraison: '',
    statut: 'En_attente' // Par défaut : Brouillon
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du projet est requis';
    }
    if (!formData.client.trim()) {
      newErrors.client = 'Le nom du client est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreate(formData);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2">
          Créer un nouveau projet
        </h2>
        <p className="text-gray-600">Remplissez les informations pour créer votre projet</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-3 mr-8">
                <p className="text-sm font-medium text-[#1e3a8a]">Informations</p>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center ml-8">
              <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Finalisation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du projet */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Informations du projet
            </h3>
            <p className="text-sm text-gray-500">
              Les champs marqués d'un * sont obligatoires
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nom du projet */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nom du projet<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Ex: Villa Méditerranée"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.nom 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-[#1e3a8a]'
              }`}
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nom}
              </p>
            )}
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Client<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
              placeholder="Ex: Dupont Immobilier"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.client 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-[#1e3a8a]'
              }`}
            />
            {errors.client && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.client}
              </p>
            )}
          </div>

          {/* Référence Interne */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Référence Interne
            </label>
            <input
              type="text"
              value={formData.referenceInterne}
              onChange={(e) => handleChange('referenceInterne', e.target.value)}
              placeholder="Ex: PRJ-2025-042"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
            />
          </div>

          {/* Typologie projet */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Typologie projet
            </label>
            <select
              value={formData.typologie}
              onChange={(e) => handleChange('typologie', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all bg-white"
            >
              <option value="">Sélectionner une typologie</option>
              <option value="residentiel">Résidentiel</option>
              <option value="commercial">Commercial</option>
              <option value="industriel">Industriel</option>
              <option value="renovation">Rénovation</option>
            </select>
          </div>

          {/* Adresse du projet */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Adresse du projet
            </label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => handleChange('adresse', e.target.value)}
              placeholder="Ex: 12 Avenue des Plans, 75001 Paris"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
            />
          </div>

          {/* Date prévisionnelle de livraison */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Date de livraison prévue
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.dateLivraison}
                onChange={(e) => handleChange('dateLivraison', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Statut initial */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Statut initial
            </label>
            <select
              value={formData.statut}
              onChange={(e) => handleChange('statut', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all bg-white"
            >
              <option value="En_attente">Brouillon</option>
              <option value="En_cours">En cours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button 
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-2 border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1 disabled:opacity-50"
        >
          Annuler
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-medium order-1 sm:order-2 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Création...
            </>
          ) : (
            'Créer le projet'
          )}
        </button>
      </div>
    </div>
  );
}