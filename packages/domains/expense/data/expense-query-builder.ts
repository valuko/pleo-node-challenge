import { ExpensesMetaParams, FilterExpensesParams } from '../types';

export default class ExpenseQueryBuilder {
  private _filterParams: FilterExpensesParams;
  private readonly _resultParams?: ExpensesMetaParams;
  private _conditions: string[];
  private _conditionValues: any[];

  constructor(filterParams: FilterExpensesParams, resultParams?: ExpensesMetaParams) {
    this._filterParams = filterParams;
    this._resultParams = resultParams;
    this._conditions = [];
    this._conditionValues = [];
  }

  get conditionValues(): any[] {
    return this._conditionValues;
  }

  private buildConditions() {
    this._conditions = [];
    this._conditionValues = [];

    if (this._filterParams.user_id) {
      this._conditionValues.push(this._filterParams.user_id);
      this._conditions.push(' user_id = $' + this._conditionValues.length);
    }
    if (this._filterParams.merchant_name) {
      this._conditionValues.push(`${this._filterParams.merchant_name}%`);
      this._conditions.push(' merchant_name ilike $' + this._conditionValues.length);
    }
    if (this._filterParams.status) {
      this._conditionValues.push(this._filterParams.status);
      this._conditions.push(' status = $' + this._conditionValues.length);
    }
    if (this._filterParams.currency) {
      this._conditionValues.push(this._filterParams.currency);
      this._conditions.push(' currency = $' + this._conditionValues.length);
    }
    if (typeof this._filterParams.min_amount !== 'undefined') {
      this._conditionValues.push(this._filterParams.min_amount);
      this._conditions.push(' amount_in_cents >= $' + this._conditionValues.length);
    }
    if (typeof this._filterParams.max_amount !== 'undefined') {
      this._conditionValues.push(this._filterParams.max_amount);
      this._conditions.push(' amount_in_cents <= $' + this._conditionValues.length);
    }
    if (this._filterParams.start_date) {
      this._conditionValues.push(this._filterParams.start_date.toISOString());
      this._conditions.push(' date_created >= $' + this._conditionValues.length);
    }
    if (this._filterParams.end_date) {
      this._conditionValues.push(this._filterParams.end_date);
      this._conditions.push(' date_created <= $' + this._conditionValues.length);
    }
  }

  getTotalCountQuery() {
    this.buildConditions();
    let query = 'SELECT count("id") as thecount FROM expenses';
    if (this._conditions.length > 0) {
      const conditionString = this._conditions.join(' AND ');
      query += ` WHERE ${conditionString}`;
    }

    return query;
  }

  getResultsQuery() {
    if (!this._resultParams) {
      throw new Error('Result params field must be provided');
    }

    this.buildConditions();

    let query = 'SELECT * FROM expenses';
    if (this._conditions.length > 0) {
      const conditionString = this._conditions.join(' AND ');
      query += ` WHERE ${conditionString}`;
    }

    if (this._resultParams.sortBy) {
      query += ` ORDER BY ${this._resultParams.sortBy}`;
      query += this._resultParams.sortDesc ? ' DESC' : ' ASC';
    }
    if (this._resultParams.limit > 0) {
      query += ` LIMIT ${this._resultParams.limit}`;
      if (this._resultParams.offset) query += ` OFFSET ${this._resultParams.offset}`;
    }

    return query;
  }
}
