export interface User {
  id: string
  first_name: string
  last_name: string
  company_name: string
  ssn: string
}

export interface GetUsersParams {
  limit?: number
  offset?: number
  sortBy?: string // TODO: convert to Enum
  sortDesc?: boolean
}

export interface UserDto {
  id: string
  first_name: string
  last_name: string
  company_name: string
}

export interface AllUsersResponse {
  users: UserDto[]
  meta: {
    count: number
    total: number
    limit: number
    offset: number
  }
}
