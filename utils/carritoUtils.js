import Carrito from "../models/carrito.js";
import CarritoDetalle from "../models/carritoDetalle.js";

export async function recalcularTotal(carritoId) {
  if (!carritoId) throw new Error("carritoId requerido");
  const detalles = await CarritoDetalle.findAll({ where: { carritoId } });
  const total = detalles.reduce((acc, d) => {
    const precio = parseFloat(d.precioUnitario) || 0;
    const cantidad = Number(d.cantidad) || 0;
    return acc + precio * cantidad;
  }, 0);
  const totalFixed = Number(total.toFixed(2));
  // FIX: cambiar 'id' a 'carritoId' (el nombre real de la columna PK)
  await Carrito.update({ total: totalFixed }, { where: { carritoId } });
  return await Carrito.findByPk(carritoId);
}