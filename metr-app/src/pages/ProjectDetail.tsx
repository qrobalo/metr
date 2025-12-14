import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, ArrowLeft, Edit, Calendar, User, MapPin, FileText, Folder, Upload, CheckCircle, Clock, Archive, AlertCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'plans' | 'exports' | 'documents'>('plans');
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

  const handleDeletePlan = async (planId: number, planName: string) => {
    if (!confirm(`Supprimer le plan "${planName}" ?`)) return;
    
    try {
      await projectAPI.deletePlan(projectId, planId);
      setPlans(prev => prev.filter(p => p.idPlan !== planId));
      alert('✅ Plan supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression plan:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const handleDeleteDocument = async (docId: number, docName: string) => {
    if (!confirm(`Supprimer le document "${docName}" ?`)) return;
    
    try {
      await projectAPI.deleteDocument(projectId, docId);
      setDocuments(prev => prev.filter(d => d.idFichier !== docId));
      alert('✅ Document supprimé avec succès');
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
          await loadProjectDetails();
          alert('✅ Plan ajouté avec succès');
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
          await loadProjectDetails();
          alert('✅ Document ajouté avec succès');
        } catch (error) {
          console.error('Erreur ajout document:', error);
          alert('❌ Erreur lors de l\'ajout');
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    alert('📥 Export du projet en cours...\n\nFormats disponibles:\n- PDF\n- Excel\n- DWG\n\nFonctionnalité en développement');
  };

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
      alert('✅ Projet modifié avec succès !');
    } catch (error: any) {
      console.error('Erreur modification projet:', error);
      alert('❌ Erreur: ' + (error.message || 'Impossible de modifier le projet'));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { 
        label: 'En cours', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <Clock className="w-4 h-4" />
      },
      'Termine': { 
        label: 'Terminé', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <CheckCircle className="w-4 h-4" />
      },
      'En_attente': { 
        label: 'Brouillon', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <Edit className="w-4 h-4" />
      },
      'Archive': { 
        label: 'Archivé', 
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: <Archive className="w-4 h-4" />
      }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1e3a8a] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet introuvable</h2>
          <p className="text-gray-600 mb-6">Le projet demandé n'existe pas ou a été supprimé</p>
          <button 
            onClick={onBack} 
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg hover:bg-[#1e40af] transition-colors font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusDisplay(project.statut);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white bg-[#1e3a8a] px-4 py-2.5 rounded-lg hover:bg-[#1e40af] mb-6 transition-all font-medium shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux projets</span>
        </button>

        {/* Project Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">{project.nom}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                    {project.referenceInterne && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                        Réf: {project.referenceInterne}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Client</p>
                    <p className="font-semibold">{project.client || 'Non spécifié'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="font-semibold">{formatDate(project.dateCreation)}</p>
                  </div>
                </div>

                {project.adresse && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Adresse</p>
                      <p className="font-semibold">{project.adresse}</p>
                    </div>
                  </div>
                )}

                {project.typologie && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Typologie</p>
                      <p className="font-semibold capitalize">{project.typologie}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button 
              onClick={() => setShowEditModal(true)}
              className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2 justify-center lg:justify-start"
            >
              <Edit className="w-5 h-5" />
              Modifier le projet
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plans</p>
                <p className="text-3xl font-bold text-gray-900">{plans.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Documents</p>
                <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Exports</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'plans'
                  ? 'text-[#1e3a8a] bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Plans ({plans.length})
              </div>
              {activeTab === 'plans' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a]"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('exports')}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'exports'
                  ? 'text-[#1e3a8a] bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Exports
              </div>
              {activeTab === 'exports' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a]"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'documents'
                  ? 'text-[#1e3a8a] bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Folder className="w-5 h-5" />
                Documents ({documents.length})
              </div>
              {activeTab === 'documents' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a]"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Plans du projet</h2>
                  <button 
                    onClick={handleAddPlan}
                    className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
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
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{plan.titre || plan.fichierNom || 'Sans titre'}</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeletePlan(plan.idPlan, plan.titre || 'ce plan')}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
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
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun plan</h3>
                    <p className="text-gray-500 mb-4">Ajoutez votre premier plan au projet</p>
                    <button 
                      onClick={handleAddPlan}
                      className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un plan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Exports Tab */}
            {activeTab === 'exports' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Exports du projet</h2>
                  <button 
                    onClick={handleExport}
                    className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Générer un export
                  </button>
                </div>

                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun export disponible</h3>
                  <p className="text-gray-500 mb-6">Générez un export pour télécharger les données du projet</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button 
                      onClick={handleExport}
                      className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export PDF
                    </button>
                    <button 
                      onClick={handleExport}
                      className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export Excel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Documents annexes</h2>
                  <button 
                    onClick={handleAddDocument}
                    className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un document
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
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{doc.titre}</td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDeleteDocument(doc.idFichier, doc.titre)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
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
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Folder className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun document</h3>
                    <p className="text-gray-500 mb-4">Ajoutez des documents annexes au projet</p>
                    <button 
                      onClick={handleAddDocument}
                      className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un document
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de modification */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Modifier le projet</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nom du projet<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedProject.nom}
                  onChange={(e) => setEditedProject({...editedProject, nom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                  placeholder="Ex: Villa Méditerranée"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Client<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editedProject.client}
                  onChange={(e) => setEditedProject({...editedProject, client: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                  placeholder="Ex: Dupont Immobilier"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Statut
                </label>
                <select
                  value={editedProject.statut}
                  onChange={(e) => setEditedProject({...editedProject, statut: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white transition-all"
                >
                  <option value="En_attente">🟡 Brouillon</option>
                  <option value="En_cours">🟢 En cours</option>
                  <option value="Termine">🔵 Terminé</option>
                  <option value="Archive">⚪ Archivé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Référence Interne
                </label>
                <input
                  type="text"
                  value={editedProject.referenceInterne}
                  onChange={(e) => setEditedProject({...editedProject, referenceInterne: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                  placeholder="Ex: PRJ-2025-042"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Typologie
                </label>
                <select
                  value={editedProject.typologie}
                  onChange={(e) => setEditedProject({...editedProject, typologie: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white transition-all"
                >
                  <option value="">Sélectionner une typologie</option>
                  <option value="residentiel">🏠 Résidentiel</option>
                  <option value="commercial">🏢 Commercial</option>
                  <option value="industriel">🏭 Industriel</option>
                  <option value="renovation">🔨 Rénovation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={editedProject.adresse}
                  onChange={(e) => setEditedProject({...editedProject, adresse: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] transition-all"
                  placeholder="Ex: 12 Avenue des Plans, 75001 Paris"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowEditModal(false)}
                className="border-2 border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveModifications}
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}