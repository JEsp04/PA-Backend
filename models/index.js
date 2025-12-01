import sequelize from "../config/database.js";

import Usuario from "./user.js";
import Producto from "./producto.js";
import Carrito from "./carrito.js";
import CarritoDetalle from "./carritoDetalle.js";
import Orden from "./orden.js";
import OrdenDetalles from "./detallesOrden.js";
import Pago from "./pago.js";
import Envio from "./envio.js";
import Direccion from "./direccion.js";

// ========================
// Usuario - Carrito (1:1)
// ========================
Usuario.hasOne(Carrito, {
  foreignKey: {
    name: "usuarioId",
    allowNull: false,
    unique: "uk_carrito_usuarioId",
  },
  onDelete: "CASCADE",
});
Carrito.belongsTo(Usuario, {
  foreignKey: {
    name: "usuarioId",
    allowNull: false,
    unique: "uk_carrito_usuarioId",
  },
});

// ========================
// Usuario - Direccion (1:N)
// ========================
Usuario.hasMany(Direccion, {
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
});
Direccion.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

// ========================
// Usuario - Orden (1:N)
// ========================
Usuario.hasMany(Orden, {
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
});
Orden.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

// ========================
// Usuario - Pago (1:N)
// ========================
Usuario.hasMany(Pago, {
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
});
Pago.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

// ========================
// Carrito - CarritoDetalle (1:N) - CON sourceKey/targetKey EXPLÍCITOS
// ========================
Carrito.hasMany(CarritoDetalle, {
  foreignKey: "carritoId",
  sourceKey: "carritoId",
  onDelete: "CASCADE",
  as: "CarritoDetalles",
});
CarritoDetalle.belongsTo(Carrito, {
  foreignKey: "carritoId",
  targetKey: "carritoId",
  as: "Carrito",
});

// ========================
// Producto - CarritoDetalle (1:N)
// ========================
Producto.hasMany(CarritoDetalle, {
  foreignKey: "productoId",
  sourceKey: "productoId",
  onDelete: "CASCADE",
});
CarritoDetalle.belongsTo(Producto, {
  foreignKey: "productoId",
  targetKey: "productoId",
  as: "Product",
});

// ========================
// Orden - OrdenDetalles (1:N)
// ========================
Orden.hasMany(OrdenDetalles, {
  foreignKey: "ordenId",
  onDelete: "CASCADE",
});
OrdenDetalles.belongsTo(Orden, {
  foreignKey: "ordenId",
});

// ========================
// Producto - OrdenDetalles (1:N)
// ========================
Producto.hasMany(OrdenDetalles, {
  foreignKey: "productoId",
  onDelete: "CASCADE",
});
OrdenDetalles.belongsTo(Producto, {
  foreignKey: "productoId",
});

// ========================
// Orden - Pago (1:1)
// ========================
Orden.hasOne(Pago, {
  foreignKey: "ordenId",
  onDelete: "CASCADE",
});
Pago.belongsTo(Orden, {
  foreignKey: "ordenId",
});

// ========================
// Orden - Envio (1:1)
// ========================
Orden.hasOne(Envio, {
  foreignKey: "ordenId",
  onDelete: "CASCADE",
});
Envio.belongsTo(Orden, {
  foreignKey: "ordenId",
});

// ========================
// Direccion - Envio (1:N)
// ========================
Direccion.hasMany(Envio, {
  foreignKey: "direccionId",
  onDelete: "CASCADE",
});
Envio.belongsTo(Direccion, {
  foreignKey: "direccionId",
});

export {
  sequelize,
  Usuario,
  Producto,
  Carrito,
  CarritoDetalle,
  Orden,
  OrdenDetalles,
  Pago,
  Envio,
  Direccion,
};
