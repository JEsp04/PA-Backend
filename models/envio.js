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
      defaultValue: 0,
    },
    direccionEnvio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigoPostal: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "El código postal debe contener solo números",
        },
        len: {
          args: [6, 6],
          msg: "El código postal debe tener exactamente 6 dígitos",
        },
      },
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
