import { Plans } from '@/components/payments';

export default function Pricing() {
  return (
    <div className='flex flex-col gap-8 px-2 sm:px-4 md:px-8 lg:px-10'>
      <h2 className='mx-auto w-[80%] max-w-4xl text-center text-xl font-semibold sm:text-2xl md:text-4xl'>
        Get <span className='bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-500 dark:to-cyan-400'>Real Value</span> for less
      </h2>
      <p className='mx-auto mt-4 max-w-xl text-center'>Excellence starts with preparing with the right resources. Choose a plan that provides you with everything you need to prepare smart and succeed.</p>
      <Plans />
    </div>
  );
}
