import { Carrito, CarritoDetalle, Orden, OrdenDetalles, Pago, sequelize } from "../models/index.js";

export const procesarPago = async (req, res) => {
  const { usuarioId, metodoPago } = req.body;

  const t = await sequelize.transaction(); // 🔥 Inicio transacción

  try {
    // Obtener carrito
    const carrito = await Carrito.findOne({
      where: { usuarioId },
      include: [
        {
          model: CarritoDetalle,
          as: "CarritoDetalles",
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!carrito || carrito.CarritoDetalles.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    // 1) Crear la orden
    const orden = await Orden.create(
      {
        usuarioId,
        total: carrito.total,
        estado: "pendiente",
      },
      { transaction: t }
    );

    // 2) Crear los detalles de la orden
    for (const item of carrito.CarritoDetalles) {
      await OrdenDetalles.create(
        {
          ordenId: orden.ordenId,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        },
        { transaction: t }
      );
    }

    // 3) Crear el pago
    const pago = await Pago.create(
      {
        ordenId: orden.ordenId,
        usuarioId,
        metodoPago,
        monto: carrito.total,
        estado: "completado", // 🔥 el pago local se considera aprobado
      },
      { transaction: t }
    );

    // 4) Vaciar carrito
    await CarritoDetalle.destroy({
      where: { carritoId: carrito.carritoId },
      transaction: t,
    });

    await Carrito.update(
      { total: 0 },
      { where: { carritoId: carrito.carritoId }, transaction: t }
    );

    await t.commit();

    res.json({
      message: "Pago procesado correctamente",
      pago,
      orden,
    });

  } catch (error) {
    console.error("Error procesando pago:", error);
    await t.rollback();
    res.status(500).json({ message: "Error interno", error });
  }
};
