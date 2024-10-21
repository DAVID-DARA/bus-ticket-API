import express from 'express';
import { creatBusTicketAccount, creditBusTicketAccount } from '../controllers/account.controller';
import {protect} from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', protect, creatBusTicketAccount);
router.post('/', protect, creditBusTicketAccount);

export {router};
