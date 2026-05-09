"use client";

import Image from "next/image";
import { useState } from "react";

import { RobotPlaceholder } from "@/components/shared/RobotPlaceholder";
import { ASSETS } from "@/lib/assets";

export function HeroRobot() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return <RobotPlaceholder size={520} variant="hero" className="mx-auto" />;
  }

  return (
    <div className="robot-hero-container relative mx-auto w-[280px] sm:w-[320px] lg:w-[520px]">
      <Image
        src={ASSETS.robot.hero}
        alt="Site Doctor — AI-диагност сайтов"
        width={520}
        height={520}
        priority
        className="robot-glow h-auto w-full max-w-[520px] object-contain"
        sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 520px"
        onError={(e) => {
          console.warn("Hero robot image failed to load:", ASSETS.robot.hero, e);
          setImageError(true);
        }}
      />
    </div>
  );
}
