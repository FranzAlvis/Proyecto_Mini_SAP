require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware para verificar token
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const session = await prisma.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }
      }
    });

    if (!session) {
      return res.status(401).json({ error: 'Sesión inválida' });
    }

    req.user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
    const user = await prisma.user.findUnique({ where: { username } });
    
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

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
