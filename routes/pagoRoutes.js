import express from "express";
import { crearPago } from "../controllers/pagoController.js";
import { recibirWebhook } from "../controllers/webHookController.js";

const router = express.Router();

router.post("/CrearPago", crearPago);

export default router;
