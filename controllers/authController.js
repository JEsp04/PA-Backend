import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/user.js";

export const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    const userExist = await Usuario.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).json({ message: "El email ya existe" });
    }

    const newUser = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol || "cliente",
    });

    const payload = { usuarioId: newUser.usuarioId, email: newUser.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userSafe = newUser.toJSON();
    delete userSafe.password;

    return res.status(201).json({
      message: "Usuario registrado con exito",
      user: userSafe,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const payload = { usuarioId: user.usuarioId, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userSafe = user.toJSON();
    delete userSafe.password;

    return res.json({
      message: "Login exitoso",
      user: userSafe,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
