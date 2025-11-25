import express from "express";
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    ObtenerDetallesUsuario,
    actualizarUsuario,
    eliminarUsuario,
} from "../controllers/userController.js";


const router = express.Router();

router.get("/obtener", obtenerUsuarios);
router.get("/obtenerPor/:id", obtenerUsuarioPorId);
router.get("/detalles/:id", ObtenerDetallesUsuario);
router.patch("/actualizar/:id", actualizarUsuario);
router.delete("/eliminar/:id", eliminarUsuario);

export default router;