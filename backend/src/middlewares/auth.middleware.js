import { prisma } from "../config/database.js";

export async function requireAuth(req, res, next) {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Debes iniciar sesión"
      });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        activo: true,
        rol: {
          select: {
            nombre: true
          }
        }
      }
    });

    if (!user || !user.activo) {
      req.session.destroy(() => {});

      return res.status(401).json({
        success: false,
        message: "La sesión no es válida"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}