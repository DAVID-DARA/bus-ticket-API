import {prisma} from './prisma/prisma';
import bcrypt from 'bcryptjs';

const seedAdminAndData = async () => {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {    
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    const routesCount = await prisma.route.count();
    if (routesCount === 0) {
      await prisma.route.createMany({
        data: [
          {
            origin: 'City A',
            destination: 'City B',
            departureTime: new Date('2024-10-22T08:00:00Z'),
            arrivalTime: new Date('2024-10-22T12:00:00Z'),
            price: 50.0,
          },
          {
            origin: 'City C',
            destination: 'City D',
            departureTime: new Date('2024-10-23T09:00:00Z'),
            arrivalTime: new Date('2024-10-23T13:00:00Z'),
            price: 70.0,
          },
        ],
      });
      console.log('Routes created.');
    } else {
      console.log('Routes already exist.');
    }

    const ticketsCount = await prisma.ticket.count();
    if (ticketsCount === 0) {
      const routeA = await prisma.route.findFirst({ where: { origin: 'City A' } });
      const routeB = await prisma.route.findFirst({ where: { origin: 'City C' } });

      if (routeA && routeB) {
        await prisma.ticket.createMany({
          data: [
            {
              routeId: routeA.id,
              price: 50.0,
              available: 20,
            },
            {
              routeId: routeB.id,
              price: 70.0,
              available: 15,
            },
          ],
        });
        console.log('Tickets created.');
      }
    } else {
      console.log('Tickets already exist.');
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default seedAdminAndData;
