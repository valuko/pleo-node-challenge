import { ApiError } from '@nc/utils/errors';
import { GetUsersParams } from '../types';
import { Router } from 'express';
import { to } from '@nc/utils/async';
import { buildUserDto, formatAllUsersResponse } from '../formatter';
import { getAllUsers, getUserDetails } from '../model';
import { query, validationResult } from 'express-validator';

export const router = Router();
const DEFAULT_LIMIT = 100;

router.get('/get-user-details', async (req, res, next) => {
  const [userError, userDetails] = await to(getUserDetails(req.query?.userId));

  if (userError) {
    return next(new ApiError(userError, userError.status, `Could not get user details: ${userError}`, userError.title, req));
  }

  if (!userDetails) {
    return res.json({});
  }

  return res.json(buildUserDto(userDetails));
});

router.get(
  '/get-all-users',
  query('sort')
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

    const reqParams: GetUsersParams = {
      offset: 0,
    };
    const { offset, sort_by, sort_order, limit } = req.query;

    if (limit) {
      const limitInt = parseInt(limit as string, 10);
      if (limitInt !== -1) {
        if (isNaN(limitInt) || limitInt > DEFAULT_LIMIT || limitInt < 0) {
          reqParams.limit = DEFAULT_LIMIT;
        } else {
          reqParams.limit = limitInt;
        }
      }
    } else {
      reqParams.limit = DEFAULT_LIMIT;
    }
    if (offset) reqParams.offset = parseInt(offset as string, 10);
    if (sort_by) reqParams.sortBy = sort_by as string;
    if (sort_order) reqParams.sortDesc = sort_order === 'DESC';

    const [userError, result] = await to(getAllUsers(reqParams));

    if (userError) {
      return next(new ApiError(userError, userError.status, `Error while loading all users: ${userError}`, userError.title, req));
    }

    const [users, total] = result;
    return res.json(formatAllUsersResponse(users, total, reqParams.limit, reqParams.offset));
  }
);
