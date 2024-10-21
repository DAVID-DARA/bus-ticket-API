import { Request, Response } from 'express';
import { prisma } from '../prisma/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logAction } from '../services/auditLog.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role = "USER" } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
      },
    });

    await prisma.account.create({
      data: {
        userId: newUser.id,
        balance: 0,
      },
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    await logAction(newUser.id, 'SIGUNUP')
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { id: newUser.id, email: newUser.email },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const existingAccount = await prisma.account.findUnique({
      where: { userId: user.id },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
      console.log(`Bus account created for user ${user.id}`);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
