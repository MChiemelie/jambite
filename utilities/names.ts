import { getUserAuth } from '@/services';
import { UserAuth } from '@/types';

export async function names() {
  const user = await getUserAuth() as UserAuth;
  const { name } = user;
  const firstname = name.split(/\s+/)[0] || 'Jambite';
  const lastname = name.split(/\s+/)[0] || 'Jambite';
  const fullname = name;

  return [firstname, lastname, fullname];
}
