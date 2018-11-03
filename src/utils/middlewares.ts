import { NextFunction, Request, Response } from 'express';
import { AuthenticationError } from '../errors/authenticationError';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.id) {
    return next();
  }

  const err = new AuthenticationError('You must be logged in to view this page.');
  err.statusCode = 403;
  return next(err);
};
