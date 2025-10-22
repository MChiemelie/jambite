import type { User } from '@/types';

export default function ActivePayment({ user }: { user: User }) {
  const { trials, ai } = user;

  if (trials === 0) {
    return;
  }

  return (
    <div className='mx-auto w-[90%] overflow-x-auto md:w-[60%] lg:w-[40%]'>
      <table className='min-w-full border-collapse rounded border border-gray-300 text-sm md:text-lg'>
        <thead>
          <tr>
            <th className='border border-gray-300 px-2 py-1 text-center md:px-4 md:py-2'>Payment Status</th>
            <th className='border border-gray-300 px-2 py-1 text-center md:px-4 md:py-2'>Trials</th>
            <th className='border border-gray-300 px-2 py-1 text-center md:px-4 md:py-2'>AI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='border border-gray-300 px-2 py-1 text-center md:px-4 md:py-2'>Active</td>
            <td className='border border-gray-300 px-2 py-1 text-center md:px-4 md:py-2'>{trials}</td>
            <td className='border border-gray-300 px-2 py-1 text-center md:px-4 md:py-2'>{ai ? 'Enabled' : 'Disabled'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
