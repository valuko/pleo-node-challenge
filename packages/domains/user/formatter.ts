import { AllUsersResponse, User, UserDto } from './types';

const publicFields = ['first_name', 'last_name', 'company_name'];

export function capitalize(word) {
  const str = `${word}`;
  return str[0].toUpperCase() + str.slice(1);
}

// Deprecated: Does not format the JSON response correctly enough
export function secureTrim(user: User): string {
  return JSON.stringify(user, publicFields);
}

export function format(rawUser): User {
  return {
    id: rawUser.id,
    first_name: capitalize(rawUser.first_name),
    last_name: capitalize(rawUser.last_name),
    company_name: rawUser.company_name,
    ssn: rawUser.ssn,
  };
}

export function buildUserDto(user: User): UserDto {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    company_name: user.company_name,
  };
}

export function formatAllUsersResponse(users: User[], total: number, limit: number, offset: number): AllUsersResponse {
  return {
    users: users.map(buildUserDto),
    meta: {
      count: users.length,
      total,
      limit,
      offset,
    }
  };
}
