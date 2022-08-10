import {ApiError, BadRequest} from '@nc/utils/errors';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { ExpensesMetaParams, FilterExpensesParams } from '../types';
import { formatToExpenseDto, formatAllExpensesResponse } from '../formatter';
import { getExpenseDetails, getExpenses } from '../model';
import { query, validationResult } from 'express-validator';

export const router = Router();

const DEFAULT_LIMIT = 100;

const buildFilterExpensesParams = (rawParams: Record<string, any>): FilterExpensesParams => {
  const filterParams: FilterExpensesParams = {};
  if (rawParams.user_id) filterParams.user_id = rawParams.user_id as string;
  if (rawParams.merchant_name) filterParams.merchant_name = rawParams.merchant_name as string;
  if (rawParams.currency) filterParams.currency = rawParams.currency as string;
  if (rawParams.status) filterParams.status = rawParams.status as string;
  if (typeof rawParams.min_amount !== 'undefined') {
    const minAmount = parseInt(rawParams.min_amount as string, 10);
    if (!isNaN(minAmount)) filterParams.min_amount = minAmount;
  }
  if (typeof rawParams.max_amount !== 'undefined') {
    const maxAmount = parseInt(rawParams.max_amount as string, 10);
    if (!isNaN(maxAmount)) {
      if (filterParams.min_amount && maxAmount < filterParams.min_amount) {
        throw new Error('max_amount must be greater than min_amount');
      }
      filterParams.max_amount = maxAmount;
    }
  }
  if (rawParams.start_date) {
    const dateInt = Date.parse(rawParams.start_date as string);
    if (!isNaN(dateInt)) filterParams.start_date = new Date(dateInt);
  }
  if (rawParams.end_date) {
    const endDateInt = Date.parse(rawParams.end_date as string);
    if (!isNaN(endDateInt)) {
      if (filterParams.start_date && endDateInt < filterParams.start_date.getTime()) {
        throw new Error('end_date must be after start_date');
      }
      filterParams.end_date = new Date(endDateInt);
    }
  }

  return filterParams;
};

const buildExpensesMetaParams = (rawParams: Record<string, any>): ExpensesMetaParams => {
  const params: ExpensesMetaParams = {};
  if (rawParams.limit) {
    const limitInt = parseInt(rawParams.limit as string, 10);
    if (limitInt !== -1) {
      if (isNaN(limitInt) || limitInt > DEFAULT_LIMIT || limitInt < 0) {
        params.limit = DEFAULT_LIMIT;
      } else {
        params.limit = limitInt;
      }
    }
  } else {
    params.limit = DEFAULT_LIMIT;
  }
  if (rawParams.offset) {
    const offset = parseInt(rawParams.offset);
    if (!isNaN(offset) && offset > 0) params.offset = offset;
  } else {
    params.offset = 0;
  }

  if (rawParams.sort_by) {
    params.sortBy = rawParams.sort_by as string;
    if (rawParams.sort_order) params.sortDesc = rawParams.sort_order === 'DESC';
  } else {
    params.sortBy = 'date_created';
    params.sortDesc = true;
  }
  return params;
};

router.get('/get-expense-details', async (req, res, next) => {
  const [expenseError, expense] = await to(getExpenseDetails(req.query?.expense_id));

  if (expenseError) {
    return next(new ApiError(expenseError, expenseError.status, `Could not get expense details: ${expenseError}`, expenseError.title, req));
  }

  if (!expense) {
    return res.json({});
  }

  return res.json(formatToExpenseDto(expense));
});

router.get(
  '/get-all-expenses',
  query('user_id')
    .optional()
    .isString()
    .trim(),
  query('merchant_name')
    .optional()
    .isString()
    .trim(),
  query('currency')
    .optional()
    .isString()
    .trim(),
  query('status')
    .optional()
    .isString()
    .trim(),
  query('start_date')
    .optional()
    .isDate()
    .trim(),
  query('end_date')
    .optional()
    .isDate()
    .trim(),
  query('min_amount')
    .optional()
    .isNumeric()
    .toInt(),
  query('max_amount')
    .optional()
    .isNumeric()
    .toInt(),
  query('sort_by')
    .optional()
    .isString()
    .trim(),
  query('sort_order')
    .optional()
    .isString()
    .isIn(['ASC', 'DESC'])
    .trim(),
  query('offset')
    .optional()
    .isNumeric()
    .toInt(),
  query('limit')
    .optional()
    .isNumeric()
    .toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.array() });
    }

    const {
      user_id,
      merchant_name,
      currency,
      start_date,
      end_date,
      min_amount,
      max_amount,
      status,
      sort_by,
      sort_order,
      offset,
      limit,
    } = req.query;

    let filterParams: FilterExpensesParams;
    let metaParams: ExpensesMetaParams;
    try {
      filterParams = buildFilterExpensesParams({
        user_id,
        merchant_name,
        currency,
        start_date,
        end_date,
        min_amount,
        max_amount,
        status,
      });
      metaParams = buildExpensesMetaParams({
        sort_by,
        sort_order,
        offset,
        limit,
      });
    } catch (e) {
      return next(BadRequest(`Validation error: ${e.message}`, req));
    }

    const [userError, result] = await to(getExpenses(filterParams, metaParams));

    if (userError) {
      return next(new ApiError(userError, userError.status, `Error while loading all expenses: ${userError}`, userError.title, req));
    }

    const [expenses, total] = result;
    return res.json(formatAllExpensesResponse(expenses, total, metaParams.limit, metaParams.offset));
  }
);
