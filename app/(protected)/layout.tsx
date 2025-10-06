import { Sidebar } from '@/components/sidebar';
import { User } from '@/providers';
import { disableAI, getUserData } from '@/services';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserData();
  const { ai, trails } = user;

  if (!ai && !trails) {
    await disableAI();
  }

  return (
    <User>
      <Sidebar>{children}</Sidebar>
    </User>
  );
}