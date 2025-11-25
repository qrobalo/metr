import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, FileText, MessageCircle, Mail, ChevronRight } from 'lucide-react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'start',
      title: 'Premiers pas',
      icon: HelpCircle,
      color: 'bg-blue-500',
      articles: [
        'Comment créer mon premier projet ?',
        'Comment ajouter des plans à un projet ?',
        'Comment inviter des collaborateurs ?',
        'Comment gérer mes bibliothèques ?'
      ]
    },
    {
      id: 'projects',
      title: 'Gestion des projets',
      icon: FileText,
      color: 'bg-green-500',
      articles: [
        'Comment modifier un projet existant ?',
        'Comment archiver un projet ?',
        'Comment exporter les données d\'un projet ?',
        'Comment gérer les versions de plans ?'
      ]
    },
    {
      id: 'library',
      title: 'Bibliothèques',
      icon: BookOpen,
      color: 'bg-purple-500',
      articles: [
        'Comment créer une bibliothèque ?',
        'Comment importer des articles depuis Excel ?',
        'Comment partager ma bibliothèque ?',
        'Comment organiser mes articles ?'
      ]
    },
    {
      id: 'account',
      title: 'Mon compte',
      icon: MessageCircle,
      color: 'bg-orange-500',
      articles: [
        'Comment modifier mes informations personnelles ?',
        'Comment changer mon mot de passe ?',
        'Comment gérer mes notifications ?',
        'Comment supprimer mon compte ?'
      ]
    }
  ];

  const faq = [
    {
      question: 'Comment puis-je mesurer sur un plan ?',
      answer: 'Utilisez l\'outil de mesure dans la visionneuse de plans. Cliquez sur deux points pour mesurer la distance.'
    },
    {
      question: 'Puis-je collaborer avec mon équipe ?',
      answer: 'Oui ! Vous pouvez inviter des collaborateurs sur vos projets avec différents niveaux d\'accès (Lecteur ou Éditeur).'
    },
    {
      question: 'Quels formats de fichiers sont supportés ?',
      answer: 'Pour les plans : DWG, PDF. Pour les documents : PDF, JPG, PNG, DOC, DOCX, XLS, XLSX.'
    },
    {
      question: 'Comment exporter mes données ?',
      answer: 'Vous pouvez exporter vos projets au format PDF ou Excel depuis la page du projet.'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Recherchez dans notre base de connaissances ou contactez notre support
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un article d'aide..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer group"
            >
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {category.articles.length} articles
              </p>
              <button className="text-[#1e3a8a] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Voir les articles
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          {faq.map((item, idx) => (
            <details key={idx} className="group border-b border-gray-200 pb-4">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium text-gray-900 group-hover:text-[#1e3a8a]">
                  {item.question}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-3 text-gray-600 pl-4">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-8 text-white">
          <MessageCircle className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Chat en direct</h3>
          <p className="mb-6 opacity-90">
            Discutez avec notre équipe support en temps réel
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Démarrer une conversation
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-8 text-white">
          <Mail className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Email support</h3>
          <p className="mb-6 opacity-90">
            Envoyez-nous un email, nous répondons sous 24h
          </p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium">
            support@metr.fr
          </button>
        </div>
      </div>
    </div>
  );
}