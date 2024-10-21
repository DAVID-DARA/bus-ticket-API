import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } }, // Include user details if needed
      },
      orderBy: {
        createdAt: 'desc', // Order logs by the latest first
      },
    });

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
