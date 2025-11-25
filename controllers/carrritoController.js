import Carrito from "../models/carrito.js";
import CarritoDetalle from "../models/carritoDetalle.js";
import { recalcularTotal as recalcularTotalUtil } from "../utils/carritoUtils.js";
import Producto from "../models/producto.js";

export const crearCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    if (!usuarioId) {
      return res.status(400).json({ message: "usuarioId es obligatorio" });
    }

    const carritoExistente = await Carrito.findOne({ where: { usuarioId } });

    if (carritoExistente) {
      return res.status(200).json(carritoExistente);
    }

    const carrito = await Carrito.create({
      usuarioId,
      total: 0.0,
    });

    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear carrito y detalles carrito",
      error: error.message,
    });
  }
};

export const obtenerCarrito = async (req, res) => {
  try {
    const carritos = await Carrito.findAll();
    res.json(carritos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener carritos", error: error.message });
  }
};

export const obtenerCarritoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const carrito = await Carrito.findOne({
      where: { carritoId: id },
      include: [
        {
          model: CarritoDetalle,
          as: "CarritoDetalles",
          include: [{ model: Producto, as: "Product" }],
        },
      ],
    });

    if (!carrito)
      return res.status(404).json({ message: "Carrito no encontrado" });

    res.json(carrito);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener carrito", error: error.message });
  }
};

export const obtenerCarritoPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const carrito = await Carrito.findOne({
      where: { usuarioId },
      include: [
        {
          model: CarritoDetalle,
          as: "CarritoDetalles",
          include: [{ model: Producto, as: "Product" }],
        },
      ],
    });

    if (!carrito) {
      const nuevo = await Carrito.create({
        usuarioId,
        total: 0.0,
      });
      return res.status(201).json(nuevo);
    }

    res.json(carrito);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener carrito del usuario",
      error: error.message,
    });
  }
};

export const eliminarCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Carrito.destroy({ where: { carritoId: id } });

    if (!deleted)
      return res.status(404).json({ message: "Carrito no encontrado" });

    res.json({ message: "Carrito eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar carrito", error: error.message });
  }
};

export const recalcularTotal = recalcularTotalUtil;

export const sincronizarCarrito = async (req, res) => {
  try {
    const { usuarioId, items } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ message: "usuarioId es obligatorio" });
    }

    let carrito = await Carrito.findOne({ where: { usuarioId } });

    if (!carrito) {
      carrito = await Carrito.create({ usuarioId, total: 0 });
    }

    const carritoId = carrito.carritoId;

    const detallesActuales = await CarritoDetalle.findAll({
      where: { carritoId },
    });

    const mapaActual = new Map(detallesActuales.map((d) => [d.productoId, d]));

    const productosEnviadosIds = items.map((i) => i.productoId);

    for (const item of items) {
      const { productoId, cantidad } = item;

      const producto = await Producto.findByPk(productoId);
      if (!producto) continue;

      const precioUnitario = Number(producto.precio);
      const subtotal = Number((precioUnitario * cantidad).toFixed(2));

      const existente = mapaActual.get(productoId);

      if (existente) {
        await existente.update({
          cantidad,
          precioUnitario,
          subtotal,
        });
      } else {
        await CarritoDetalle.create({
          carritoId,
          productoId,
          cantidad,
          precioUnitario,
          subtotal,
        });
      }
    }

    for (const detalle of detallesActuales) {
      if (!productosEnviadosIds.includes(detalle.productoId)) {
        await detalle.destroy();
      }
    }

    await recalcularTotalUtil(carritoId);

    const carritoActualizado = await Carrito.findOne({
      where: { carritoId },
      include: [
        {
          model: CarritoDetalle,
          as: "CarritoDetalles",
          include: [{ model: Producto, as: "Product" }],
        },
      ],
    });

    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({
      message: "Error al sincronizar carrito",
      error: error.message,
    });
  }
};