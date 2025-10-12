import { HeroSection } from '@/components/landing';

export default function Hero() {
  return (
    <div className='relative'>
      <div className="hidden md:block absolute inset-0 bg-[url('/images/hero/student_practicing_jamb_cbt_with_ai.jpg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed" />
      <div className="md:hidden absolute inset-0 bg-[url('/assets/background.svg')] bg-repeat bg-[length:40px_40px] lg:bg-[length:80px_80px]" />
      <HeroSection />
    </div>
  );
}
