import { Router } from "express";
import {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  establecerDireccionDefault,
} from "../controllers/direccionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// Obtener todas las direcciones de un usuario (public)
router.get("/usuario/:usuarioId", obtenerDirecciones);

// Crear una nueva dirección (protegida)
router.post("/crear", authenticate, crearDireccion);

// Actualizar una dirección (protegida)
router.patch("/actualizar/:id", authenticate, actualizarDireccion);

// Eliminar una dirección (protegida)
router.delete("/eliminar/:id", authenticate, eliminarDireccion);

// Establecer dirección como por defecto (protegida)
router.post("/establecerDefault/:id", authenticate, establecerDireccionDefault);

export default router;
