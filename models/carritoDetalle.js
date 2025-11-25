import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Carrito from "./carrito.js";
import Producto from "./producto.js";

const CarritoDetalle = sequelize.define(
  "CarritoDetalle",
  {
    CarritoDetalleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carritoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Carrito,
        key: "carritoId",
      },
      onDelete: "CASCADE",
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Producto,
        key: "productoId",
      },
      onDelete: "CASCADE",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "carrito_detalles",
    timestamps: false,
  }
);

CarritoDetalle.beforeCreate((detalle) => {
  detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
});

CarritoDetalle.beforeUpdate((detalle) => {
  if (detalle.changed('cantidad') || detalle.changed('precioUnitario')) {
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
  }
});

async function actualizarTotalParaCarrito(carritoId) {
  if (!carritoId) return;

  const detalles = await CarritoDetalle.findAll({ where: { carritoId } });

  const total = detalles.reduce((sum, d) => {
    const precio = parseFloat(d.precioUnitario) || 0;
    const cantidad = Number(d.cantidad) || 0;
    return sum + precio * cantidad;
  }, 0);

  await Carrito.update(
    { total: Number(total.toFixed(2)) }, 
    { where: { carritoId } }
  );
}





export default CarritoDetalle;
