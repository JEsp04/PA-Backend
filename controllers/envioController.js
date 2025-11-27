import Envio from "../models/envio.js";

export const crearEnvio = async (req, res) => {
  try {
    const {
      ordenId,
      direccionEnvio,
      ciudad,
      departamento,
      codigoPostal,
      estadoEnvio,
      fechaEntrega,
    } = req.body;

    const envio = await Envio.create({
      ordenId,
      direccionEnvio,
      ciudad,
      departamento,
      codigoPostal,
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
