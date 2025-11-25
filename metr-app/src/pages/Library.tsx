import React, { useState } from 'react';
import { Plus, Search, Settings, Upload, Star, Check, X, Trash2 } from 'lucide-react';

interface LibraryProps {
  articles: any[];
  onCreateArticle: () => void;
  onImportLibrary: () => void;
  onManageLibraries: () => void;
}

export default function Library({ articles, onCreateArticle, onImportLibrary, onManageLibraries }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'excel' | 'other'>('excel');
  
  const [newArticle, setNewArticle] = useState({
    libelle: '',
    lot: '',
    bibliotheque: '',
    sousCategorie: '',
    unite: '',
    prix: '',
    description: ''
  });

  const libraries = [
    { id: 'all', nom: 'Tous les articles', articles: 6, date: '23/10/2025' },
    { id: 'attic', nom: 'ATTIC+', articles: 1, date: '08/10/2025' },
    { id: 'batimat', nom: 'BatiMat 2023', articles: 1, date: '08/10/2025' },
    { id: 'default', nom: 'Bibliothèque par défaut', articles: 4, date: '08/10/2025' },
    { id: 'favoris', nom: 'Favoris', articles: 1, date: '08/10/2025' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.libelle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  

  const handleCreateArticle = () => {
    onCreateArticle();
    setShowCreateModal(false);
    setNewArticle({
      libelle: '',
      lot: '',
      bibliotheque: '',
      sousCategorie: '',
      unite: '',
      prix: '',
      description: ''
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a]">Ma bibliothèque</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowManageModal(true)}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Gérer les bibliothèques
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Importer une bibliothèque
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#f97316] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un article
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Library Selector */}
          <select 
            value={selectedLibrary}
            onChange={(e) => setSelectedLibrary(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-64"
          >
            {libraries.map(lib => (
              <option key={lib.id} value={lib.id}>{lib.nom}</option>
            ))}
          </select>

          <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          {/* Filters */}
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-48">
            <option>Tous les lots</option>
            <option>Gros oeuvre</option>
            <option>Menuiseries</option>
          </select>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-56">
            <option>Toutes les sous-catégories</option>
          </select>

          <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] w-48">
            <option>Toutes les unités</option>
          </select>

          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Check className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">{filteredArticles.length} articles trouvés</span>
        </p>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Désignation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lot</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sous-catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unité</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prix unitaire</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dernière mise à jour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        <button className="text-gray-300 hover:text-yellow-500">
                          <Star className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{article.libelle}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.section || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.sousCategorie || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.unite}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {article.prix ? `${article.prix}€` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(article.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Aucun article trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Créer un article</h3>
            <p className="text-sm text-gray-600 mb-6">Renseignez les informations de l'article ci-dessous.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Désignation <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Nom de l'article"
                  value={newArticle.libelle}
                  onChange={(e) => setNewArticle({...newArticle, libelle: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Lot <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newArticle.lot}
                  onChange={(e) => setNewArticle({...newArticle, lot: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="">Lots</option>
                  <option>Gros oeuvre</option>
                  <option>Menuiseries</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Bibliothèque <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newArticle.bibliotheque}
                  onChange={(e) => setNewArticle({...newArticle, bibliotheque: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="">Bibliothèque</option>
                  <option>ATTIC+</option>
                  <option>BatiMat 2023</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Sous-catégorie <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newArticle.sousCategorie}
                  onChange={(e) => setNewArticle({...newArticle, sousCategorie: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="">Sélectionner/créer</option>
                  <option>Fondation</option>
                  <option>Fenêtre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Unité <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newArticle.unite}
                  onChange={(e) => setNewArticle({...newArticle, unite: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="">Unité</option>
                  <option value="m">M</option>
                  <option value="m^2">M²</option>
                  <option value="m^3">M³</option>
                  <option value="sans_unite">U</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prix unitaire HT <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={newArticle.prix}
                  onChange={(e) => setNewArticle({...newArticle, prix: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Description technique</label>
              <textarea
                rows={4}
                placeholder="Description de l'article"
                value={newArticle.description}
                onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Fermer
              </button>
              <button 
                onClick={handleCreateArticle}
                className="bg-[#f97316] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Libraries Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Gérer les bibliothèques</h3>
            <p className="text-sm text-gray-600 mb-6">Vous pouvez supprimer les bibliothèques dont vous n'avez plus besoin.</p>

            <table className="w-full mb-6">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date de création</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Articles</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {libraries.filter(lib => lib.id !== 'all').map(lib => (
                  <tr key={lib.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{lib.nom}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lib.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lib.articles}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-[#f97316] hover:text-[#ea580c]">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowManageModal(false)}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Library Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Importer une bibliothèque</h3>
            <p className="text-sm text-gray-600 mb-6">
              Sélectionner un format d'import et entrez un nom pour votre bibliothèque
            </p>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setImportType('excel')}
                className={`flex-1 px-6 py-3 rounded-lg border-2 transition-colors ${
                  importType === 'excel' 
                    ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                Fichier Excel
              </button>
              <button 
                onClick={() => setImportType('other')}
                className={`flex-1 px-6 py-3 rounded-lg border-2 transition-colors ${
                  importType === 'other' 
                    ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                    : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                Autre format
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de la bibliothèque
              </label>
              <input 
                type="text" 
                placeholder="Ex: ATTIC+ 2025"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            {importType === 'excel' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">
                    Déposez votre fichier ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: .xlsx, .xls, .csv
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Cette option créera une bibliothèque vide que vous pourrez remplir manuellement.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowImportModal(false)}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  onImportLibrary();
                  setShowImportModal(false);
                }}
                className="bg-[#f97316] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}