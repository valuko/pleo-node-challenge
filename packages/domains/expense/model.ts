import { format } from './formatter';
import { FormattedExpense } from './types';
import { readExpense } from './data/db-expense';
import { to } from '@nc/utils/async';
import { BadRequest, InternalError, NotFound } from '@nc/utils/errors';

export async function getExpenseDetails(expenseId): Promise<FormattedExpense> {
  if (!expenseId) {
    throw BadRequest('expenseId property is missing.');
  }

  const [dbError, rawExpense] = await to(readExpense(expenseId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawExpense) {
    throw NotFound(`Could not find expense with id ${expenseId}`);
  }

  return format(rawExpense);
}
