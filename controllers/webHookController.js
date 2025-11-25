export const recibirWebhook = async (req, res) => {
  try {
    console.log("WEBHOOK RECIBIDO:", req.body);

    const { action, data, type, topic } = req.body;

    // MercadoPago puede enviar cualquiera:
    // action: "payment.created" / "payment.updated"
    // type: "payment"
    // topic: "payment"

    const esPago =
      action?.includes("payment") ||
      type === "payment" ||
      topic === "payment";

    if (!esPago) {
      return res.sendStatus(200); // Ignorar eventos que no son pagos
    }

    const payment = new Payment(global.mercadoPago);
    const mpPayment = await payment.get({ id: data.id });

    const statusMP = mpPayment.body.status;
    const preferenceId =
      mpPayment.body.order?.id || mpPayment.body.id || data.id;

    const pago = await Pago.findOne({ where: { preferenceId } });

    if (!pago) {
      console.log("No se encontró un pago con ese preferenceId");
      return res.sendStatus(404);
    }

    let estadoPago = "pendiente";
    let estadoOrden = "pendiente";

    if (statusMP === "approved") {
      estadoPago = "completado";
      estadoOrden = "completada";
    }
    if (statusMP === "rejected") {
      estadoPago = "cancelado";
      estadoOrden = "cancelada";
    }

    await pago.update({ estado: estadoPago });

    const orden = await Orden.findByPk(pago.ordenId);
    if (orden) {
      await orden.update({ estado: estadoOrden });
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
