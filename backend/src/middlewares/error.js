import { validationResult } from 'express-validator';
import { fail } from '../utils/response.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 422, errors.array()[0].msg);
  next();
};

export const notFound = (req, res) => fail(res, 404, 'Khong tim thay API');

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  fail(res, err.status || 500, err.message || 'Loi may chu');
};
