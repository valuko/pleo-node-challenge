export interface Expense {
    id: string
    merchant_name: string
    amount_in_cents: number
    currency: string
    status: string
    date_created: Date
    user_id: string
}

export interface User {
    id: string
    first_name: string
    last_name: string
    company_name: string
    ssn: string
}

export interface FormattedExpense {
    id: string
    merchant_name: string
    amount_in_cents: number
    amount: number
    currency: string
    status: string
    date_created: Date
    user_id: string
    user?: User
}
