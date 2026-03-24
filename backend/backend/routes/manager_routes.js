import express from 'express';
import { approveOrRejectTicket, getPendingTicketsForApproval } from "../controllers/manager_controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.get('/pending-tickets',authenticate,  authorizeRoles('customer'),getPendingTicketsForApproval);
router.patch('/ticket/:ticketId/update', authenticate, authorizeRoles('customer'),approveOrRejectTicket);
export default router;