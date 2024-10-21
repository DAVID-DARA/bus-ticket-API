import express, {Request, Response} from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import seedAdminAndData from './bootstrap'
import {prisma} from './prisma/prisma'
import {router as authRoutes} from './routes/auth.routes'
import {router as userRoutes} from './routes/user.routes'
import {router as accountRoutes} from './routes/account.routes'
import {router as ticketRoutes} from './routes/ticket.routes'
import {router as transactionRoutes} from './routes/transaction.routes'
import {router as transferRoutes} from './routes/transfer.routes'
import {router as auditRouter} from './routes/auditLog.routes'

dotenv.config();

const app = express();

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/account', accountRoutes)
app.use('/api/v1/ticket', ticketRoutes)
app.use('/api/v1/transaction', transactionRoutes)
app.use('/api/v1/transfer', transferRoutes)
app.use('/api/v1/audit', auditRouter)

app.get('/', (req:Request, res: Response) => {
    res.json({
        name: "BUS_TICKETING_API",
        stack: ["ExpressJS", "Prisma", "MySQL"],
        author: "DAVID-DARA"
    })
})

seedAdminAndData().then(() => {
    console.log('Seeding completed.');
  }).catch((error) => {
    console.error('Seeding failed:', error);
  });

const PORT = process.env.PORT || 3030;

app.listen(PORT, async () => {
    await prisma.$connect();
    console.log(`Server is running on port ${PORT}`);
})