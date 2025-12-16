import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, FileText, MessageCircle, Mail, ChevronRight, ChevronDown, PlayCircle, Phone, ExternalLink, Clock, CheckCircle } from 'lucide-react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const categories = [
    {
      id: 'start',
      title: 'Premiers pas',
      icon: HelpCircle,
      color: 'from-blue-500 to-blue-600',
      articles: [
        { title: 'Comment créer mon premier projet ?', time: '2 min' },
        { title: 'Comment ajouter des plans à un projet ?', time: '3 min' },
        { title: 'Comment inviter des collaborateurs ?', time: '4 min' },
        { title: 'Comment gérer mes bibliothèques ?', time: '5 min' },
        { title: 'Configurer mon profil utilisateur', time: '2 min' }
      ]
    },
    {
      id: 'projects',
      title: 'Gestion des projets',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      articles: [
        { title: 'Comment modifier un projet existant ?', time: '3 min' },
        { title: 'Comment archiver un projet ?', time: '2 min' },
        { title: 'Comment exporter les données d\'un projet ?', time: '4 min' },
        { title: 'Comment gérer les versions de plans ?', time: '5 min' },
        { title: 'Organiser mes projets par statut', time: '3 min' },
        { title: 'Filtrer et rechercher dans mes projets', time: '2 min' }
      ]
    },
    {
      id: 'library',
      title: 'Bibliothèques',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      articles: [
        { title: 'Comment créer une bibliothèque ?', time: '3 min' },
        { title: 'Comment importer des articles depuis Excel ?', time: '5 min' },
        { title: 'Comment partager ma bibliothèque ?', time: '4 min' },
        { title: 'Comment organiser mes articles ?', time: '3 min' },
        { title: 'Exporter une bibliothèque', time: '3 min' }
      ]
    },
    {
      id: 'account',
      title: 'Mon compte',
      icon: MessageCircle,
      color: 'from-orange-500 to-orange-600',
      articles: [
        { title: 'Comment modifier mes informations personnelles ?', time: '2 min' },
        { title: 'Comment changer mon mot de passe ?', time: '2 min' },
        { title: 'Comment gérer mes notifications ?', time: '3 min' },
        { title: 'Configurer l\'authentification à deux facteurs', time: '4 min' },
        { title: 'Comment supprimer mon compte ?', time: '2 min' }
      ]
    }
  ];

  const faq = [
    {
      question: 'Comment puis-je mesurer sur un plan ?',
      answer: 'Utilisez l\'outil de mesure dans la visionneuse de plans. Cliquez sur deux points pour mesurer la distance. Vous pouvez également mesurer des surfaces en sélectionnant plusieurs points.',
      category: 'Mesures'
    },
    {
      question: 'Puis-je collaborer avec mon équipe ?',
      answer: 'Oui ! Avec un compte Pro, vous pouvez inviter jusqu\'à 10 collaborateurs sur vos projets avec différents niveaux d\'accès (Lecteur, Éditeur ou Administrateur). Les modifications sont synchronisées en temps réel.',
      category: 'Collaboration'
    },
    {
      question: 'Quels formats de fichiers sont supportés ?',
      answer: 'Pour les plans : DWG, PDF, DXF. Pour les documents : PDF, JPG, PNG, DOC, DOCX, XLS, XLSX. Taille maximale : 50 MB par fichier.',
      category: 'Fichiers'
    },
    {
      question: 'Comment exporter mes données ?',
      answer: 'Vous pouvez exporter vos projets au format PDF ou Excel depuis la page du projet. Pour une exportation complète, rendez-vous dans Paramètres > Données et cliquez sur "Exporter mes données".',
      category: 'Export'
    },
    {
      question: 'Comment modifier le statut d\'un projet ?',
      answer: 'Cliquez sur les 3 points à côté d\'un projet, puis sélectionnez "Marquer en cours", "Marquer terminé" ou "Archiver". Le statut sera mis à jour instantanément.',
      category: 'Projets'
    },
    {
      question: 'Est-ce que mes données sont sauvegardées ?',
      answer: 'Oui, toutes vos données sont automatiquement sauvegardées en temps réel sur nos serveurs sécurisés. Nous effectuons également des sauvegardes quotidiennes complètes.',
      category: 'Sécurité'
    },
    {
      question: 'Puis-je annuler mon abonnement ?',
      answer: 'Oui, vous pouvez annuler votre abonnement à tout moment depuis les paramètres. Vous conserverez l\'accès jusqu\'à la fin de votre période de facturation.',
      category: 'Abonnement'
    },
    {
      question: 'Comment importer une bibliothèque Excel ?',
      answer: 'Allez dans Bibliothèques > Importer > Choisissez votre fichier Excel. Assurez-vous que votre fichier contient les colonnes : Libellé, Unité, Prix HT.',
      category: 'Bibliothèques'
    }
  ];

  const videoTutorials = [
    { title: 'Créer votre premier projet', duration: '3:45', thumbnail: 'blue' },
    { title: 'Ajouter et gérer des plans', duration: '5:20', thumbnail: 'green' },
    { title: 'Travailler avec les bibliothèques', duration: '4:30', thumbnail: 'purple' },
    { title: 'Collaborer en équipe', duration: '6:15', thumbnail: 'orange' }
  ];

  const quickLinks = [
    { title: 'Guide de démarrage rapide', icon: PlayCircle, color: 'text-blue-600' },
    { title: 'Raccourcis clavier', icon: FileText, color: 'text-green-600' },
    { title: 'Meilleures pratiques', icon: CheckCircle, color: 'text-purple-600' },
    { title: 'Nouveautés', icon: ExternalLink, color: 'text-orange-600' }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category.id);
    const articlesList = category.articles.map((a: any) => `• ${a.title} (${a.time})`).join('\n');
    alert(`📚 Articles de "${category.title}" :\n\n${articlesList}\n\n💡 Ces articles seront bientôt disponibles avec des tutoriels détaillés !`);
  };

  const handleChatClick = () => {
    alert('💬 Chat en direct\n\nNotre équipe support est disponible :\n• Lundi - Vendredi : 9h - 18h\n• Temps de réponse moyen : < 2 minutes\n\n✨ Fonctionnalité bientôt disponible !');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:support@metr.fr?subject=Demande de support&body=Bonjour,%0D%0A%0D%0AJe souhaite obtenir de l\'aide concernant :%0D%0A%0D%0A[Décrivez votre problème ici]';
  };

  const handlePhoneClick = () => {
    alert('📞 Support téléphonique\n\n+33 1 23 45 67 89\n\nDisponible du lundi au vendredi\nde 9h à 18h (heure de Paris)\n\n💡 Pour un support plus rapide, utilisez le chat en direct !');
  };

  const handleVideoClick = (video: any) => {
    alert(`🎥 Lecture de la vidéo\n\n"${video.title}"\nDurée : ${video.duration}\n\n📺 Les tutoriels vidéo seront bientôt disponibles !`);
  };

  const handleQuickLinkClick = (link: any) => {
    alert(`📖 ${link.title}\n\nCette ressource sera bientôt disponible avec du contenu détaillé et des exemples pratiques !`);
  };

  const displayedFaqs = showAllFaqs ? faq : faq.slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Recherchez dans notre base de connaissances ou contactez notre équipe support
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ex: Comment créer un projet, exporter des données..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-lg shadow-sm"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {quickLinks.map((link, idx) => {
          const Icon = link.icon;
          return (
            <button
              key={idx}
              onClick={() => handleQuickLinkClick(link)}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all group text-center"
            >
              <Icon className={`w-8 h-8 ${link.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <p className="text-sm font-medium text-gray-900">{link.title}</p>
            </button>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-[#1e3a8a]" />
          Parcourir par catégorie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-all cursor-pointer group text-left"
              >
                <div className={`bg-gradient-to-br ${category.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.articles.length} articles disponibles
                </p>
                <div className="text-[#1e3a8a] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir les articles
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <PlayCircle className="w-7 h-7 text-[#1e3a8a]" />
          Tutoriels vidéo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoTutorials.map((video, idx) => (
            <button
              key={idx}
              onClick={() => handleVideoClick(video)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all group"
            >
              <div className={`h-40 bg-gradient-to-br ${
                video.thumbnail === 'blue' ? 'from-blue-400 to-blue-600' :
                video.thumbnail === 'green' ? 'from-green-400 to-green-600' :
                video.thumbnail === 'purple' ? 'from-purple-400 to-purple-600' :
                'from-orange-400 to-orange-600'
              } flex items-center justify-center relative`}>
                <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                  {video.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6 flex items-center gap-2">
          <HelpCircle className="w-7 h-7" />
          Questions fréquentes
        </h2>
        <div className="space-y-3">
          {displayedFaqs.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1e3a8a] transition-colors">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 cursor-pointer text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900 block mb-1">
                    {item.question}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                    openFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 text-gray-600 bg-gray-50 border-t border-gray-200">
                  <p className="pt-3">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAllFaqs && faq.length > 5 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllFaqs(true)}
              className="text-[#1e3a8a] font-medium hover:underline flex items-center gap-2 mx-auto"
            >
              Voir toutes les questions ({faq.length})
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-[#1e3a8a]" />
          Besoin d'aide supplémentaire ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Live Chat */}
          <button
            onClick={handleChatClick}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <MessageCircle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-2xl font-bold mb-2 relative z-10">Chat en direct</h3>
            <p className="mb-4 opacity-90 relative z-10">
              Réponse en moins de 2 minutes
            </p>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-4 relative z-10">
              <Clock className="w-4 h-4" />
              Lun-Ven : 9h-18h
            </div>
            <div className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium inline-flex items-center gap-2 relative z-10">
              Démarrer une conversation
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Email Support */}
          <button
            onClick={handleEmailClick}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <Mail className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-2xl font-bold mb-2 relative z-10">Email support</h3>
            <p className="mb-4 opacity-90 relative z-10">
              Réponse sous 24h maximum
            </p>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-4 relative z-10">
              <Clock className="w-4 h-4" />
              7j/7, 24h/24
            </div>
            <div className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center gap-2 relative z-10">
              support@metr.fr
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Phone Support */}
          <button
            onClick={handlePhoneClick}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <Phone className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform relative z-10" />
            <h3 className="text-2xl font-bold mb-2 relative z-10">Téléphone</h3>
            <p className="mb-4 opacity-90 relative z-10">
              Support immédiat par téléphone
            </p>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-4 relative z-10">
              <Clock className="w-4 h-4" />
              Lun-Ven : 9h-18h
            </div>
            <div className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium inline-flex items-center gap-2 relative z-10">
              +33 1 23 45 67 89
              <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="font-semibold text-green-900">Tous les systèmes opérationnels</p>
            <p className="text-sm text-green-700">Dernière mise à jour : il y a 2 minutes</p>
          </div>
          <a href="#" className="ml-auto text-green-700 hover:text-green-900 font-medium text-sm flex items-center gap-1">
            Voir l'état du système
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}