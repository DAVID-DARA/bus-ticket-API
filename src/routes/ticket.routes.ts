import express from 'express';
import { 
    createTicket,
    createRoute,
    getAllRoutes,
    getAllTickets,
    getTicketById,
    deleteTicket,
    reserveTicket,
    purchaseTicket
} from '../controllers/ticket.controller';
import { isAdmin, protect } from '../middlewares/auth.middleware';

const router = express.Router();


router.get('/', protect, getAllTickets)

//Admin
router.post('/', protect, isAdmin, createTicket);
router.delete('/:id', isAdmin, deleteTicket);
router.post('/routes/', protect, isAdmin, createRoute);
router.get('/routes/', protect, getAllRoutes);

//User 
router.post('/reserve',protect, reserveTicket)
router.post('/purchase', protect, purchaseTicket)
router.get('/', protect, getAllTickets);
router.get('/:id', protect, getTicketById);

export {router}
