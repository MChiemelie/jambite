import { MacbookScroll } from '@/components/ui/macbook-scroll';

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="mask-b-from-20% mask-b-to-80% bg-[url(/images/hero/1.jpg)] bg-cover bg-center bg-no-repeat" />

      <div className="relative flex items-center justify-center h-full">
        {/* <MacbookScroll /> */}
      </div>
    </div>
  );
}
