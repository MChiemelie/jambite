import Image from 'next/image';

export default function Status({ image, desc1, desc2 }: { image: string; desc1: string; desc2: string }) {
  return (
    <div className="min-h-svh flex justify-center items-center">
      <div className="flex flex-col gap-6 lg:gap-10">
        <Image src={image} alt="Page Image" width={100} height={100} className="mx-auto w-[90%] lg:w-[50%]" />
        <p className="text-sm text-center">
          {desc1}. <br className="lg:hidden" />
          {desc2}
        </p>
      </div>
    </div>
  );
}
