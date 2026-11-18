import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
import { loginSchema } from "./auth.schemas.js";

const publicUserSelect = {
  id: true,
  nombre: true,
  email: true,
  activo: true,
  rol: {
    select: {
      nombre: true
    }
  }
};

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Datos de inicio de sesión no válidos",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    const { email, password } = validation.data;

    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        rol: true
      }
    });

    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos"
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña incorrectos"
      });
    }

    // Evita conservar una sesión anterior.
    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) return next(saveError);

        return res.json({
          success: true,
          message: "Inicio de sesión correcto",
          data: {
            user: {
              id: user.id,
              nombre: user.nombre,
              email: user.email,
              rol: user.rol.nombre
            }
          }
        });
      });
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getCurrentUser(req, res) {
  return res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol.nombre
      }
    }
  });
}

// POST /api/auth/logout
export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("tecnofix.sid", {
      httpOnly: true,
      secure: req.secure,
      sameSite: "lax",
      path: "/"
    });

    return res.json({
      success: true,
      message: "Sesión cerrada correctamente"
    });
  });
}