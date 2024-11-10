import { Nav, Features, Hero, Testimonials, Join, Footer } from '@/layout';

export default function Page() {
  return (
    <div className="space-y-10">
      <Hero />
      <Features />
      <Testimonials />
      <Join />
      <Footer />
    </div>
  );
}
