import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// GET /api/projects - Récupérer tous les projets
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const [projects]: any = await pool.query(
      `SELECT 
        p.*,
        GROUP_CONCAT(t.nom) as tags
      FROM Projets p
      LEFT JOIN ProjetTag pt ON p.idProjet = pt.idProjet
      LEFT JOIN Tags t ON pt.idTag = t.idTag
      WHERE p.idAuteur = ? OR p.idProjet IN (
        SELECT idProjet FROM ProjetUtilisateurs WHERE idUtilisateur = ?
      )
      GROUP BY p.idProjet
      ORDER BY p.dateCreation DESC`,
      [userId, userId]
    );

    res.json(projects);
  } catch (error) {
    console.error('Erreur récupération projets:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/projects/:id - Récupérer un projet
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [projects]: any = await pool.query(
      'SELECT * FROM Projets WHERE idProjet = ?',
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Récupérer les plans associés
    const [plans]: any = await pool.query(
      'SELECT * FROM Plans WHERE idProjet = ?',
      [id]
    );

    res.json({
      ...projects[0],
      plans
    });
  } catch (error) {
    console.error('Erreur récupération projet:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/projects - Créer un projet
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nom, client, referenceInterne, typologie, adresse, dateLivraison, idAuteur } = req.body;

    const [result]: any = await pool.query(
      `INSERT INTO Projets (nom, client, statut, idAuteur, dateCreation) 
       VALUES (?, ?, 'En_attente', ?, NOW())`,
      [nom, client, idAuteur]
    );

    res.status(201).json({
      message: 'Projet créé avec succès',
      idProjet: result.insertId
    });
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({ message: 'Erreur lors de la création du projet' });
  }
});

// PUT /api/projects/:id - Mettre à jour un projet
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, client, statut } = req.body;

    await pool.query(
      'UPDATE Projets SET nom = ?, client = ?, statut = ? WHERE idProjet = ?',
      [nom, client, statut, id]
    );

    res.json({ message: 'Projet mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur mise à jour projet:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// DELETE /api/projects/:id - Supprimer un projet
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM Projets WHERE idProjet = ?', [id]);

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;