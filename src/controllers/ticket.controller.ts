import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma';


export const createBusTicket = async (req: Request, res: Response) => {
  const user = req.body;
  return res.status(200).json({data: user})
}




export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany();
    return res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Controller to create a new ticket
export const createTicket = async (req: Request, res: Response) => {
  const { routeId, price, available } = req.body;

  try {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    const ticket = await prisma.ticket.create({
      data: {
        routeId,
        price,
        available,
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating ticket' });
  }
};

// Controller to create a new route
export const createRoute = async (req: Request, res: Response) => {
  const { origin, destination, departureTime, arrivalTime, price } = req.body;

  try {
    const route = await prisma.route.create({
      data: {
        origin,
        destination,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price,
      },
    });

    return res.status(201).json(route);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating route' });
  }
};

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = prisma.route.findMany({});
    const routeAmount = await (await routes).length

    if (!routes) return res.status(404).json({message: "No available routes"})

    return res.status(200).json({message: `${routeAmount} routes available`, data: routes})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    return res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Delete ticket
export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.ticket.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



//User
export const reserveTicket = async (req: Request, res: Response) => {
  const { ticketId, userId } = req.body;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket || ticket.available <= 0) {
      return res.status(400).json({ message: 'Ticket not available for reservation' });
    }

    const userTicket = await prisma.userTicket.create({
      data: {
        userId,
        ticketId,
        status: 'reserved',
      },
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { available: ticket.available - 1 },
    });

    return res.status(201).json(userTicket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error reserving ticket' });
  }
};

export const purchaseTicket = async (req: Request, res: Response) => {
  const { ticketId, userId } = req.body;

  try {
    const userTicket = await prisma.userTicket.findFirst({
      where: {
        userId,
        ticketId,
        status: 'reserved',
      },
    });

    if (!userTicket) {
      return res.status(400).json({ message: 'No reserved ticket found for this user' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(400).json({ message: 'Ticket not found' });
    }

    const account = await prisma.account.findUnique({
      where: { userId },
    });

    if (!account || account.balance < ticket.price) {
      return res.status(400).json({ message: 'Insufficient balance to purchase ticket' });
    }

    await prisma.userTicket.update({
      where: { id: userTicket.id },
      data: { status: 'purchased' },
    });

    await prisma.account.update({
      where: { userId },
      data: { balance: account.balance - ticket.price },
    });

    return res.status(200).json({ message: 'Ticket purchased successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error purchasing ticket' });
  }
};