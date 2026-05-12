"use client";

import { motion, useReducedMotion } from "framer-motion";

import { HeroRobot } from "@/components/shared/HeroRobot";
import { UrlForm } from "@/components/landing/UrlForm";
import { Reveal } from "@/components/landing/motion";

type Props = {
  scanCount: number;
};

export function HeroClient({ scanCount }: Props) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="hero"
      className="scroll-mt-24 py-16 lg:scroll-mt-28 lg:py-24"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex w-full flex-col items-center lg:order-2 lg:w-[520px] lg:max-w-[48%]">
            <HeroRobot />
            <motion.p
              className="mt-4 w-full text-center text-sm text-[var(--text-muted)] lg:mt-4"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 22 },
                    animate: { opacity: 1, y: 0 },
                    transition: {
                      duration: 0.6,
                      delay: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  })}
            >
              Сегодня осмотрено:{" "}
              <span className="font-mono font-medium text-[var(--text-primary)]">
                {scanCount.toLocaleString("ru-RU")}
              </span>{" "}
              сайтов
            </motion.p>
          </div>

          <div className="w-full flex-1 text-center lg:order-1 lg:text-left">
            <Reveal>
              <h1
                id="hero-heading"
                className="font-display text-[32px] font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[40px] lg:text-[56px] xl:text-[64px]"
              >
                Узнайте, почему ваш сайт теряет клиентов
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[19px] leading-relaxed text-[var(--text-secondary)] lg:mx-0">
                Введите адрес сайта — за 60 секунд получите диагноз: что отпугивает
                посетителей, где ломается доверие и что переписать в первую очередь.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <UrlForm
                className="mx-auto max-w-xl lg:mx-0 lg:mr-auto"
                centerMicroOnMobile
                createScan
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
