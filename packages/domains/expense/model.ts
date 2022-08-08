import { formatExpense } from './formatter';
import { to } from '@nc/utils/async';
import { BadRequest, InternalError, NotFound } from '@nc/utils/errors';
import { Expense, ExpensesMetaParams, FilterExpensesParams } from './types';
import { getAllExpenses, getExpensesCount, readExpense } from './data/db-expense';

export async function getExpenseDetails(expenseId): Promise<Expense> {
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

  return rawExpense;
}

export async function getExpenses(
  filterParams: FilterExpensesParams,
  resultsParams: ExpensesMetaParams
): Promise<[Expense[], number]> {
  const [countError, totalCount] = await to(getExpensesCount(filterParams));
  if (countError) {
    throw InternalError(`Error fetching data from the DB: ${countError.message}`);
  }
  const [dbError, rawExpenses] = await to(getAllExpenses(filterParams, resultsParams));
  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  const total = parseInt(totalCount, 10);
  const expenses = rawExpenses.map(formatExpense);
  return [expenses, total];
}
