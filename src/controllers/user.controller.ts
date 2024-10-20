import { Request, Response } from 'express'
import {prisma} from '../prisma/prisma'

const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany(); // Retrieve all users
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found.' });
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };

export { getAllUsers }