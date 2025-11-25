import express from "express";
import ordenController from "../controllers/ordenController.js";

const router = express.Router();

router.post("/CrearOrden", ordenController.crearOrden);
router.get("/ObtenerOrdenes", ordenController.obtenerOrdenes);
router.get("/ObtenerOrdenesPorUsuario/:usuarioId", ordenController.obtenerOrdenesPorUsuario);
router.put("/ActualizarOrden/:id", ordenController.actualizarEstado);
router.delete("/EliminarOrden/:id", ordenController.eliminarOrden);

export default router;
