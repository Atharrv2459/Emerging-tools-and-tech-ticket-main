export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'Access denied' });
    next();
  };
};

export const authorizeAgentTypes = (...types) => {
  return (req, res, next) => {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!types.includes(req.user.agent_type)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

export const authorizeCustomerTypes = (...allowedTypes) => {
  return (req, res, next) => {
    // Safety check: role must be customer
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    // Check customer_type
    if (!allowedTypes.includes(req.user.customer_type)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    next();
  };
};