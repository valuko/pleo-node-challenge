import ExpenseQueryBuilder from './expense-query-builder';
import { query } from '@nc/utils/db';
import { ExpensesMetaParams, FilterExpensesParams } from '../types';

export function readExpense(expenseId) {
  return query('SELECT * FROM expenses WHERE id = $1', [expenseId])
    .then((response) => response.rows?.[0]);
}

export function getExpensesCount(filterParams: FilterExpensesParams) {
  const queryBuilder = new ExpenseQueryBuilder(filterParams);
  const sql = queryBuilder.getTotalCountQuery();
  const values = queryBuilder.conditionValues;
  return query(sql, values)
    .then((response) => response.rows[0].thecount);
}

export function getAllExpenses(filterParams: FilterExpensesParams, params: ExpensesMetaParams) {
  const queryBuilder = new ExpenseQueryBuilder(filterParams, params);
  const sql = queryBuilder.getResultsQuery();
  const values = queryBuilder.conditionValues;
  return query(sql, values)
    .then((response) => response.rows);
}
