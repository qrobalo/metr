import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Articles de base à créer si la bibliothèque est vide
const DEFAULT_ARTICLES = [
  {
    libelle: 'Béton armé C25/30',
    description: 'Béton pour fondations et structures',
    unite: 'm^3',
    prix: 95.50,
    section: 'Gros oeuvre',
    sousCategorie: 'Fondation'
  },
  {
    libelle: 'Bloc béton creux 20x20x50',
    description: 'Parpaing standard pour murs porteurs',
    unite: 'sans_unite',
    prix: 1.20,
    section: 'Gros oeuvre',
    sousCategorie: 'Murs'
  },
  {
    libelle: 'Fenêtre PVC double vitrage 120x100',
    description: 'Fenêtre standard avec double vitrage',
    unite: 'sans_unite',
    prix: 450.00,
    section: 'Menuiseries',
    sousCategorie: 'Fenêtre'
  },
  {
    libelle: 'Porte d\'entrée blindée',
    description: 'Porte d\'entrée sécurisée 3 points',
    unite: 'sans_unite',
    prix: 890.00,
    section: 'Menuiseries',
    sousCategorie: 'Porte'
  },
  {
    libelle: 'Câble électrique 3G 2.5mm²',
    description: 'Câble pour prises électriques',
    unite: 'm',
    prix: 2.80,
    section: 'Électricité',
    sousCategorie: 'Câblage'
  },
  {
    libelle: 'Tableau électrique 3 rangées',
    description: 'Tableau pré-équipé 13 modules',
    unite: 'sans_unite',
    prix: 165.00,
    section: 'Électricité',
    sousCategorie: 'Tableau'
  },
  {
    libelle: 'Carrelage grès cérame 60x60',
    description: 'Carrelage intérieur effet béton',
    unite: 'm^2',
    prix: 28.50,
    section: 'Revêtements',
    sousCategorie: 'Sol'
  },
  {
    libelle: 'Peinture acrylique blanche mate',
    description: 'Peinture murs et plafonds - pot 10L',
    unite: 'sans_unite',
    prix: 45.00,
    section: 'Finitions',
    sousCategorie: 'Peinture'
  },
  {
    libelle: 'Tube PVC évacuation Ø100',
    description: 'Tube PVC pour évacuation eaux usées',
    unite: 'm',
    prix: 8.50,
    section: 'Plomberie',
    sousCategorie: 'Évacuation'
  },
  {
    libelle: 'Radiateur acier 1000W',
    description: 'Radiateur panneau simple',
    unite: 'sans_unite',
    prix: 125.00,
    section: 'Chauffage',
    sousCategorie: 'Radiateur'
  }
];

// GET /api/library/bibliotheques - Récupérer toutes les bibliothèques
router.get('/bibliotheques', async (req: Request, res: Response) => {
  try {
    const [bibliotheques]: any = await pool.query(
      `SELECT 
        b.*,
        COUNT(ab.idArticle) as articlesCount
      FROM Bibliotheques b
      LEFT JOIN ArticleBibliotheque ab ON b.idBibliotheque = ab.idBibliotheque
      GROUP BY b.idBibliotheque
      ORDER BY b.dateCreation DESC`
    );

    res.json(bibliotheques);
  } catch (error) {
    console.error('Erreur récupération bibliothèques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/library/articles - Récupérer tous les articles
router.get('/articles', async (req: Request, res: Response) => {
  try {
    const { bibliothequeId } = req.query;

    let query = `
      SELECT 
        a.*,
        ss.nom as sousCategorie,
        s.nom as section
      FROM Articles a
      LEFT JOIN ArticleSousSection ass ON a.idArticle = ass.idArticle
      LEFT JOIN SousSections ss ON ass.idSousSection = ss.idSousSection
      LEFT JOIN Sections s ON ss.idSection = s.idSection
    `;

    const params: any[] = [];

    if (bibliothequeId) {
      query += ` 
        INNER JOIN ArticleBibliotheque ab ON a.idArticle = ab.idArticle
        WHERE ab.idBibliotheque = ?
      `;
      params.push(bibliothequeId);
    }

    query += ' ORDER BY a.dateCreation DESC';

    const [articles]: any = await pool.query(query, params);

    // Si aucun article, créer les articles de base
    if (articles.length === 0) {
      console.log('📚 Création des articles de base...');
      await createDefaultArticles();
      
      // Recharger les articles
      const [newArticles]: any = await pool.query(query, params);
      return res.json(newArticles);
    }

    res.json(articles);
  } catch (error) {
    console.error('Erreur récupération articles:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Fonction pour créer les articles de base
async function createDefaultArticles() {
  try {
    for (const article of DEFAULT_ARTICLES) {
      await pool.query(
        `INSERT INTO Articles (libelle, description, unite, prix, dateCreation) 
         VALUES (?, ?, ?, ?, NOW())`,
        [article.libelle, article.description, article.unite, article.prix]
      );
    }
    console.log('✅ Articles de base créés');
  } catch (error) {
    console.error('❌ Erreur création articles de base:', error);
  }
}

// POST /api/library/articles - Créer un article
router.post('/articles', async (req: Request, res: Response) => {
  try {
    const { libelle, description, unite, prix, bibliothequeId, lot, sousCategorie } = req.body;

    if (!libelle || !unite || prix === undefined) {
      return res.status(400).json({ message: 'Libelle, unité et prix requis' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO Articles (libelle, description, unite, prix, dateCreation) 
       VALUES (?, ?, ?, ?, NOW())`,
      [libelle, description || '', unite, prix]
    );

    const articleId = result.insertId;

    // Associer à la bibliothèque si spécifié
    if (bibliothequeId) {
      await pool.query(
        'INSERT INTO ArticleBibliotheque (idArticle, idBibliotheque) VALUES (?, ?)',
        [articleId, bibliothequeId]
      );
    }

    console.log('✅ Article créé:', articleId);

    res.status(201).json({
      message: 'Article créé avec succès',
      idArticle: articleId
    });
  } catch (error) {
    console.error('Erreur création article:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
  }
});

// POST /api/library/bibliotheques - Créer une bibliothèque
router.post('/bibliotheques', async (req: Request, res: Response) => {
  try {
    const { nom, portee } = req.body;

    if (!nom) {
      return res.status(400).json({ message: 'Nom requis' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO Bibliotheques (nom, portee, dateCreation) 
       VALUES (?, ?, NOW())`,
      [nom, portee || 'Personnelle']
    );

    console.log('✅ Bibliothèque créée:', result.insertId);

    res.status(201).json({
      message: 'Bibliothèque créée avec succès',
      idBibliotheque: result.insertId
    });
  } catch (error) {
    console.error('Erreur création bibliothèque:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la bibliothèque' });
  }
});

// DELETE /api/library/bibliotheques/:id - Supprimer une bibliothèque
router.delete('/bibliotheques/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Supprimer les associations articles-bibliothèque
    await pool.query('DELETE FROM ArticleBibliotheque WHERE idBibliotheque = ?', [id]);

    // Supprimer la bibliothèque
    await pool.query('DELETE FROM Bibliotheques WHERE idBibliotheque = ?', [id]);

    console.log('✅ Bibliothèque supprimée:', id);

    res.json({ message: 'Bibliothèque supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression bibliothèque:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// DELETE /api/library/articles/:id - Supprimer un article
router.delete('/articles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Supprimer les associations
    await pool.query('DELETE FROM ArticleBibliotheque WHERE idArticle = ?', [id]);
    await pool.query('DELETE FROM ArticleSousSection WHERE idArticle = ?', [id]);

    // Supprimer l'article
    await pool.query('DELETE FROM Articles WHERE idArticle = ?', [id]);

    console.log('✅ Article supprimé:', id);

    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression article:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;