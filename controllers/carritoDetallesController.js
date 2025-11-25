import CarritoDetalle from "../models/carritoDetalle.js";
import Producto from "../models/producto.js";
import { recalcularTotal } from "../utils/carritoUtils.js";

export const crearDetalle = async (req, res) => {
  try {
    const { carritoId, productoId, cantidad } = req.body;

    if (!carritoId || !productoId || !cantidad) {
      return res
        .status(400)
        .json({ message: "carritoId y productoId son obligatorios" });
    }

    const qty = parseInt(cantidad ?? 1, 10);
    if (Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "cantidad inválida" });
    }

    const producto = await Producto.findByPk(productoId);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    const precioUnitario = Number(producto.precio);
    if (Number.isNaN(precioUnitario))
      return res.status(400).json({ message: "precio del producto inválido" });

    const subtotal = Number((precioUnitario * qty).toFixed(2));

    const detalle = await CarritoDetalle.create({
      carritoId,
      productoId,
      cantidad: qty,
      precioUnitario,
      subtotal,
    });

    await recalcularTotal(carritoId);

    return res.status(201).json(detalle);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al crear detalle de carrito",
        error: error.message || error,
      });
  }
};

export const obtenerDetalles = async (req, res) => {
  try {
    const detalles = await CarritoDetalle.findAll();
    return res.json(detalles);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al obtener detalles",
        error: error.message || error,
      });
  }
};

export const obtenerDetallesPorCarrito = async (req, res) => {
  try {
    const { carritoId } = req.params;

    const detalles = await CarritoDetalle.findAll({
      where: { carritoId },
    });

    if (!detalles || detalles.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay detalles para este carrito" });
    }

    return res.json(detalles);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener detalles",
      error: error.message || error,
    });
  }
};

export const actualizarDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    // FIX: usar findByPk con la PK correcta (CarritoDetalleId)
    const detalle = await CarritoDetalle.findByPk(id);
    if (!detalle)
      return res.status(404).json({ message: "Detalle no encontrado" });

    const newQty =
      req.body.cantidad !== undefined
        ? parseInt(req.body.cantidad, 10)
        : detalle.cantidad;
    if (Number.isNaN(newQty) || newQty < 1)
      return res.status(400).json({ message: "cantidad inválida" });

    const producto = await Producto.findByPk(detalle.productoId);
    const precioUnitario = producto
      ? Number(producto.precio)
      : Number(detalle.precioUnitario);
    if (Number.isNaN(precioUnitario))
      return res.status(400).json({ message: "precio del producto inválido" });

    const subtotal = Number((precioUnitario * newQty).toFixed(2));

    await detalle.update({
      cantidad: newQty,
      precioUnitario,
      subtotal,
    });

    await recalcularTotal(detalle.carritoId);

    return res.json(detalle);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al actualizar detalle",
        error: error.message || error,
      });
  }
};

export const eliminarDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    // FIX: usar findByPk directamente (id es la PK)
    const detalle = await CarritoDetalle.findByPk(id);
    if (!detalle)
      return res.status(404).json({ message: "Detalle no encontrado" });

    const carritoId = detalle.carritoId;
    await detalle.destroy();

    await recalcularTotal(carritoId);

    return res.json({ message: "Detalle eliminado" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al eliminar detalle",
        error: error.message || error,
      });
  }
};