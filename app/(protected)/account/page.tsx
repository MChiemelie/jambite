import { Account } from '@/components/forms';
import { getUserData } from '@/services';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getUserData();
  return <Account user={user} />;
}
