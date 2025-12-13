import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// GET /api/projects - Récupérer tous les projets avec statistiques
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const [projects]: any = await pool.query(
      `SELECT 
        p.*,
        COUNT(DISTINCT pl.idPlan) as plansCount,
        GROUP_CONCAT(DISTINCT t.nom) as tags
      FROM Projets p
      LEFT JOIN Plans pl ON p.idProjet = pl.idProjet
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

// GET /api/projects/:id - Récupérer un projet avec tous ses détails
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Récupérer le projet
    const [projects]: any = await pool.query(
      'SELECT * FROM Projets WHERE idProjet = ?',
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Récupérer les plans avec leurs versions
    const [plans]: any = await pool.query(
      `SELECT 
        p.idPlan,
        p.nom as titre,
        COALESCE(MAX(pv.dateVersion), NOW()) as date,
        f.nom as fichierNom
      FROM Plans p
      LEFT JOIN PlanVersions pv ON p.idPlan = pv.idPlan
      LEFT JOIN Fichiers f ON p.idPlan = f.idPlan
      WHERE p.idProjet = ?
      GROUP BY p.idPlan
      ORDER BY date DESC`,
      [id]
    );

    // Récupérer les documents (fichiers sans plan associé)
    const [fichiers]: any = await pool.query(
      `SELECT 
        idFichier,
        nom as titre,
        dateUpload as date,
        type,
        taille
      FROM Fichiers 
      WHERE idPlan IS NULL
      ORDER BY dateUpload DESC`
    );

    res.json({
      ...projects[0],
      plans: plans || [],
      documents: fichiers || []
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

    if (!nom || !idAuteur) {
      return res.status(400).json({ message: 'Nom et auteur requis' });
    }

    const [result]: any = await pool.query(
      `INSERT INTO Projets (nom, client, statut, idAuteur, dateCreation, dateDerniereModification) 
       VALUES (?, ?, 'En_attente', ?, NOW(), NOW())`,
      [nom, client || null, idAuteur]
    );

    console.log('✅ Projet créé avec ID:', result.insertId);

    res.status(201).json({
      message: 'Projet créé avec succès',
      idProjet: result.insertId
    });
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({ message: 'Erreur lors de la création du projet' });
  }
});

// POST /api/projects/:id/plans - Ajouter un plan
router.post('/:id/plans', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, niveau, zone } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO Plans (nom, niveau, zone, idProjet) VALUES (?, ?, ?, ?)',
      [nom, niveau || '', zone || '', id]
    );

    // Créer une version initiale
    await pool.query(
      'INSERT INTO PlanVersions (numeroVersion, dateVersion, idPlan) VALUES (1, NOW(), ?)',
      [result.insertId]
    );

    // Mettre à jour la date de modification du projet
    await pool.query(
      'UPDATE Projets SET dateDerniereModification = NOW() WHERE idProjet = ?',
      [id]
    );

    res.status(201).json({
      message: 'Plan ajouté avec succès',
      idPlan: result.insertId
    });
  } catch (error) {
    console.error('Erreur ajout plan:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du plan' });
  }
});

// DELETE /api/projects/:id/plans/:planId - Supprimer un plan
router.delete('/:id/plans/:planId', async (req: Request, res: Response) => {
  try {
    const { id, planId } = req.params;

    // Supprimer les versions et fichiers associés
    await pool.query('DELETE FROM PlanVersions WHERE idPlan = ?', [planId]);
    await pool.query('DELETE FROM Fichiers WHERE idPlan = ?', [planId]);
    await pool.query('DELETE FROM Plans WHERE idPlan = ?', [planId]);

    // Mettre à jour la date de modification du projet
    await pool.query(
      'UPDATE Projets SET dateDerniereModification = NOW() WHERE idProjet = ?',
      [id]
    );

    res.json({ message: 'Plan supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression plan:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// POST /api/projects/:id/documents - Ajouter un document
router.post('/:id/documents', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, type, taille } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO Fichiers (nom, type, taille, dateUpload) VALUES (?, ?, ?, NOW())',
      [nom, type, taille]
    );

    // Mettre à jour la date de modification du projet
    await pool.query(
      'UPDATE Projets SET dateDerniereModification = NOW() WHERE idProjet = ?',
      [id]
    );

    res.status(201).json({
      message: 'Document ajouté avec succès',
      idFichier: result.insertId
    });
  } catch (error) {
    console.error('Erreur ajout document:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du document' });
  }
});

// DELETE /api/projects/:id/documents/:docId - Supprimer un document
router.delete('/:id/documents/:docId', async (req: Request, res: Response) => {
  try {
    const { id, docId } = req.params;

    await pool.query('DELETE FROM Fichiers WHERE idFichier = ?', [docId]);

    // Mettre à jour la date de modification du projet
    await pool.query(
      'UPDATE Projets SET dateDerniereModification = NOW() WHERE idProjet = ?',
      [id]
    );

    res.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression document:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// PUT /api/projects/:id - Mettre à jour un projet
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, client, statut } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (nom !== undefined) {
      updates.push('nom = ?');
      values.push(nom);
    }
    if (client !== undefined) {
      updates.push('client = ?');
      values.push(client);
    }
    if (statut !== undefined) {
      updates.push('statut = ?');
      values.push(statut);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }

    updates.push('dateDerniereModification = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE Projets SET ${updates.join(', ')} WHERE idProjet = ?`,
      values
    );

    console.log('✅ Projet mis à jour:', id);

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

    // Récupérer tous les plans du projet
    const [plans]: any = await pool.query('SELECT idPlan FROM Plans WHERE idProjet = ?', [id]);

    // Supprimer les versions et fichiers de chaque plan
    for (const plan of plans) {
      await pool.query('DELETE FROM PlanVersions WHERE idPlan = ?', [plan.idPlan]);
      await pool.query('DELETE FROM Fichiers WHERE idPlan = ?', [plan.idPlan]);
    }

    // Supprimer les plans
    await pool.query('DELETE FROM Plans WHERE idProjet = ?', [id]);

    // Supprimer les tags du projet
    await pool.query('DELETE FROM ProjetTag WHERE idProjet = ?', [id]);

    // Supprimer les utilisateurs du projet
    await pool.query('DELETE FROM ProjetUtilisateurs WHERE idProjet = ?', [id]);

    // Supprimer le projet
    await pool.query('DELETE FROM Projets WHERE idProjet = ?', [id]);

    console.log('✅ Projet supprimé:', id);

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;