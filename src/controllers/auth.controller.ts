import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma/prisma'


const signup = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    try {
        const exisitingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (exisitingUser) {
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username
            }
        });

        return res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.username
        })
    } catch (error) {
        return res.status(500).json({
            messsag: 'Internal Server Error', error
        })
    }
}

const signin = async  (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique ({
            where: {
                email: email
            }
        })
    
        if (!user) return res.status(404).json({
            message: "User does not exist"
        })
    
        const token= jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET!,
        { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'login successful',
            accessToken: token
        })
    } catch (error) {
        return res.status(500).json({message: `Internal Server Error: ${error}`})
    }    
}

export { signup, signin }