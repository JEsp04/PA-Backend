import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Orden from "./orden.js";

const OrdenDetalles = sequelize.define(
  "OrdenDetalles",
  {
    ordenDetalleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ordenId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
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

async function actualizarTotalOrden(ordenId, transaction) {
  // Usar las APIs de modelo con la transacción para evitar usar otra conexión
  const total =
    (await OrdenDetalles.sum("total", { where: { ordenId }, transaction })) ||
    0;

  await Orden.update({ total }, { where: { ordenId }, transaction });
}

// Pasar la transacción de los hooks a la función que actualiza la orden
OrdenDetalles.afterCreate((detalle, options) =>
  actualizarTotalOrden(detalle.ordenId, options?.transaction)
);
OrdenDetalles.afterUpdate((detalle, options) =>
  actualizarTotalOrden(detalle.ordenId, options?.transaction)
);
OrdenDetalles.afterDestroy((detalle, options) =>
  actualizarTotalOrden(detalle.ordenId, options?.transaction)
);

export default OrdenDetalles;
