import React, { useState } from 'react';
import { Upload, Calendar, Plus, Check, X } from 'lucide-react';

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
  
  const [uploadedPlans, setUploadedPlans] = useState<any[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'plans' | 'documents') => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      date: new Date().toLocaleDateString('fr-FR'),
      title: file.name,
      progress: Math.floor(Math.random() * 40) + 60 // Simule un upload en cours
    }));

    if (type === 'plans') {
      setUploadedPlans(prev => [...prev, ...newFiles]);
      // Simuler la progression
      newFiles.forEach((file, idx) => {
        setTimeout(() => {
          setUploadedPlans(prev => 
            prev.map(f => f.id === file.id ? { ...f, progress: 100 } : f)
          );
        }, 1000 + (idx * 500));
      });
    } else {
      setUploadedDocuments(prev => [...prev, ...newFiles]);
      newFiles.forEach((file, idx) => {
        setTimeout(() => {
          setUploadedDocuments(prev => 
            prev.map(f => f.id === file.id ? { ...f, progress: 100 } : f)
          );
        }, 1000 + (idx * 500));
      });
    }
  };

  const removeFile = (id: number, type: 'plans' | 'documents') => {
    if (type === 'plans') {
      setUploadedPlans(prev => prev.filter(f => f.id !== id));
    } else {
      setUploadedDocuments(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.nom || !formData.client) {
      alert('Veuillez remplir au moins le nom du projet et le client');
      return;
    }
    onCreate({ 
      ...formData, 
      plans: uploadedPlans,
      documents: uploadedDocuments 
    });
  };

  const currentFiles = activeTab === 'plans' ? uploadedPlans : uploadedDocuments;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8">
        Créer un nouveau projet
      </h2>

      {/* Informations du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
            className={`px-8 py-3 font-medium transition-colors relative ${
              activeTab === 'plans'
                ? 'text-[#1e3a8a]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Plans
            {activeTab === 'plans' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e3a8a]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-8 py-3 font-medium transition-colors relative ${
              activeTab === 'documents'
                ? 'text-[#1e3a8a]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents
            {activeTab === 'documents' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e3a8a]"></div>
            )}
          </button>
        </div>

        {/* Upload Area or File List */}
        {currentFiles.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
            <div className="text-center">
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
              <label className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1e40af] transition-colors font-medium cursor-pointer inline-block">
                {activeTab === 'plans' ? 'Parcourir les plans' : 'Parcourir les documents'}
                <input
                  type="file"
                  multiple
                  accept={activeTab === 'plans' ? '.dwg,.pdf' : '.pdf,.jpg,.png,.doc,.docx,.xls,.xlsx'}
                  onChange={(e) => handleFileUpload(e, activeTab)}
                  className="hidden"
                />
              </label>
            </div>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progression</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{file.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{file.title}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                            <div
                              className="bg-[#1e3a8a] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          {file.progress === 100 && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeFile(file.id, activeTab)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Another File */}
            <label className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer inline-flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              {activeTab === 'plans' ? 'Ajouter un autre plan' : 'Ajouter un autre document'}
              <input
                type="file"
                multiple
                accept={activeTab === 'plans' ? '.dwg,.pdf' : '.pdf,.jpg,.png,.doc,.docx,.xls,.xlsx'}
                onChange={(e) => handleFileUpload(e, activeTab)}
                className="hidden"
              />
            </label>

            <p className="text-sm text-gray-500 text-center mt-3">
              Vous pourrez ajouter d'autres documents après la création du projet
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={onCancel}
          className="border border-gray-300 bg-white text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Annuler
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-[#f97316] text-white px-8 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
        >
          Créer mon projet
        </button>
      </div>
    </div>
  );
}