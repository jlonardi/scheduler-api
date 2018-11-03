import { ErrorRequestHandler } from 'express-serve-static-core';

export const getFinalErrorHandler = (isDevEnv: boolean, logger: any): ErrorRequestHandler => {
  const safeLogError = (err: Error) =>
    logger.error(err && err.toString && err.toString() || 'Unknown error', err && err.message, err && err.stack, {});

  // The production error handler avoids leaking data to the user
  const errorJson = (err: Error) =>
    isDevEnv ?
      ({ message: err.message, error: err }) :
      ({ message: '', error: {} });

  // Never calls next; this is the end of the line
  return (err, req, res, next) => {
    const { status = 500 } = err;

    if (status === 401) {
      res.set('WWW-Authenticate', 'Bearer');
    }

    safeLogError(err);
    res.status(status).json(errorJson(err));
  };
};
