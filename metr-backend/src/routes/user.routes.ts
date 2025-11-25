// src/routes/user.routes.ts
import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

// ============================
// GET user
// ============================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [rows]: any = await pool.execute(
      "SELECT idUtilisateur, nom, prenom, email, telephone, role FROM Utilisateurs WHERE idUtilisateur = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Erreur récupération utilisateur :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ============================
// UPDATE user
// ============================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, telephone } = req.body;

    await pool.execute(
      "UPDATE Utilisateurs SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE idUtilisateur = ?",
      [nom, prenom, email, telephone, id]
    );

    return res.json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
