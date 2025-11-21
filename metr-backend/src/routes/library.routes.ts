import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// GET /api/library/bibliotheques - Récupérer toutes les bibliothèques
router.get('/bibliotheques', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

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

    res.json(articles);
  } catch (error) {
    console.error('Erreur récupération articles:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/library/articles - Créer un article
router.post('/articles', async (req: Request, res: Response) => {
  try {
    const { libelle, description, unite, prix, bibliothequeId } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO Articles (libelle, description, unite, prix, dateCreation) 
       VALUES (?, ?, ?, ?, NOW())`,
      [libelle, description, unite, prix]
    );

    // Associer à la bibliothèque
    if (bibliothequeId) {
      await pool.query(
        'INSERT INTO ArticleBibliotheque (idArticle, idBibliotheque) VALUES (?, ?)',
        [result.insertId, bibliothequeId]
      );
    }

    res.status(201).json({
      message: 'Article créé avec succès',
      idArticle: result.insertId
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

    const [result]: any = await pool.query(
      `INSERT INTO Bibliotheques (nom, portee, dateCreation) 
       VALUES (?, ?, NOW())`,
      [nom, portee || 'Personnelle']
    );

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

    await pool.query('DELETE FROM Bibliotheques WHERE idBibliotheque = ?', [id]);

    res.json({ message: 'Bibliothèque supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression bibliothèque:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;