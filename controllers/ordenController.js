import Orden from "../models/orden.js";

const ordenController = {

  crearOrden: async (req, res) => {
    try {
      const { usuarioId, total, estado } = req.body;

      if (!usuarioId || !total) {
        return res.status(400).json({ msg: "usuarioId y total son obligatorios" });
      }

      const nuevaOrden = await Orden.create({
        usuarioId,
        total,
        estado: estado || "pendiente",
      });

      res.status(201).json(nuevaOrden);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerOrdenes: async (req, res) => {
    try {
      const ordenes = await Orden.findAll();
      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerOrdenesPorUsuario: async (req, res) => {
    try {
      const { usuarioId } = req.params;

      const ordenes = await Orden.findAll({
        where: { usuarioId }
      });

      if (!ordenes.length) {
        return res.status(404).json({ msg: "No hay órdenes para este usuario" });
      }

      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  actualizarEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const orden = await Orden.findByPk(id);

      if (!orden) {
        return res.status(404).json({ msg: "Orden no encontrada" });
      }

      orden.estado = estado;
      await orden.save();

      res.json(orden);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  eliminarOrden: async (req, res) => {
    try {
      const { id } = req.params;

      const orden = await Orden.findByPk(id);

      if (!orden) {
        return res.status(404).json({ msg: "Orden no encontrada" });
      }

      await orden.destroy();
      res.json({ msg: "Orden eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

};

export default ordenController;
