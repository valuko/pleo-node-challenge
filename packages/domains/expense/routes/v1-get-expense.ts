import { ApiError } from '@nc/utils/errors';
import { getExpenseDetails } from '../model';
import { Router } from 'express';
import { to } from '@nc/utils/async';

export const router = Router();

router.get('/get-expense-details', async (req, res, next) => {
  const [expenseError, expenseDetails] = await to(getExpenseDetails(req.query?.expenseId));

  if (expenseError) {
    return next(new ApiError(expenseError, expenseError.status, `Could not get expense details: ${expenseError}`, expenseError.title, req));
  }

  if (!expenseDetails) {
    return res.json({});
  }

  return res.json(expenseDetails);
});
