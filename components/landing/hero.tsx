import { MacbookScroll } from '@/components/ui/macbook-scroll';

export default function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 mask-b-from-60% mask-b-to-90% bg-[url('/images/hero/1.jpg')] bg-cover bg-center bg-no-repeat bg-fixed" />
      <MacbookScroll />
    </div>
  );
}
