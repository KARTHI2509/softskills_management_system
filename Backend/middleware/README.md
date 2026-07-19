# Backend Middlewares

## Purpose
Intercepts HTTP requests prior to controller processing to validate tokens, enforce security, audit endpoints, or format errors.

## Files
- `authMiddleware.js`: Checks JWT signature and attaches current user claims to the request.
- `roleMiddleware.js`: Restricts route access to specific list of user roles.
- `loggingMiddleware.js`: Simple request request audit logging.
- `errorHandler.js`: Intercepts system errors, returning structured error response formatting.

## Responsibilities
- Secure route gates.
- Handle role-based validation.
- Standardize runtime errors.
