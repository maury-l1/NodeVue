const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Buscar token en headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    // Verifica token con tu secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded; // Guardamos info del usuario en req.user
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
