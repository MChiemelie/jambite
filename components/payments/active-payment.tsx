import type { User } from '@/types';

export default function ActivePayment({ user }: { user: User }) {
  const { trials, ai } = user;

  if (trials === 0) {
    return;
  }

  return (
    <div className='overflow-x-auto w-[90%] md:w-[60%] lg:w-[40%] mx-auto'>
      <table className='min-w-full border-collapse border rounded border-gray-300 text-sm md:text-lg'>
        <thead>
          <tr>
            <th className='px-2 py-1 md:px-4 md:py-2 border border-gray-300 text-center '>Payment Status</th>
            <th className='px-2 py-1 md:px-4 md:py-2 border border-gray-300 text-center'>Trials</th>
            <th className='px-2 py-1 md:px-4 md:py-2 border border-gray-300 text-center'>AI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='px-2 py-1 md:px-4 md:py-2 border border-gray-300 text-center'>Active</td>
            <td className='px-2 py-1 md:px-4 md:py-2 border border-gray-300 text-center'>{trials}</td>
            <td className='px-2 py-1 md:px-4 md:py-2 border border-gray-300 text-center'>{ai ? 'Enabled' : 'Disabled'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
