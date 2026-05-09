import { ImageResponse } from "next/og";

import { BRAND } from "@/lib/brand";

export const runtime = "edge";

export const alt = `${BRAND.name} — диагностика сайтов`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 72,
          background: "#fafaf7",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#4fd1c5",
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 600, color: "#1a1a1a" }}>
            {BRAND.name}
          </span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1,
            color: "#1a1a1a",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Узнайте, почему ваш сайт теряет клиентов
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: "#5c5c5c",
            maxWidth: 820,
            lineHeight: 1.35,
          }}
        >
          Бесплатный экспресс-диагноз. Без регистрации.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
