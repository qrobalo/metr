import React, { useState } from 'react';
import { Upload, Calendar, Plus, Check } from 'lucide-react';

interface CreateProjectProps {
  onCancel: () => void;
  onCreate: (data: any) => void;
}

export default function CreateProject({ onCancel, onCreate }: CreateProjectProps) {
  const [activeTab, setActiveTab] = useState<'plans' | 'documents'>('plans');
  const [formData, setFormData] = useState({
    nom: '',
    client: '',
    referenceInterne: '',
    typologie: '',
    adresse: '',
    dateLivraison: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState([
    { date: '31/10/2025', title: 'Plan 2ème étage', progress: 100 },
    { date: '31/10/2025', title: 'Plan 1er étage', progress: 70 },
    { date: '31/10/2015', title: 'Plan rez-de-chaussée', progress: 10 }
  ]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onCreate({ ...formData, files: uploadedFiles });
  };

  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-3xl font-bold text-primary-900 mb-8">
        Créer un nouveau projet
      </h2>

      {/* Informations du projet */}
      <div className="card mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Informations du projet
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Complétez les informations principales pour créer votre nouveau projet
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="input-field"
            />
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
              className="input-field"
            />
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
              className="input-field"
            />
          </div>

          {/* Typologie projet */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Typologie projet<span className="text-red-500">*</span>
            </label>
            <select
              value={formData.typologie}
              onChange={(e) => handleChange('typologie', e.target.value)}
              className="input-field"
            >
              <option value="">Sélectionner une typologie</option>
              <option value="residentiel">Résidentiel</option>
              <option value="commercial">Commercial</option>
              <option value="industriel">Industriel</option>
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
              className="input-field"
            />
          </div>

          {/* Date prévisionnelle de livraison */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Date prévisionnelle de livraison
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.dateLivraison}
                onChange={(e) => handleChange('dateLivraison', e.target.value)}
                placeholder="Choisir une date"
                className="input-field"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents du projet */}
      <div className="card mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Documents du projet
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Vous pourrez ajouter des plans et documents à tout moment
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === 'plans'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === 'documents'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents
          </button>
        </div>

        {/* Upload Area */}
        {uploadedFiles.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {activeTab === 'plans' ? 'Déposez vos plans ici' : 'Déposez vos documents ici'}
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              {activeTab === 'plans' 
                ? 'Formats recommandés: DWG, PDF'
                : 'Formats acceptés: PDF, JPG, PNG, DOC, XLS'}
            </p>
            <button className="btn-primary">
              {activeTab === 'plans' ? 'Parcourir les plans' : 'Parcourir les documents'}
            </button>
          </div>
        ) : (
          <div>
            {/* File List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Titre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {uploadedFiles.map((file, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-600">{file.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{file.title}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                            <div
                              className="bg-primary-900 h-2 rounded-full"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          {file.progress === 100 && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Another Document */}
            <button className="btn-outline flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              {activeTab === 'plans' ? 'Ajouter un autre plan' : 'Ajouter un autre document'}
            </button>

            <p className="text-sm text-gray-500 text-center mt-3">
              Vous pourrez ajouter d'autres documents après la création du projet
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn-outline px-8">
          Annuler
        </button>
        <button onClick={handleSubmit} className="btn-secondary px-8">
          Créer mon projet
        </button>
      </div>
    </div>
  );
}