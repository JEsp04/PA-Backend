import Envio from "../models/envio.js";
import Direccion from "../models/direccion.js";
import OrdenDetalles from "../models/detallesOrden.js";
import Orden from "../models/orden.js";
import Producto from "../models/producto.js";

export const crearEnvio = async (req, res) => {
  try {
    const { ordenId, direccionId, estadoEnvio, fechaEntrega } = req.body;

    // Verificar que la dirección existe
    const direccion = await Direccion.findByPk(direccionId);
    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    const envio = await Envio.create({
      ordenId,
      direccionId,
      estadoEnvio: estadoEnvio || "pendiente",
      fechaEntrega: fechaEntrega || null,
    });

    return res.status(201).json(envio);
  } catch (error) {
    console.error("Error creando envío:", error);
    res.status(500).json({ message: "Error al crear el envío", error });
  }
};

export const actualizarEnvio = async (req, res) => {
  try {
    const envio = await Envio.findByPk(req.params.id);

    if (!envio) {
      return res.status(404).json({ message: "Envío no encontrado" });
    }

    await envio.update(req.body);

    res.json(envio);
  } catch (error) {
    console.error("Error actualizando envío:", error);
    res.status(500).json({ message: "Error al actualizar el envío", error });
  }
};

export const obtenerEnviosUsuario = async (req, res) => {
  try {
    // Permitir obtener envíos por el usuario autenticado (req.usuarioId)
    // o por un id pasado en params (req.params.id) para casos administrativos
    const usuarioId = req.usuarioId || req.params.id;

    if (!usuarioId) {
      return res.status(400).json({ message: "UsuarioId requerido" });
    }

    // Obtener envíos cuyas órdenes pertenecen al usuario autenticado.
    // No incluimos Direccion dentro de Orden (no existe relación Orden-Direccion),
    // solo incluimos los detalles de la orden y la dirección del envío.
    const envios = await Envio.findAll({
      include: [
        {
          model: Orden,
          where: { usuarioId }, // filtra por el usuario dueño de la orden
          include: [
            {
              model: OrdenDetalles,
              include: [
                {
                  model: Producto,
                },
              ],
            },
          ],
        },
        {
          model: Direccion, // la dirección propia del envío
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(envios);
  } catch (error) {
    console.error("Error obteniendo envíos:", error);
    res.status(500).json({ message: "Error al obtener envíos", error });
  }
};
