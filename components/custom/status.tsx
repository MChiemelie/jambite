import Image from 'next/image';

export default function Status({ image, desc1, desc2 }: { image: string; desc1: string; desc2: string }) {
  return (
    <div className='flex min-h-svh items-center justify-center'>
      <div className='flex flex-col gap-6 lg:gap-10'>
        <Image priority src={image} alt='Descriptive status image' width={100} height={100} className='mx-auto w-[90%] lg:w-[50%]' />
        <h1 className='text-center text-sm'>
          {desc1} <br className='lg:hidden' />
          {desc2}
        </h1>
      </div>
    </div>
  );
}
