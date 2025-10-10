export async function names(fullname: string) {
  const firstname = fullname.split(/\s+/)[0] || 'Jambite';
  const lastname = fullname.split(/\s+/)[0] || 'Jambite';

  return [firstname, lastname, fullname];
}
