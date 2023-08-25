import { Nav, Hero, Features, Testimonials, Join, Footer } from "@/components";

export default function Home () {
  return (
    <div className='space-y-10'>
      <Nav />
      <Hero />
      <Features />
      <Testimonials />
      <Join />
      <Footer />
    </div>
  );
}