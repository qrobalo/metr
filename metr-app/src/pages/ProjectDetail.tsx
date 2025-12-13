import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, ArrowLeft, Edit } from 'lucide-react';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProject, setEditedProject] = useState({
    nom: '',
    client: '',
    statut: '',
    referenceInterne: '',
    typologie: '',
    adresse: '',
    dateLivraison: ''
  });

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const data = await projectAPI.getProject(projectId);
      setProject(data);
      setEditedProject({
        nom: data.nom || '',
        client: data.client || '',
        statut: data.statut || 'En_attente',
        referenceInterne: data.referenceInterne || '',
        typologie: data.typologie || '',
        adresse: data.adresse || '',
        dateLivraison: data.dateLivraison || ''
      });
      setPlans(data.plans || []);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erreur chargement projet:', error);
      alert('❌ Erreur lors du chargement du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;
    
    try {
      await projectAPI.deletePlan(projectId, planId);
      setPlans(prev => prev.filter(p => p.idPlan !== planId));
      alert('✓ Plan supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression plan:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    
    try {
      await projectAPI.deleteDocument(projectId, docId);
      setDocuments(prev => prev.filter(d => d.idFichier !== docId));
      alert('✓ Document supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression document:', error);
      alert('❌ Erreur lors de la suppression');
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
          alert('✓ Plan ajouté avec succès');
        } catch (error) {
          console.error('Erreur ajout plan:', error);
          alert('❌ Erreur lors de l\'ajout');
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
          alert('✓ Document ajouté avec succès');
        } catch (error) {
          console.error('Erreur ajout document:', error);
          alert('❌ Erreur lors de l\'ajout');
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    alert('📥 Export du projet en cours...\nFonctionnalité en développement');
  };

  // FONCTION DE MODIFICATION FONCTIONNELLE
  const handleSaveModifications = async () => {
    if (!editedProject.nom.trim()) {
      alert('⚠️ Le nom du projet est requis');
      return;
    }

    if (!editedProject.client.trim()) {
      alert('⚠️ Le nom du client est requis');
      return;
    }

    try {
      await projectAPI.updateProject(projectId, editedProject);
      setProject({ ...project, ...editedProject });
      setShowEditModal(false);
      alert('✓ Projet modifié avec succès !');
    } catch (error: any) {
      console.error('Erreur modification projet:', error);
      alert('❌ Erreur: ' + (error.message || 'Impossible de modifier le projet'));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-green-100 text-green-700' },
      'Termine': { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
      'En_attente': { label: 'Brouillon', color: 'bg-yellow-100 text-yellow-700' },
      'Archive': { label: 'Archivé', color: 'bg-gray-100 text-gray-700' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Projet non trouvé</p>
          <button onClick={onBack} className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusDisplay(project.statut);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white bg-[#1e3a8a] px-4 py-2.5 rounded-lg hover:bg-[#1e40af] mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour aux projets</span>
      </button>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">{project.nom}</h1>
            <p className="text-gray-600 mb-4">Client: {project.client || 'Non spécifié'}</p>
            <div className="flex items-center gap-4">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              {project.referenceInterne && (
                <span className="text-sm text-gray-500">
                  Réf: {project.referenceInterne}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-[#f97316] text-white px-6 py-3 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Modifier
          </button>
        </div>
      </div>

      {/* Plans du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Plans du projet</h2>
          <button 
            onClick={handleAddPlan}
            className="bg-[#f97316] text-white px-4 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
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
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
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
                        className="text-[#f97316] hover:text-[#ea580c] transition-colors p-2 hover:bg-orange-50 rounded-lg"
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
          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
            Aucun plan pour le moment. Ajoutez votre premier plan !
          </div>
        )}
      </div>

      {/* Exports du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Exports du projet</h2>
          <button 
            onClick={handleExport}
            className="bg-[#f97316] text-white px-4 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
          Aucun export disponible. Utilisez le bouton ci-dessus pour générer un export.
        </div>
      </div>

      {/* Documents annexes du projet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Documents annexes du projet</h2>
          <button 
            onClick={handleAddDocument}
            className="bg-[#f97316] text-white px-4 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
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
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
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
                        className="text-[#f97316] hover:text-[#ea580c] transition-colors p-2 hover:bg-orange-50 rounded-lg"
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
          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
            Aucun document pour le moment. Ajoutez votre premier document !
          </div>
        )}
      </div>

      {/* Modal de modification */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Modifier le projet</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nom du projet<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedProject.nom}
                  onChange={(e) => setEditedProject({...editedProject, nom: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Client<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedProject.client}
                  onChange={(e) => setEditedProject({...editedProject, client: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Statut
                </label>
                <select
                  value={editedProject.statut}
                  onChange={(e) => setEditedProject({...editedProject, statut: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="En_attente">Brouillon</option>
                  <option value="En_cours">En cours</option>
                  <option value="Termine">Terminé</option>
                  <option value="Archive">Archivé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Référence Interne
                </label>
                <input
                  type="text"
                  value={editedProject.referenceInterne}
                  onChange={(e) => setEditedProject({...editedProject, referenceInterne: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Typologie
                </label>
                <select
                  value={editedProject.typologie}
                  onChange={(e) => setEditedProject({...editedProject, typologie: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="">Sélectionner</option>
                  <option value="residentiel">Résidentiel</option>
                  <option value="commercial">Commercial</option>
                  <option value="industriel">Industriel</option>
                  <option value="renovation">Rénovation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={editedProject.adresse}
                  onChange={(e) => setEditedProject({...editedProject, adresse: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveModifications}
                className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}