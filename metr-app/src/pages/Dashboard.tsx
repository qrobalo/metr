import React, { useState, useEffect, useRef } from 'react';
import { Plus, ExternalLink, TrendingUp, MoreVertical, Edit, Archive, Trash2, CheckCircle } from 'lucide-react';
import { projectAPI } from '../services/api';

interface Project {
  idProjet: number;
  nom: string;
  client?: string;
  statut: string;
  dateCreation: string;
}

interface DashboardProps {
  projects: Project[];
  onCreateProject: () => void;
  onOpenProject: (id: number) => void;
  onProjectsChange: () => void;
}

export default function Dashboard({ projects, onCreateProject, onOpenProject, onProjectsChange }: DashboardProps) {
  const [localProjects, setLocalProjects] = useState(projects);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prendre seulement les 6 projets les plus récents (non archivés)
  const activeProjects = localProjects.filter(p => p.statut !== 'Archive');
  const recentProjects = activeProjects.slice(0, 6);

  // Mapper les statuts de la BDD aux affichages
  const getStatusDisplay = (statut: string) => {
    const statusMap: any = {
      'En_cours': { label: 'En cours', color: 'bg-[#22C55E] text-white', badge: 'bg-[#22C55E]' },
      'Termine': { label: 'Terminé', color: 'bg-[#3B82F6] text-white', badge: 'bg-[#3B82F6]' },
      'En_attente': { label: 'Brouillon', color: 'bg-[#F59E0B] text-white', badge: 'bg-[#F59E0B]' },
      'Archive': { label: 'Archivé', color: 'bg-gray-400 text-white', badge: 'bg-gray-400' }
    };
    return statusMap[statut] || statusMap['En_attente'];
  };

  // Calculer les statistiques RÉELLES
  const stats = {
    projetsActifs: activeProjects.length,
    projetsTotal: localProjects.length,
    rapportsCeMois: localProjects.filter(p => {
      const projectDate = new Date(p.dateCreation);
      const now = new Date();
      return projectDate.getMonth() === now.getMonth() && 
             projectDate.getFullYear() === now.getFullYear();
    }).length,
    exportsRecents: localProjects.filter(p => p.statut === 'Termine').length
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `Créé le ${day}/${month}/${year}`;
  };

  // Calculer la tendance pour les projets actifs
  const calculateTrend = () => {
    const lastMonth = localProjects.filter(p => {
      const projectDate = new Date(p.dateCreation);
      const now = new Date();
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return projectDate >= lastMonthDate && projectDate < new Date(now.getFullYear(), now.getMonth(), 1);
    }).length;

    const thisMonth = stats.rapportsCeMois;
    
    if (lastMonth === 0) return { value: 0, text: 'Données insuffisantes' };
    
    const percentChange = ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1);
    return {
      value: parseFloat(percentChange),
      text: `${percentChange}% vs mois dernier`
    };
  };

  const trend = calculateTrend();

  const handleChangeStatus = async (projectId: number, newStatus: string, projectName: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      // Appel API pour mettre à jour le statut
      await projectAPI.updateProject(projectId, { statut: newStatus });
      
      // Recharger les projets depuis le serveur pour avoir les données à jour
      await onProjectsChange();
      
      const statusLabels: any = {
        'En_cours': 'en cours',
        'Termine': 'terminé',
        'En_attente': 'brouillon',
        'Archive': 'archivé'
      };
      
      alert(`✓ Projet "${projectName}" marqué comme ${statusLabels[newStatus]}`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible de modifier le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchiveProject = async (projectId: number, projectName: string) => {
    if (isUpdating) return;
    
    if (!confirm(`Archiver le projet "${projectName}" ?`)) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      // Appel API pour archiver
      await projectAPI.updateProject(projectId, { statut: 'Archive' });
      
      // Recharger les projets depuis le serveur
      await onProjectsChange();
      
      alert(`✓ Projet "${projectName}" archivé avec succès`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible d\'archiver le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (isUpdating) return;
    
    if (!confirm(`⚠️ ATTENTION\n\nSupprimer définitivement "${projectName}" ?\n\nCette action est irréversible.`)) return;
    
    setIsUpdating(true);
    setOpenMenuId(null);

    try {
      // Appel API pour supprimer
      await projectAPI.deleteProject(projectId);
      
      // Recharger les projets depuis le serveur
      await onProjectsChange();
      
      alert(`✓ Projet "${projectName}" supprimé`);
    } catch (error: any) {
      alert(`❌ Erreur: ${error.message || 'Impossible de supprimer le projet'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <div className={`p-8 max-w-[1400px] mx-auto transition-all duration-300 ${isUpdating ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#1E293B]">Mes projets récents</h1>
          <button 
            onClick={onCreateProject} 
            className="bg-[#F97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#EA580C] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un nouveau projet
          </button>
        </div>

        {/* Projects Grid */}
        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentProjects.map((project) => {
              const status = getStatusDisplay(project.statut);
              return (
                <div 
                  key={project.idProjet} 
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    {/* Header with Menu */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                          {project.nom}
                        </h3>
                        <p className="text-sm text-[#64748B]">
                          {project.client || 'Sans client'}
                        </p>
                      </div>
                      
                      <div className="relative" ref={openMenuId === project.idProjet ? menuRef : null}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === project.idProjet ? null : project.idProjet);
                          }}
                          disabled={isUpdating}
                          className="p-1 hover:bg-[#F1F5F9] rounded transition-colors disabled:opacity-50"
                        >
                          <MoreVertical className="w-5 h-5 text-[#94A3B8]" />
                        </button>
                        
                        {openMenuId === project.idProjet && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-xl py-1 min-w-[180px] z-50">
                            {project.statut !== 'En_cours' && (
                              <button
                                onClick={() => handleChangeStatus(project.idProjet, 'En_cours', project.nom)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] flex items-center gap-2 text-[#475569]"
                              >
                                <Edit className="w-4 h-4" />
                                Marquer en cours
                              </button>
                            )}
                            {project.statut !== 'Termine' && (
                              <button
                                onClick={() => handleChangeStatus(project.idProjet, 'Termine', project.nom)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] flex items-center gap-2 text-[#475569]"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Marquer terminé
                              </button>
                            )}
                            {project.statut !== 'Archive' && (
                              <button
                                onClick={() => handleArchiveProject(project.idProjet, project.nom)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-[#F8FAFC] flex items-center gap-2 text-[#475569]"
                              >
                                <Archive className="w-4 h-4" />
                                Archiver
                              </button>
                            )}
                            <div className="border-t border-[#E2E8F0] my-1"></div>
                            <button
                              onClick={() => handleDeleteProject(project.idProjet, project.nom)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-[#64748B] mb-4">
                      {formatDate(project.dateCreation)}
                    </p>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onOpenProject(project.idProjet)}
                        className="flex-1 bg-[#1E40AF] text-white px-4 py-2 rounded-lg hover:bg-[#1E3A8A] transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ouvrir
                      </button>
                      <button 
                        className="px-4 py-2 border border-[#E2E8F0] text-[#475569] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center mb-8">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-[#64748B]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">Aucun projet</h3>
              <p className="text-[#64748B] mb-6">Commencez par créer votre premier projet</p>
              <button 
                onClick={onCreateProject} 
                className="bg-[#F97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#EA580C] transition-colors font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Créer mon premier projet
              </button>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1E293B] mb-6">Mes statistiques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Projets actifs */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">Projets actifs</h3>
                <div className="flex items-center gap-1 text-[#22C55E]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {trend.value >= 0 ? '+' : ''}{trend.value}%
                  </span>
                </div>
              </div>
              <p className="text-4xl font-bold text-[#0F172A] mb-2">
                {stats.projetsActifs}
              </p>
              <p className="text-xs text-[#22C55E] font-medium">
                {trend.text}
              </p>
            </div>

            {/* Projets créés ce mois */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">Projets créés ce mois</h3>
              </div>
              <p className="text-4xl font-bold text-[#0F172A] mb-2">
                {stats.rapportsCeMois > 0 ? `${stats.rapportsCeMois} ${stats.rapportsCeMois > 999 ? 'k' : ''}` : '0'}
              </p>
              <p className="text-xs text-[#64748B]">
                {stats.rapportsCeMois === 0 ? 'Aucun ce mois-ci' : ''}
              </p>
            </div>

            {/* Exports récents */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-[#64748B]">Exports récents</h3>
              </div>
              <p className="text-4xl font-bold text-[#0F172A] mb-2">
                {stats.exportsRecents}
              </p>
              <p className="text-xs text-[#64748B]">
                {stats.exportsRecents === 0 ? 'Aucun export' : `Projet${stats.exportsRecents > 1 ? 's' : ''} terminé${stats.exportsRecents > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay avec effet de flou */}
      {isUpdating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-6 shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E40AF]"></div>
              <p className="text-[#0F172A] font-medium">Mise à jour en cours...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}