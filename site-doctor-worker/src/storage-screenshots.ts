import { supabase } from "./supabase.js";

const BUCKET = process.env.SCAN_SCREENSHOTS_BUCKET ?? "scan-screenshots";

export async function uploadScanScreenshots(
  scanId: string,
  desktopPng: Buffer,
  mobilePng: Buffer
): Promise<{ desktopUrl: string; mobileUrl: string }> {
  const deskPath = `${scanId}/desktop.png`;
  const mobPath = `${scanId}/mobile.png`;

  const { error: upDesk } = await supabase.storage
    .from(BUCKET)
    .upload(deskPath, desktopPng, {
      contentType: "image/png",
      upsert: true,
    });
  if (upDesk) throw upDesk;

  const { error: upMob } = await supabase.storage
    .from(BUCKET)
    .upload(mobPath, mobilePng, {
      contentType: "image/png",
      upsert: true,
    });
  if (upMob) throw upMob;

  const {
    data: { publicUrl: desktopUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(deskPath);
  const {
    data: { publicUrl: mobileUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(mobPath);

  return { desktopUrl, mobileUrl };
}
