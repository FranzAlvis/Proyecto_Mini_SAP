require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware para verificar token desde cookie
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'No autorizado - Inicia sesión primero' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const session = await prisma.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }
      }
    });

    if (!session) {
      // Limpiar la cookie si la sesión no es válida
      res.clearCookie('token');
      return res.status(401).json({ error: 'La sesión ha expirado' });
    }

    req.user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.clearCookie('token');
    res.status(401).json({ error: 'No autorizado - Token inválido' });
  }
};

// Middleware to check for Admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // El puerto por defecto de Vite
  credentials: true,
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varios SmartTVs) tienen problemas con 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// Rutas de autenticación
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role: 'USER'
      },
    });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ 
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        name: true,
        role: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000), // 1 hora
      },
    });

    // Configurar la cookie HTTP-Only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hora
      path: '/'
    });

    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      success: true, 
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para verificar autenticación
app.get('/api/check-auth', auth, (req, res) => {
  res.json({ 
    authenticated: true, 
    user: req.user 
  });
});

app.post('/api/logout', auth, async (req, res) => {
  try {
    const token = req.cookies.token;
    
    await prisma.session.deleteMany({
      where: {
        token: token,
      },
    });

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({ success: true, message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error en el servidor al cerrar sesión' });
  }
});

// Ruta para estadísticas del Dashboard
app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const totalProducts = await prisma.product.count();

    const expiringSoon = await prisma.product.count({
      where: {
        expirationDate: {
          gte: today,
          lt: nextWeek
        }
      }
    });

    const todayEntries = await prisma.product.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    const lowStock = await prisma.product.count({
      where: {
        quantity: {
          lt: 10 // Define "low stock" as less than 10
        }
      }
    });

    const inventoryValue = await prisma.product.aggregate({
      _sum: {
        cost: true,
      },
    });

    res.json({
      totalProducts,
      expiringSoon,
      todayEntries,
      totalValue: inventoryValue._sum.cost || 0,
      lowStock
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Rutas de Productos
app.get('/api/products', auth, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        registeredBy: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        expirationDate: 'asc'
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/api/products', auth, async (req, res) => {
  try {
    const { name, category, expirationDate, quantity, cost, lot } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        category,
        expirationDate: new Date(expirationDate),
        quantity: parseInt(quantity),
        cost: parseFloat(cost),
        lot,
        registeredById: req.user.id
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: 'Error al crear el producto' });
  }
});

app.put('/api/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, expirationDate, quantity, cost, lot } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        expirationDate: new Date(expirationDate),
        quantity: parseInt(quantity),
        cost: parseFloat(cost),
        lot,
      },
      include: {
        registeredBy: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
});

app.delete('/api/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(400).json({ error: 'Error al eliminar el producto' });
  }
});

// Ruta para cerrar sesión
app.post('/api/logout', auth, async (req, res) => {
  try {
    const token = req.cookies.token;
    
    // Eliminar la sesión de la base de datos
    await prisma.session.deleteMany({
      where: { token }
    });
    
    // Limpiar la cookie
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
});

// Rutas protegidas
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalProducts = await prisma.product.count();
    const expiringSoon = await prisma.product.count({
      where: {
        expirationDate: {
          lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    const todayEntries = await prisma.product.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    res.json({
      totalProducts,
      expiringSoon,
      todayEntries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', auth, async (req, res) => {
  try {
    const { name, category, expirationDate, quantity, cost, lot } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        category,
        expirationDate: new Date(expirationDate),
        quantity: parseInt(quantity),
        cost: parseFloat(cost),
        lot,
        registeredById: req.user.id
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/products', auth, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        registeredBy: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Update a product
app.put('/api/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, expirationDate, cost } = req.body;

  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        quantity,
        expirationDate: new Date(expirationDate),
        cost,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Delete a product
app.delete('/api/products/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

app.put('/api/products/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permisos para modificar productos' });
    }

    const { id } = req.params;
    const { name, category, expirationDate, quantity, cost, lot } = req.body;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        expirationDate: new Date(expirationDate),
        quantity: parseInt(quantity),
        cost: parseFloat(cost),
        lot
      }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar productos' });
    }

    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
