import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Orden = sequelize.define("Orden", {
  ordenId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
    defaultValue: 'pendiente',
},
},{ tableName: 'ordenes',
  timestamps: true,
});

export default Orden;