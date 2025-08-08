const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { hash } = bcrypt;

const prisma = new PrismaClient();

async function main() {
  // Crear un usuario administrador
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  // Crear un usuario normal
  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'usuario' },
    update: {},
    create: {
      username: 'usuario',
      password: userPassword,
      name: 'Usuario de Prueba',
      role: 'USER',
    },
  });

  // Crear algunos productos de ejemplo
  const products = [
    {
      name: 'Laptop HP ProBook',
      category: 'Tecnología',
      expirationDate: new Date('2026-12-31'),
      quantity: 10,
      cost: 1200.99,
      lot: 'LPT2023001',
      registeredById: admin.id,
    },
    {
      name: 'Mouse Inalámbrico',
      category: 'Accesorios',
      expirationDate: new Date('2025-06-30'),
      quantity: 50,
      cost: 25.50,
      lot: 'MS2023002',
      registeredById: user.id,
    },
    {
      name: 'Teclado Mecánico',
      category: 'Accesorios',
      expirationDate: new Date('2025-12-31'),
      quantity: 30,
      cost: 89.99,
      lot: 'TEC2023003',
      registeredById: admin.id,
    },
  ];

  // Primero eliminamos cualquier producto existente para evitar duplicados
  await prisma.product.deleteMany({});
  
  // Luego creamos los nuevos productos
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Datos de prueba creados exitosamente');
  console.log('Usuario administrador:');
  console.log('- Usuario: admin');
  console.log('- Contraseña: admin123');
  console.log('\nUsuario normal:');
  console.log('- Usuario: usuario');
  console.log('- Contraseña: user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
