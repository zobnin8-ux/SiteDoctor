"use client";

import Image from "next/image";
import { useState } from "react";

import { RobotPlaceholder } from "@/components/shared/RobotPlaceholder";
import { ASSETS } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function ScanningRobot({ className }: { className?: string }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={cn(
          "relative mx-auto h-60 w-60 sm:h-[320px] sm:w-[320px]",
          className
        )}
      >
        <RobotPlaceholder fillContainer variant="scanning" className="scanning-robot" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative mx-auto h-60 w-60 sm:h-[320px] sm:w-[320px]", className)}
    >
      <div
        className="scanning-ring pointer-events-none absolute inset-0 scale-110"
        aria-hidden
      />
      <Image
        src={ASSETS.robot.scanning}
        alt=""
        width={320}
        height={320}
        className="scanning-robot relative z-[1] mx-auto h-full w-full object-contain"
        priority
        onError={(e) => {
          console.warn(
            "Scanning robot image failed to load:",
            ASSETS.robot.scanning,
            e
          );
          setImageError(true);
        }}
      />
    </div>
  );
}
