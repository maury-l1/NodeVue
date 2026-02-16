const adminMiddleware = (req, res, next) => {
  // req.user debe estar definido por authMiddleware
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });

  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo admin' });
  }

  next();
};

module.exports = adminMiddleware;
