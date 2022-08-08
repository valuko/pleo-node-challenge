import { format } from './formatter';
import { to } from '@nc/utils/async';
import { BadRequest, InternalError, NotFound } from '@nc/utils/errors';
import { getUsers, getUsersCount, readUser } from './data/db-user';
import { GetUsersParams, User } from './types';

export async function getUserDetails(userId): Promise<User> {
  if (!userId) {
    throw BadRequest('userId property is missing.');
  }

  const [dbError, rawUser] = await to(readUser(userId));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  if (!rawUser) {
    throw NotFound(`Could not find user with id ${userId}`);
  }

  return format(rawUser);
}

export async function getAllUsers(params: GetUsersParams): Promise<[User[], number]> {
  const [countError, totalCount] = await to(getUsersCount());
  if (countError) {
    throw InternalError(`Error fetching data from the DB: ${countError.message}`);
  }
  const [dbError, rawUsers] = await to(getUsers(params));
  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  const total = parseInt(totalCount, 10);
  const formattedUsers = rawUsers.map((user: User) => format(user));
  return [formattedUsers, total];
}
