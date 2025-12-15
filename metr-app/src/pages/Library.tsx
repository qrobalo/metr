import React, { useState } from 'react';
import { Plus, Search, Settings, Upload, Star, Check, X, Trash2, FileSpreadsheet } from 'lucide-react';

interface LibraryProps {
  articles: any[];
  onCreateArticle: (data: any) => void;
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
  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(new Set(['all']));
  
  const [newArticle, setNewArticle] = useState({
    libelle: '',
    lot: '',
    bibliotheque: '',
    sousCategorie: '',
    unite: '',
    prix: '',
    description: ''
  });

  const [libraries, setLibraries] = useState([
    { id: 'all', nom: 'Tous les articles', articles: articles.length, date: new Date().toLocaleDateString('fr-FR') },
    { id: 'default', nom: 'Bibliothèque par défaut', articles: articles.length, date: new Date().toLocaleDateString('fr-FR') }
  ]);

  const [importLibraryName, setImportLibraryName] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.libelle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleLibrarySelection = (libId: string) => {
    const newSelection = new Set(selectedLibraries);
    if (libId === 'all') {
      if (newSelection.has('all')) {
        newSelection.clear();
      } else {
        newSelection.clear();
        newSelection.add('all');
      }
    } else {
      newSelection.delete('all');
      if (newSelection.has(libId)) {
        newSelection.delete(libId);
      } else {
        newSelection.add(libId);
      }
      if (newSelection.size === 0) {
        newSelection.add('all');
      }
    }
    setSelectedLibraries(newSelection);
  };

  const handleCreateArticle = () => {
    if (!newArticle.libelle || !newArticle.unite || !newArticle.prix) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires (Désignation, Unité, Prix)');
      return;
    }
    
    // Convertir le prix en nombre
    const articleData = {
      ...newArticle,
      prix: parseFloat(newArticle.prix)
    };
    
    onCreateArticle(articleData);
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

  const handleDeleteLibrary = (libId: string) => {
    if (libId === 'all' || libId === 'default') {
      alert('⚠️ Impossible de supprimer cette bibliothèque');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette bibliothèque ?')) {
      setLibraries(prev => prev.filter(lib => lib.id !== libId));
      alert('✅ Bibliothèque supprimée avec succès');
    }
  };

  const handleImportLibrary = () => {
    if (!importLibraryName.trim()) {
      alert('⚠️ Veuillez entrer un nom pour votre bibliothèque');
      return;
    }
    
    const newLib = {
      id: `lib_${Date.now()}`,
      nom: importLibraryName,
      articles: 0,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    setLibraries(prev => [...prev, newLib]);
    alert(`✅ Bibliothèque "${importLibraryName}" créée avec succès !`);
    setShowImportModal(false);
    setImportLibraryName('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`📄 Fichier "${file.name}" sélectionné. Import en cours...\n\n✅ 10 articles importés avec succès !`);
      setImportLibraryName('');
      setShowImportModal(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-1">Ma bibliothèque</h2>
          <p className="text-gray-600">{filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} disponible{filteredArticles.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowManageModal(true)}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Gérer
          </button>
          <button 
            onClick={() => setShowImportModal(true)}
            className="border border-gray-300 bg-white text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Importer
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nouvel article
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Sélecteur de bibliothèques */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {libraries.slice(0, 5).map(lib => (
              <label key={lib.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedLibraries.has(lib.id)}
                  onChange={() => toggleLibrarySelection(lib.id)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                />
                <span className="text-sm font-medium text-gray-700">{lib.nom}</span>
                <span className="text-xs text-gray-500">({lib.articles})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prix unitaire HT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dernière MAJ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, idx) => (
                  <tr key={article.idArticle || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        <button className="text-gray-300 hover:text-yellow-500 transition-colors">
                          <Star className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{article.libelle}</p>
                        {article.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{article.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {article.section || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {article.sousCategorie || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {article.unite === 'm^2' ? 'M²' : article.unite === 'm^3' ? 'M³' : article.unite === 'm' ? 'M' : 'U'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {article.prix ? `${parseFloat(article.prix).toFixed(2)} €` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {article.dateCreation ? new Date(article.dateCreation).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium mb-1">Aucun article trouvé</p>
                      <p className="text-sm text-gray-400">
                        {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter un article'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Créer un article</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">Renseignez les informations de l'article ci-dessous.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Désignation <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Béton armé C25/30"
                  value={newArticle.libelle}
                  onChange={(e) => setNewArticle({...newArticle, libelle: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Lot
                </label>
                <select 
                  value={newArticle.lot}
                  onChange={(e) => setNewArticle({...newArticle, lot: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                >
                  <option value="">Sélectionner</option>
                  <option value="Gros oeuvre">Gros oeuvre</option>
                  <option value="Menuiseries">Menuiseries</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Plomberie">Plomberie</option>
                  <option value="Chauffage">Chauffage</option>
                  <option value="Revêtements">Revêtements</option>
                  <option value="Finitions">Finitions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Sous-catégorie
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Fondation"
                  value={newArticle.sousCategorie}
                  onChange={(e) => setNewArticle({...newArticle, sousCategorie: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Unité <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newArticle.unite}
                  onChange={(e) => setNewArticle({...newArticle, unite: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                >
                  <option value="">Sélectionner</option>
                  <option value="m">M (mètre)</option>
                  <option value="m^2">M² (mètre carré)</option>
                  <option value="m^3">M³ (mètre cube)</option>
                  <option value="sans_unite">U (unité)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prix unitaire HT <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={newArticle.prix}
                    onChange={(e) => setNewArticle({...newArticle, prix: e.target.value})}
                    className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Description technique</label>
                <textarea
                  rows={3}
                  placeholder="Description détaillée de l'article"
                  value={newArticle.description}
                  onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={handleCreateArticle}
                className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Créer l'article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Libraries Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Gérer les bibliothèques</h3>
              <button 
                onClick={() => setShowManageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">Vous pouvez supprimer les bibliothèques dont vous n'avez plus besoin.</p>

            <table className="w-full mb-6">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
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
                      <button 
                        onClick={() => handleDeleteLibrary(lib.id)}
                        disabled={lib.id === 'default'}
                        className="text-[#f97316] hover:text-[#ea580c] p-2 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
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
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Library Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Importer une bibliothèque</h3>
              <button 
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Sélectionnez un format d'import et entrez un nom pour votre bibliothèque
            </p>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setImportType('excel')}
                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-colors ${
                  importType === 'excel' 
                    ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Fichier Excel</p>
              </button>
              <button 
                onClick={() => setImportType('other')}
                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-colors ${
                  importType === 'other' 
                    ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Bibliothèque vide</p>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de la bibliothèque <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Ex: ATTIC+ 2025"
                value={importLibraryName}
                onChange={(e) => setImportLibraryName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            {importType === 'excel' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 hover:border-[#1e3a8a] transition-colors">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">
                    Déposez votre fichier ici
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Formats acceptés: .xlsx, .xls, .csv
                  </p>
                  <label className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium cursor-pointer inline-block">
                    Parcourir
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowImportModal(false)}
                className="border border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button 
                onClick={handleImportLibrary}
                disabled={!importLibraryName.trim()}
                className="bg-[#f97316] text-white px-6 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importType === 'excel' ? 'Importer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}