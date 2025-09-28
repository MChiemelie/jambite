import { Plans } from '@/components/payments';

export default function Pricing() {
  return (
    <div className=" px-2 sm:px-4 md:px-8 lg:px-10 flex flex-col gap-8">
      <h2 className="max-w-4xl text-center mx-auto font-semibold text-xl sm:text-2xl md:text-4xl w-[80%]">
        Our <span className="bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400">Pricing</span>
      </h2>

      <p className="text-center max-w-xl mx-auto mt-4">Excellence starts with preparing with the right resources. Choose a plan that provides you with everything you need to prepare smart and succeed.</p>

      <Plans />
    </div>
  );
}
