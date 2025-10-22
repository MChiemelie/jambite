import { Greeting, Streak, Tracker, Words } from '@/components/dashboard';
import { SelectSubjects } from '@/components/forms';
import { getUserData } from '@/services';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUserData();

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex h-full w-full flex-col justify-center gap-4 lg:flex-row">
        <div className="mx-auto flex flex-col items-center justify-around gap-4 md:flex-row lg:h-full lg:flex-col">
          <div className="flex h-full flex-col items-center justify-evenly">
            <Greeting user={user} />
            <div className="lg:hidden">
              <Tracker />
            </div>
          </div>
          <Streak />
        </div>
        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="hidden lg:block">
            <Tracker />
          </div>
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <SelectSubjects />
            <Words />
          </div>
        </div>
      </div>
    </div>
  );
}
