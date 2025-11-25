import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OrdenDetalles = sequelize.define(
  "OrdenDetalles",
  {
    ordenDetalleId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ordenId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "orden_detalles",
    timestamps: true,
  }
);

const calcularTotal = (detalle) => {
  const precio = parseFloat(detalle.precioUnitario) || 0;
  const cantidad = Number(detalle.cantidad) || 0;
  detalle.total = Number((precio * cantidad).toFixed(2));
};

OrdenDetalles.beforeCreate(calcularTotal);
OrdenDetalles.beforeUpdate(calcularTotal);

async function actualizarTotalOrden(ordenId) {
  const [rows] = await sequelize.query(
    "SELECT IFNULL(SUM(total),0) AS total FROM orden_detalles WHERE ordenId = ?",
    { replacements: [ordenId] }
  );

  const total = rows[0].total || 0;

  await sequelize.query(
    "UPDATE ordenes SET total = ? WHERE ordenId = ?",
    { replacements: [total, ordenId] }
  );
}

OrdenDetalles.afterCreate(detalle => actualizarTotalOrden(detalle.ordenId));
OrdenDetalles.afterUpdate(detalle => actualizarTotalOrden(detalle.ordenId));
OrdenDetalles.afterDestroy(detalle => actualizarTotalOrden(detalle.ordenId));

export default OrdenDetalles;
