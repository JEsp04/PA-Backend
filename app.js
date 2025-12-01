import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import carritoRoutes from "./routes/carritoRoutes.js";
import carritoDetalleRoutes from "./routes/carritoDetalleRoutes.js";
import ordenRoutes from "./routes/ordenRoutes.js";
import detallesOrdenRoute from "./routes/detallesOrdenRoute.js";
import pagoRoute from "./routes/pagoRoutes.js";
import EnvioRoute from "./routes/envioRoutes.js";
import direccionRoutes from "./routes/direccionRoutes.js";

import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/productos", productRoutes);

app.use("/api/usuarios", userRoutes);

app.use("/api/usuarios/auth", authRoutes);

app.use("/api/carritos", carritoRoutes);

app.use("/api/carritos/detalles", carritoDetalleRoutes);

app.use("/api/ordenes", ordenRoutes);

app.use("/api/ordenes/detalles", detallesOrdenRoute);

app.use("/api/pagos", pagoRoute);

app.use("/api/envios", EnvioRoute);

app.use("/api/direcciones", direccionRoutes);

export default app;
