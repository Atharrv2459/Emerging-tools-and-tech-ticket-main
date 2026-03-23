import express from 'express';
import { approveOrRejectTicket, getPendingTicketsForApproval } from "../controllers/manager_controller";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();
router.get('/pending-tickets',authenticate,  authorizeRoles('customer'),getPendingTicketsForApproval);
router.patch('/ticket/:ticketId/update', authenticate, authorizeRoles('customer'),approveOrRejectTicket);