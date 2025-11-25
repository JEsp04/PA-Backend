import { Router } from "express";
import {
  crearDetalleOrden,
  obtenerDetallesOrden,
  obtenerDetalleOrdenPorId,
  actualizarDetalleOrden,
  eliminarDetalleOrden,
} from "../controllers/detalleOrdenController.js";

const router = Router();

router.post("/", crearDetalleOrden);
router.get("/", obtenerDetallesOrden);
router.get("/:id", obtenerDetalleOrdenPorId);
router.patch("/:id", actualizarDetalleOrden);
router.delete("/:id", eliminarDetalleOrden);

export default router;
