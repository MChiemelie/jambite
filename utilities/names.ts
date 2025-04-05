import { getUserAuth } from '@/services';

export async function names() {
  const user = await getUserAuth();
  const { name } = user;
  const firstname = name.split(/\s+/)[0] || 'Jambite';
  const lastname = name.split(/\s+/)[0] || 'Jambite';
  const fullname = name;

  return [firstname, lastname, fullname];
}
