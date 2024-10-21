import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma';

export const createTransfer = async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId, amount } = req.body;

    const newTransfer = await prisma.transfer.create({
      data: {
        senderId,
        recipientId,
        amount,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Transfer created successfully',
      data: newTransfer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
