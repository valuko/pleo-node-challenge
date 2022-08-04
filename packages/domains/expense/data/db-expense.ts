import { query } from '@nc/utils/db';

export function readExpense(expenseId) {
  return query('SELECT * FROM expenses WHERE id = $1', [expenseId])
    .then((response) => response.rows?.[0]);
}
