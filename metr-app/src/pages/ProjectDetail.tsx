import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, ArrowLeft } from 'lucide-react';
import { projectAPI } from '../services/api';

interface ProjectDetailProps {
  projectId: number;
  onBack: () => void;
}

export default function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const [project, setProject] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const data = await projectAPI.getProject(projectId);
      setProject(data);
      setPlans(data.plans || []);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erreur chargement projet:', error);
      alert('Erreur lors du chargement du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;
    
    try {
      await projectAPI.deletePlan(projectId, planId);
      setPlans(prev => prev.filter(p => p.idPlan !== planId));
      alert('Plan supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression plan:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      await projectAPI.deleteDocument(projectId, docId);
      setDocuments(prev => prev.filter(d => d.idFichier !== docId));
      alert('Document supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression document:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleAddPlan = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dwg,.pdf';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await projectAPI.addPlan(projectId, {
            nom: file.name,
            niveau: '',
            zone: ''
          });
          loadProjectDetails();
          alert('Plan ajouté avec succès');
        } catch (error) {
          console.error('Erreur ajout plan:', error);
          alert('Erreur lors de l\'ajout');
        }
      }
    };
    input.click();
  };

  const handleAddDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.png,.doc,.docx,.xls,.xlsx';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await projectAPI.addDocument(projectId, {
            nom: file.name,
            type: file.type,
            taille: `${(file.size / 1024).toFixed(2)} KB`
          });
          loadProjectDetails();
          alert('Document ajouté avec succès');
        } catch (error) {
          console.error('Erreur ajout document:', error);
          alert('Erreur lors de l\'ajout');
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    alert('Export du projet en cours...\nFonctionnalité en développement');
  };

  const handleModifyProject = () => {
    alert('Modification du projet...\nFonctionnalité en développement');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Projet non trouvé</p>
          <button onClick={onBack} className="mt-4 btn-primary">
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Retour aux projets</span>
      </button>

      {/* Project Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">{project.nom}</h1>
        <p className="text-gray-600">Client: {project.client || 'Non spécifié'}</p>
      </div>

      {/* Plans du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Plans du projet</h2>
          <button 
            onClick={handleAddPlan}
            className="bg-[#f97316] text-white px-4 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un plan
          </button>
        </div>

        {plans.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.idPlan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(plan.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{plan.titre || plan.fichierNom || 'Sans titre'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeletePlan(plan.idPlan)}
                        className="text-[#f97316] hover:text-[#ea580c] transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun plan pour le moment
          </div>
        )}
      </div>

      {/* Exports du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Exports du projet</h2>
          <button 
            onClick={handleExport}
            className="bg-[#f97316] text-white px-4 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Titre</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={`export-${plan.idPlan}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(plan.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{plan.titre || 'Export'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#f97316] hover:text-[#ea580c] transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documents annexes du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Documents annexes du projet</h2>
          <button 
            onClick={handleAddDocument}
            className="bg-[#f97316] text-white px-4 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une annexe
          </button>
        </div>

        {documents.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.idFichier} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(doc.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{doc.titre}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteDocument(doc.idFichier)}
                        className="text-[#f97316] hover:text-[#ea580c] transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun document pour le moment
          </div>
        )}
      </div>

      {/* Modifier le projet Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleModifyProject}
          className="bg-[#f97316] text-white px-8 py-3 rounded-lg hover:bg-[#ea580c] transition-colors font-medium text-lg"
        >
          Modifier le projet
        </button>
      </div>
    </div>
  );
}