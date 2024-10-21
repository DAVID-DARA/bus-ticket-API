import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, type, amount } = req.body;

    const newTransaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
