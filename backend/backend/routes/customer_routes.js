import express from 'express';
import { createTicket, myTickets } from '../controllers/customer_controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/tickets',authenticate,authorizeRoles('customer', 'agent'), myTickets);
router.post('/ticket',authenticate,authorizeRoles('customer', 'manager', 'agent', 'delivery_lead'),createTicket);
