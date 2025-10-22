import { HeroSection } from '@/components/landing';

export default function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/assets/background.svg')] bg-[length:40px_40px] bg-repeat lg:bg-[length:80px_80px]" />
      <div className="absolute inset-0 hidden bg-[url('/images/hero/student_practicing_jamb_cbt_with_ai.jpg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat md:block" />
      <HeroSection />
    </div>
  );
}
