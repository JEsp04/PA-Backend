import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Envio = sequelize.define(
  "Envio",
  {
    envioId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ordenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estadoEnvio: {
      type: DataTypes.ENUM("pendiente", "enviado", "entregado", "cancelado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    fechaEnvio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fechaEntrega: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: () => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 15);
        return fecha;
      },
    },
  },
  { tableName: "envios", timestamps: true }
);

export default Envio;
