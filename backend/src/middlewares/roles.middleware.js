export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Debes iniciar sesión"
      });
    }

    const userRole = req.user.rol.nombre;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
}