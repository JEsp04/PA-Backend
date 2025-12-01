import Direccion from "../models/direccion.js";
import Usuario from "../models/user.js";

// Obtener todas las direcciones de un usuario
export const obtenerDirecciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const direcciones = await Direccion.findAll({
      where: { usuarioId },
      order: [
        ["esDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json(direcciones);
  } catch (error) {
    console.error("Error obteniendo direcciones:", error);
    res.status(500).json({ message: "Error al obtener direcciones", error });
  }
};

// Crear una nueva dirección
export const crearDireccion = async (req, res) => {
  try {
    // Preferir usuarioId del token (req.usuarioId) cuando la ruta está protegida
    const {
      usuarioId: bodyUsuarioId,
      direccion,
      ciudad,
      departamento,
      codigoPostal,
      esDefault,
    } = req.body;

    const usuarioId = req.usuarioId || bodyUsuarioId;

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si esDefault es true, desmarcar otras direcciones por defecto
    if (esDefault) {
      await Direccion.update({ esDefault: false }, { where: { usuarioId } });
    }

    const nuevaDireccion = await Direccion.create({
      usuarioId,
      direccion,
      ciudad,
      departamento,
      codigoPostal,
      esDefault: esDefault || false,
    });

    res.status(201).json(nuevaDireccion);
  } catch (error) {
    console.error("Error creando dirección:", error);
    res.status(500).json({ message: "Error al crear dirección", error });
  }
};

// Actualizar una dirección
export const actualizarDireccion = async (req, res) => {
  try {
    const { id } = req.params;

    // El usuarioId debe venir del token, no del body
    const usuarioId = req.usuarioId; // Ej: lo agregas en tu middleware de auth

    const { esDefault, ...updateData } = req.body;

    const direccion = await Direccion.findByPk(id);
    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    // Verificar permisos: la dirección debe pertenecer al usuario autenticado
    if (direccion.usuarioId !== usuarioId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // 🔥 Actualización parcial: solo se actualizan campos presentes
    if (esDefault !== undefined) {
      // Si la nueva dirección será la default
      if (esDefault === true && direccion.esDefault === false) {
        await Direccion.update({ esDefault: false }, { where: { usuarioId } });
      }
    }

    await direccion.update({
      ...updateData,
      ...(esDefault !== undefined && { esDefault }), // solo aplica si viene en el body
    });

    return res.json({
      message: "Dirección actualizada exitosamente",
      direccion: direccion.toJSON(),
    });
  } catch (error) {
    console.error("Error actualizando dirección:", error);
    return res.status(500).json({
      message: "Error al actualizar dirección",
      error: error.message,
    });
  }
};

// Eliminar una dirección
export const eliminarDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;

    const direccion = await Direccion.findByPk(id);
    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    // Verificar permisos
    if (direccion.usuarioId !== usuarioId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await direccion.destroy();

    res.json({ message: "Dirección eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando dirección:", error);
    res.status(500).json({ message: "Error al eliminar dirección", error });
  }
};

// Establecer dirección por defecto
export const establecerDireccionDefault = async (req, res) => {
  try {
    const { id } = req.params; // id de la dirección
    const usuarioId = req.usuarioId; // viene del token

    const direccion = await Direccion.findByPk(id);
    if (!direccion) {
      return res.status(404).json({ message: "Dirección no encontrada" });
    }

    // Verificar permisos
    if (direccion.usuarioId !== usuarioId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Desmarcar todas las direcciones del usuario como default
    await Direccion.update({ esDefault: false }, { where: { usuarioId } });

    // Marcar esta como default
    await direccion.update({ esDefault: true });

    res.json({
      message: "Dirección establecida como por defecto",
      direccion,
    });
  } catch (error) {
    console.error("Error estableciendo dirección por defecto:", error);
    res.status(500).json({
      message: "Error al establecer dirección por defecto",
      error: error.message,
    });
  }
};
