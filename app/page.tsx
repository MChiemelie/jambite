import { Background, Footer, Hero, Nav, Steps, Pricing, Stake, Values } from '@/components/landing';

export default function LandingPage() {
  return (
    <>
      <Background />
      <header>
        <Nav />
        <Hero />
      </header>
      <main className="flex flex-col gap-20">
        <Stake />
        <Values />
        <Steps />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
