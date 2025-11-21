import React, { useState } from 'react';
import { Plus, Search, Settings, Upload, Star, Check, ChevronDown } from 'lucide-react';

interface LibraryProps {
  onCreateArticle: () => void;
  onImportLibrary: () => void;
  onManageLibraries: () => void;
}

export default function Library({ onCreateArticle, onImportLibrary, onManageLibraries }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);

  const articles = [
    {
      id: 1,
      designation: 'Béton de fondation',
      lot: '2- GROS OEUVRE - MAÇONNERIE',
      category: 'Fondation',
      unit: 'M3',
      price: '120.50€',
      lastUpdate: '08/10/2025',
      isFavorite: true
    },
    {
      id: 2,
      designation: 'Fenêtre PVC double vitrage',
      lot: '10- MENUISERIES EXTERIEURES',
      category: 'Fenêtre',
      unit: 'U',
      price: '425.00 €',
      lastUpdate: '08/10/2025',
      isFavorite: false
    },
    {
      id: 3,
      designation: 'Porte intérieure',
      lot: '9- MENUISERIES INTERIEURES',
      category: 'Porte',
      unit: 'U',
      price: '235.00 €',
      lastUpdate: '08/10/2025',
      isFavorite: false
    },
    {
      id: 4,
      designation: 'Carrelage grès cérame',
      lot: '6- CARRELAGES, REVÊTEMENTS',
      category: 'Carrelage',
      unit: 'M2',
      price: '45.20 €',
      lastUpdate: '08/10/2025',
      isFavorite: false
    },
    {
      id: 5,
      designation: 'Radiateur électrique',
      lot: '11- ELECTRICITE COURANTS FORTS',
      category: 'Chauffage',
      unit: 'U',
      price: '199.90 €',
      lastUpdate: '08/10/2025',
      isFavorite: false
    },
    {
      id: 6,
      designation: 'Peinture mate blanche',
      lot: '8- PEINTURES',
      category: 'Peinture',
      unit: 'L',
      price: '28.75 €',
      lastUpdate: '08/10/2025',
      isFavorite: false
    }
  ];

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-primary-900">Ma bibliothèque</h2>
        <div className="flex items-center gap-3">
          <button onClick={onManageLibraries} className="btn-outline flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gérer les bibliothèques
          </button>
          <button onClick={onImportLibrary} className="btn-outline flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importer une bibliothèque
          </button>
          <button onClick={() => setShowCreateArticleModal(true)} className="btn-secondary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter un article
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Library Selector */}
          <select 
            value={selectedLibrary}
            onChange={(e) => setSelectedLibrary(e.target.value)}
            className="input-field w-64"
          >
            <option value="all">Toutes les bibliothèques</option>
            <option value="attic">ATTIC+</option>
            <option value="batimat">BatiMat 2023</option>
            <option value="default">Bibliothèque par défaut</option>
            <option value="favoris">Favoris</option>
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
              className="input-field pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <select className="input-field w-48">
            <option>Tous les lots</option>
            <option>Gros oeuvre</option>
            <option>Menuiseries</option>
          </select>

          <select className="input-field w-56">
            <option>Toutes les sous-catégories</option>
            <option>Fondation</option>
            <option>Fenêtre</option>
          </select>

          <select className="input-field w-48">
            <option>Toutes les unités</option>
            <option>M</option>
            <option>M²</option>
            <option>M³</option>
            <option>U</option>
          </select>

          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Check className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          <span className="font-semibold">{articles.length} articles trouvés</span>
        </p>
      </div>

      {/* Articles Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Désignation
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Lot
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Sous-catégorie
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Unité
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Prix unitaire
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Dernière mise à jour
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      <button className={`${article.isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}>
                        <Star className="w-5 h-5" fill={article.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{article.designation}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{article.lot}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{article.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{article.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{article.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{article.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Article Modal */}
      {showCreateArticleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Créer un article
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Renseignez les informations de l'article ci-dessous.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Désignation */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Désignation <span className="text-red-500">*</span>
                </label>
                <input type="text" placeholder="Nom de l'article" className="input-field" />
              </div>

              {/* Lot */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Lot <span className="text-red-500">*</span>
                </label>
                <select className="input-field">
                  <option value="">Lots</option>
                  <option>Gros oeuvre</option>
                  <option>Menuiseries</option>
                </select>
              </div>

              {/* Bibliothèque */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Bibliothèque <span className="text-red-500">*</span>
                </label>
                <select className="input-field">
                  <option value="">Bibliothèque</option>
                  <option>ATTIC+</option>
                  <option>BatiMat 2023</option>
                </select>
              </div>

              {/* Sous-catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Sous-catégorie <span className="text-red-500">*</span>
                </label>
                <select className="input-field">
                  <option value="">Sélectionner/créer</option>
                  <option>Fondation</option>
                  <option>Fenêtre</option>
                </select>
              </div>

              {/* Unité */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Unité <span className="text-red-500">*</span>
                </label>
                <select className="input-field">
                  <option value="">Unité</option>
                  <option>M</option>
                  <option>M²</option>
                  <option>M³</option>
                  <option>U</option>
                </select>
              </div>

              {/* Prix unitaire HT */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prix unitaire HT <span className="text-red-500">*</span>
                </label>
                <input type="number" placeholder="0" className="input-field" />
              </div>
            </div>

            {/* Description technique */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description technique
              </label>
              <textarea
                rows={4}
                placeholder="Description de l'article"
                className="input-field resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateArticleModal(false)}
                className="btn-outline"
              >
                Fermer
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}