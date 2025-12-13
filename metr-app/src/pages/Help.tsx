import React, { useMemo, useState } from 'react';
import {
  Search,
  HelpCircle,
  BookOpen,
  FileText,
  MessageCircle,
  Mail,
  ChevronRight,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  /* ---------------------------------- */
  /* DATA                               */
  /* ---------------------------------- */

  const categories = [
    {
      id: 'start',
      title: 'Premiers pas',
      icon: HelpCircle,
      color: 'bg-blue-500',
      articles: [
        'Créer mon premier projet',
        'Importer des plans',
        'Inviter des collaborateurs',
        'Comprendre la structure d’un projet'
      ]
    },
    {
      id: 'projects',
      title: 'Gestion des projets',
      icon: FileText,
      color: 'bg-green-500',
      articles: [
        'Modifier un projet',
        'Archiver ou supprimer un projet',
        'Exporter les métrés',
        'Gestion des versions'
      ]
    },
    {
      id: 'library',
      title: 'Bibliothèques',
      icon: BookOpen,
      color: 'bg-purple-500',
      articles: [
        'Créer une bibliothèque',
        'Importer depuis Excel',
        'Partager une bibliothèque',
        'Structurer ses articles'
      ]
    },
    {
      id: 'account',
      title: 'Mon compte',
      icon: MessageCircle,
      color: 'bg-orange-500',
      articles: [
        'Modifier mes informations',
        'Changer mon mot de passe',
        'Gérer mes notifications',
        'Sécurité et confidentialité'
      ]
    }
  ];

  const articlesContent: Record<string, string> = {
    'Créer mon premier projet': `
Un projet représente une opération de métrage complète.

1. Cliquez sur "Nouveau projet"
2. Renseignez le nom, le type de bâtiment et la localisation
3. Importez vos premiers plans
4. Commencez vos métrés immédiatement

Un projet peut contenir plusieurs plans, bibliothèques et collaborateurs.
    `,
    'Importer des plans': `
Les plans peuvent être importés aux formats PDF ou DWG.

Chaque plan peut :
- Être redimensionné
- Être versionné
- Servir de base de métrage

Nous recommandons une échelle connue pour une précision optimale.
    `,
    'Exporter les métrés': `
Les données de métrage peuvent être exportées en :
- Excel
- PDF
- Tableaux récapitulatifs

Chaque export conserve :
- Les quantités
- Les unités
- Les prix unitaires
- Les totaux
    `,
    'Sécurité et confidentialité': `
Toutes les données sont hébergées sur des serveurs sécurisés.

Vos projets sont :
- Privés par défaut
- Accessibles uniquement aux collaborateurs invités
- Sauvegardés automatiquement
    `
  };

  const faq = [
    {
      question: 'Le métrage est-il précis au centimètre ?',
      answer:
        'Oui. Les outils de mesure utilisent l’échelle du plan pour garantir une précision professionnelle adaptée aux études de prix.'
    },
    {
      question: 'Puis-je travailler à plusieurs sur un projet ?',
      answer:
        'Absolument. Vous pouvez inviter des collaborateurs avec des rôles différents (lecture seule ou édition).'
    },
    {
      question: 'Puis-je utiliser mes propres bibliothèques ?',
      answer:
        'Oui, vous pouvez créer, importer et partager vos bibliothèques personnalisées.'
    },
    {
      question: 'Les données sont-elles sauvegardées automatiquement ?',
      answer:
        'Oui, toutes les actions sont sauvegardées en temps réel.'
    }
  ];

  /* ---------------------------------- */
  /* FILTERS                            */
  /* ---------------------------------- */

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  /* ---------------------------------- */
  /* HANDLERS                           */
  /* ---------------------------------- */

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@metr.fr?subject=Support Metr';
  };

  /* ---------------------------------- */
  /* RENDER                             */
  /* ---------------------------------- */

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">
          Centre d’aide & support
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Toute la documentation pour maîtriser votre métrage
        </p>

        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher une aide, une fonctionnalité, un mot-clé…"
            className="w-full pl-12 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>
      </div>

      {/* ARTICLE VIEW */}
      {selectedArticle ? (
        <div className="bg-white rounded-xl shadow-md p-10 mb-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-[#1e3a8a]"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h2 className="text-3xl font-bold mb-6">{selectedArticle}</h2>
          <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {articlesContent[selectedArticle] ??
              'Contenu détaillé en cours de rédaction.'}
          </pre>
        </div>
      ) : (
        <>
          {/* CATEGORIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {filteredCategories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl text-left"
                >
                  <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600">
                    {category.articles.length} articles
                  </p>
                </button>
              );
            })}
          </div>

          {/* ARTICLES LIST */}
          {selectedCategory && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">
                Articles
              </h2>
              <ul className="space-y-4">
                {categories
                  .find(c => c.id === selectedCategory)!
                  .articles.map(article => (
                    <li key={article}>
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="flex items-center justify-between w-full hover:text-[#1e3a8a]"
                      >
                        {article}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
              Questions fréquentes
            </h2>
            {faq.map((item, idx) => (
              <div key={idx} className="border-b py-4">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="flex justify-between w-full text-left"
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown
                    className={`transition-transform ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <p className="mt-3 text-gray-600">{item.answer}</p>
                )}
              </div>
            ))}
          </div>

          {/* SUPPORT */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-600 text-white rounded-xl p-8">
              <MessageCircle className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Support humain</h3>
              <p className="mb-6 opacity-90">
                Une question métier ? Notre équipe vous accompagne.
              </p>
            </div>

            <button
              onClick={handleEmailClick}
              className="bg-purple-600 text-white rounded-xl p-8 text-left hover:opacity-90"
            >
              <Mail className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Contact email</h3>
              <p className="opacity-90">support@metr.fr</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
