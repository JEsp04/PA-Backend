import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import carritoDetalleRoutes from "./routes/carritoDetalleRoutes.js";
import ordenRoutes from "./routes/ordenRoutes.js";
import detallesOrdenRoute from "./routes/detallesOrdenRoute.js";
import pagoRoute from "./routes/pagoRoutes.js";
import cors from "cors";
import { recibirWebhook } from "./controllers/webHookController.js";

import { MercadoPagoConfig, Preference } from "mercadopago";

export const mercadoPago = new MercadoPagoConfig({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// Hacer mercadopago global para acceso en controllers
global.mercadoPago = mercadoPago;

const app = express();

app.use(cors());

app.post("/api/pagos/webhook", express.raw({ type: "*/*" }), recibirWebhook);

app.use(express.json());

app.use("/api/productos", productRoutes);

app.use("/api/usuarios", userRoutes);

app.use("/api/usuarios/auth", authRoutes);

app.use("/api/carritos", carritoRoutes);

app.use("/api/carritos/detalles", carritoDetalleRoutes);

app.use("/api/ordenes", ordenRoutes);

app.use("/api/ordenes/detalles", detallesOrdenRoute);

app.use("/api/pagos", pagoRoute);

export default app;
