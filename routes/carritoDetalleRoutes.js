import {Router} from 'express';

import {
  crearDetalle,
  obtenerDetalles,
  obtenerDetallesPorCarrito,
  actualizarDetalle,
  eliminarDetalle,
} from '../controllers/carritoDetallesController.js';

const router = Router();

router.post('/crear', crearDetalle);
router.get('/obtener', obtenerDetalles);
router.get('/obtenerPor/:id', obtenerDetallesPorCarrito); 
router.patch('/actualizar/:id', actualizarDetalle);
router.delete('/eliminar/:id', eliminarDetalle);

export default router;