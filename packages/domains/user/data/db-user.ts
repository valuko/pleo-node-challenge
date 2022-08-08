import { GetUsersParams } from '../types';
import { query } from '@nc/utils/db';

export function readUser(userId) {
  return query('SELECT * FROM users WHERE id = $1', [userId])
    .then((response) => response.rows?.[0]);
}

export function getUsers(params: GetUsersParams) {
  let queryString = 'SELECT * FROM users';
  const queryParams = [];
  if (params.sortBy) {
    queryString += ` ORDER BY ${params.sortBy}`;
    queryString += params.sortDesc ? ' DESC' : ' ASC';
  }
  if (params.limit > 0) {
    queryString += ` LIMIT ${params.limit}`;
    if (params.offset) queryString += ` OFFSET ${params.offset}`;
  }
  return query(queryString, queryParams)
    .then((response) => response.rows);
}

export function getUsersCount() {
  return query('SELECT count("id") as thecount FROM users')
    .then((response) => response.rows[0].thecount);
}
