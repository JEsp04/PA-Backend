import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Direccion = sequelize.define(
  "Direccion",
  {
    direccionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING(100),
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
    esDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "direcciones",
    timestamps: true,
  }
);

export default Direccion;
