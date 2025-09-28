import { Greeting, Streak, Tracker, Words } from '@/components/dashboard';
import { SelectSubjects } from '@/components/forms';
import { getUserData } from '@/services';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUserData();

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex flex-col lg:flex-row w-full gap-4 h-full justify-center">
        <div className="flex lg:flex-col gap-4 justify-evenly items-center mx-auto lg:h-full">
          <div className="flex flex-col items-center justify-evenly h-full">
            <Greeting user={user} />
            <div className="lg:hidden">
              <Tracker />
            </div>
          </div>
          <Streak />
        </div>
        <div className="flex flex-col gap-4 w-full flex-1">
          <div className="hidden lg:block">
            <Tracker />
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <SelectSubjects />
            <Words />
          </div>
        </div>
      </div>
      {/* <div className="flex-1 min-h-screen rounded bg-muted/50 px-4" /> */}
      {/* <Leaderboard /> */}
    </div>
  );
}
