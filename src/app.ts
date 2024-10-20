import express, {Request, Response} from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import {prisma} from './prisma/prisma'
import {router as authRoutes} from './routes/auth.routes'
import {router as userRoutes} from './routes/user.routes'
require('dotenv').config();

const app = express();

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)

app.get('/', (req:Request, res: Response) => {
    res.json({
        name: "BUS_TICKETING_API",
        stack: ["ExpressJS", "Prisma", "MySQL"],
        author: "DAVID-DARA"
    })
})

const PORT = process.env.PORT || 3030;

app.listen(PORT, async () => {
    await prisma.$connect();
    console.log(`Server is running on port ${PORT}`);
})