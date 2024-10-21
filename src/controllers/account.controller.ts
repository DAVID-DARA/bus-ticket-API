import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma';

export const creatBusTicketAccount = async (req: Request, res: Response) => {
  try {
    const { userId, balance } = req.body;

    const newAccount = await prisma.account.create({
      data: {
        userId,
        balance,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: newAccount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const creditBusTicketAccount = async (req: Request, res: Response) => {
  const { id } = req.params; 
  const { amount } = req.body; 

  try {
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
    }

    const account = await prisma.account.findUnique({ where: { id } });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        balance: account.balance + amount,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Account credited successfully.',
      data: updatedAccount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};