export interface Expense {
    id: string
    merchant_name: string
    amount_in_cents: number
    currency: string
    status: string
    date_created: Date
    user_id: string
}

export interface ExpenseDto {
    id: string
    merchant_name: string
    amount_in_cents: number
    amount: number
    currency: string
    status: string
    date_created: Date
    user_id: string
}

export interface ExpensesMetaParams {
    limit?: number
    sortBy?: string // TODO: convert to Enum
    sortDesc?: boolean
    offset?: number
}

export interface FilterExpensesParams {
    merchant_name?: string
    min_amount?: number
    max_amount?: number
    currency?: string
    status?: string
    user_id?: string
    start_date?: Date
    end_date?: Date
}

export interface AllExpensesResponse {
    expenses: Expense[]
    meta: {
        count: number
        total: number
        limit: number
        offset: number
    }
}
