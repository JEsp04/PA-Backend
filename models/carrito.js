import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Carrito = sequelize.define("Carrito", {
  carritoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: "uk_carrito_usuarioId",
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
},{ tableName: 'carritos',
  timestamps: true,
});

export default Carrito;