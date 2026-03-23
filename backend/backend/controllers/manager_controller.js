import pool from '../config/db.js';
export const getPendingTicketsForApproval = async (req, res) => {
  try {
    const managerId = req.user.user_id;
    const result = await pool.query(
      `
      SELECT
        t.*,

        CASE
          WHEN rr.role_name = 'agent' THEN r.agent_type
          WHEN rr.role_name = 'customer' THEN r.customer_type
          ELSE rr.role_name
        END AS requester_type

      FROM tickets t
      LEFT JOIN users r ON t.requester_id = r.id
      LEFT JOIN roles rr ON r.role_id = rr.id

      WHERE t.approval_status = 'Pending'
        AND r.manager_id = $1

      ORDER BY t.created_at DESC
      `,
      [managerId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Pending approval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





export const approveOrRejectTicket = async (req, res) => {
  try {
    const managerId = req.user.user_id;
    const { ticketId } = req.params;
    let { action, rejection_reason } = req.body;
    if (!action && req.body.approval_status) {
      action = req.body.approval_status;
    }
    if (!action) {
      return res.status(400).json({
        message: "Action is required"
      });
    }
    action = action.toString().trim().toLowerCase();
    if (action === 'approved') action = 'approve';
    if (action === 'rejected') action = 'reject';
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        message: "Action must be either approve or reject"
      });
    }
    const ticketResult = await pool.query(
      `
      SELECT
        t.id,
        t.subject,
        t.description
      FROM tickets t
      JOIN users r ON t.requester_id = r.id
      WHERE t.id = $1
        AND t.approval_status = 'Pending'
        AND r.manager_id = $2
      `,
      [ticketId, managerId]
    );
    if (ticketResult.rowCount === 0) {
      return res.status(403).json({
        message: "Ticket not found, already processed, or access denied"
      });
    }
    const ticket = ticketResult.rows[0];
    if (action === "approve") {
      await pool.query(
        `
        UPDATE tickets
        SET
          approval_status = 'Approved',
          approved_by = $1,
          approved_at = CURRENT_TIMESTAMP,
          status = 'Open',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [managerId, ticketId]
      );
      return res.json({ message: "Ticket approved successfully" });
    }
    if (!rejection_reason || rejection_reason.trim() === "") {
      return res.status(400).json({
        message: "rejection_reason is required when rejecting a ticket"
      });
    }
    await pool.query(
      `
      UPDATE tickets
      SET
        approval_status = 'Rejected',
        rejection_reason = $1,
        approved_by = $2,
        approved_at = CURRENT_TIMESTAMP,
        status = 'Closed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      `,
      [rejection_reason, managerId, ticketId]
    );

    return res.json({ message: "Ticket rejected successfully" });

  } catch (error) {
    console.error("Approve / Reject ticket error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
