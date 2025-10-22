import Image from 'next/image';

interface StatusWithProgressProps {
  image: string;
  desc1: string;
  desc2: string;
  progress?: number;
}

export default function StatusWithProgress({
  image,
  desc1,
  desc2,
  progress
}: StatusWithProgressProps) {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6 px-4 lg:gap-10">
        <Image
          priority
          src={image}
          alt="Descriptive status image"
          width={100}
          height={100}
          className="mx-auto w-[90%] lg:w-[50%]"
        />

        <div className="space-y-4">
          <h1 className="text-center text-sm">
            {desc1} <br className="lg:hidden" />
            {desc2}
          </h1>

          {progress !== undefined && (
            <div className="space-y-2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out dark:bg-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                {progress}% complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
