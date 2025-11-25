import OrdenDetalles from "../models/detallesOrden.js";
import Producto from "../models/producto.js";

export const crearDetalleOrden = async (req, res) => {
  try {
    const { ordenId, productoId, cantidad } = req.body;

    if (!ordenId || !productoId || !cantidad)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    if (cantidad < 1)
      return res.status(400).json({ message: "La cantidad debe ser mínimo 1" });

    const producto = await Producto.findByPk(productoId);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    const detalle = await OrdenDetalles.create({
      ordenId,
      productoId,
      cantidad,
      precioUnitario: producto.precio,
    });

    return res.status(201).json(detalle);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear detalle", error: error.message });
  }
};


export const obtenerDetallesOrden = async (req, res) => {
  try {
    const where = {};
    if (req.query.ordenId) where.ordenId = req.query.ordenId;

    const detalles = await OrdenDetalles.findAll({ where });
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo detalles", error: error.message });
  }
};


export const obtenerDetalleOrdenPorId = async (req, res) => {
  try {
    const detalle = await OrdenDetalles.findByPk(req.params.id);
    if (!detalle)
      return res.status(404).json({ message: "Detalle no encontrado" });

    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo detalle", error: error.message });
  }
};


export const actualizarDetalleOrden = async (req, res) => {
  try {
    const detalle = await OrdenDetalles.findByPk(req.params.id);
    if (!detalle)
      return res.status(404).json({ message: "Detalle no encontrado" });

    let { productoId, cantidad } = req.body;

    if (cantidad !== undefined && cantidad < 1)
      return res.status(400).json({ message: "Cantidad inválida" });

    productoId = productoId || detalle.productoId;
    cantidad = cantidad || detalle.cantidad;

    const producto = await Producto.findByPk(productoId);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    await detalle.update({
      productoId,
      cantidad,
      precioUnitario: producto.precio,
    });

    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando detalle", error: error.message });
  }
};


export const eliminarDetalleOrden = async (req, res) => {
  try {
    const detalle = await OrdenDetalles.findByPk(req.params.id);
    if (!detalle)
      return res.status(404).json({ message: "Detalle no encontrado" });

    await detalle.destroy();
    res.json({ message: "Detalle eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando detalle", error: error.message });
  }
};
