import Pago from "../models/pago.js";
import Orden from "../models/orden.js";
import { Preference } from "mercadopago";

export const crearPago = async (req, res) => {
  try {
    const { ordenId, usuarioId, monto } = req.body;

    const orden = await Orden.findByPk(ordenId);
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });

    const preferenceData = {
      items: [
        {
          title: `Pago Orden #${ordenId}`,
          unit_price: Number(monto),
          quantity: 1,
        },
      ],
      notification_url:
        process.env.WEBHOOK_URL || "https://TU_NGROK/api/pagos/webhook",
      back_urls: {
        success: process.env.FRONTEND_URL
          ? process.env.FRONTEND_URL + "/success"
          : "http://localhost:5173/success",
        failure: process.env.FRONTEND_URL
          ? process.env.FRONTEND_URL + "/failure"
          : "http://localhost:5173/failure",
        pending: process.env.FRONTEND_URL
          ? process.env.FRONTEND_URL + "/pending"
          : "http://localhost:5173/pending",
      },
      auto_return: "approved",
    };

    const preference = new Preference(global.mercadoPago);
    const result = await preference.create({ body: preferenceData });

    const pago = await Pago.create({
      ordenId,
      usuarioId,
      monto,
      metodoPago: "mercado_pago",
      preferenceId: result.body.id,
      estado: "pendiente",
    });

    return res.json({
      preferenceId: result.body.id,
      init_point: result.body.init_point,
      sandbox_init_point: result.body.sandbox_init_point,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creando pago" });
  }
};
