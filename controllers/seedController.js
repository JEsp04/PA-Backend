import fs from "fs";
import path from "path";
import Producto from "../models/producto.js";

export const cargarProductos = async (req, res) => {
  try {
    const filePath = path.resolve("data/productSeed.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const productos = JSON.parse(data);

    await Producto.bulkCreate(productos);
    res.status(201).json({ message: "Productos cargados correctamente." });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ message: "Error al cargar productos", error: error.message });
  }
};
