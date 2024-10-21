import express from 'express';
import { createTransfer } from '../controllers/transfer.controller';
import {protect} from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', protect, createTransfer);

export {router};
