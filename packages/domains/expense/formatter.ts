import { AllExpensesResponse, Expense, ExpenseDto } from './types';

export function formatToExpenseDto(rawExpense): ExpenseDto {
  return {
    id: rawExpense.id,
    merchant_name: rawExpense.merchant_name,
    amount_in_cents: rawExpense.amount_in_cents,
    amount: rawExpense.amount_in_cents / 100,
    user_id: rawExpense.user_id,
    currency: rawExpense.currency,
    date_created: new Date(rawExpense.date_created),
    status: rawExpense.status,
    // TODO: Include the user here
  };
}

export function formatExpense(rawExpense): Expense {
  return {
    id: rawExpense.id,
    merchant_name: rawExpense.merchant_name,
    amount_in_cents: rawExpense.amount_in_cents,
    user_id: rawExpense.user_id,
    currency: rawExpense.currency,
    date_created: new Date(rawExpense.date_created),
    status: rawExpense.status,
  };
}

export function formatAllExpensesResponse(expenses: Expense[], total: number, limit: number, offset: number): AllExpensesResponse {
  return {
    expenses,
    meta: {
      count: expenses.length,
      total,
      limit,
      offset,
    },
  };
}
