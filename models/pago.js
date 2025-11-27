import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Pago = sequelize.define(
  "Pago",
  {
    pagoId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ordenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodoPago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fechaPago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "completado", "cancelado"),
      allowNull: false,
    },
  },
  { tableName: "pagos", timestamps: true }
);

export default Pago;
