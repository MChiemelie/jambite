import { Achievements, Countdown, Greeting, Streak, Tracker, Words } from '@/components/dashboard';
import { SelectSubjects } from '@/components/forms';
import { getUserData } from '@/services';

export default async function DashboardPage() {
  const user = await getUserData();

  return (
    <div className="lg:h-full flex flex-col">
      <div className="bg-red-400 md:flex w-full px-4 gap-4 h-full">
        <div className="bg-yellow-400 flex md:flex-col gap-4 justify-between items-center lg:h-full">
          <div className="bg-sky-800 flex flex-col justify-between h-full w-full">
            <Greeting user={user} />
            <Countdown />
            <div className="lg:hidden">
              <Tracker />
            </div>
          </div>
          <Streak />
        </div>
        <div className="bg-orange-400 flex flex-col gap-4 w-full flex-1">
          <div className="hidden lg:block">
            <Tracker />
          </div>
          <div className="bg-green-400 flex-1 lg:flex gap-4">
            <SelectSubjects />
            <Words />
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-screen rounded bg-muted/50 px-4 m-4" />
    </div>
  );
}
