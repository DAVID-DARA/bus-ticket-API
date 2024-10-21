import express from 'express';
import { getAuditLogs } from '../controllers/auditLog.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', protect, getAuditLogs);

export {router};
