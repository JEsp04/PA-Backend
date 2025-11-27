import express from "express";
import { procesarPago } from "../controllers/pagoController.js";

const router = express.Router();

router.post("/procesarPago", procesarPago);

export default router;
