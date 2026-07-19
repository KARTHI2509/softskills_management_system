/*
------------------------------------------------
File: roleMiddleware.js
Purpose: Restricts route access using role parameters.
Responsibilities: Confirms that req.user.role matches allowed parameters.
Dependencies: authMiddleware
------------------------------------------------
*/

/*
Role verification middleware generator.
Params: ...allowedRoles (roles that can view the resource).
Returns: Middleware function.
*/
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized, no credentials binding' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }

    return next();
  };
};

module.exports = { authorize };
