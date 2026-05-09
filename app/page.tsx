import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhatYouGet } from "@/components/landing/WhatYouGet";
import { SampleReport } from "@/components/landing/SampleReport";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ForWhom } from "@/components/landing/ForWhom";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatYouGet />
        <SampleReport />
        <HowItWorks />
        <ForWhom />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
