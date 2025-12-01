import { Router } from "express";
import {
  crearEnvio,
  actualizarEnvio,
  obtenerEnviosUsuario,
} from "../controllers/envioController.js";

import { authenticate } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/crearEnvio", crearEnvio);

router.put("/actualizarEnvio/:id", actualizarEnvio);

// Obtener envíos del usuario autenticado
router.get("/usuarioEnvios", authenticate, obtenerEnviosUsuario);

// Obtener envíos por usuarioId (pública o para admins)
router.get("/usuarioEnvios/:id", obtenerEnviosUsuario);

export default router;
