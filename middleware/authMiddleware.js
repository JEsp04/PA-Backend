import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(" ");
    const token = parts.length === 2 ? parts[1] : authHeader;

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request for controllers
    req.usuarioId = payload.usuarioId;
    req.user = payload;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
