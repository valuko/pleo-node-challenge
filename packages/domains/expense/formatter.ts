import { FormattedExpense } from './types';

export function format(rawExpense): FormattedExpense {
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
