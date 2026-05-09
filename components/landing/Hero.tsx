import { HeroClient } from "@/components/landing/HeroClient";
import { getScanCount } from "@/lib/stats";

export async function Hero() {
  const scanCount = await getScanCount();
  return <HeroClient scanCount={scanCount} />;
}
