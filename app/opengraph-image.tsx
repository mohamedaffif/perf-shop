import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DE PERFUME SHOP — Signature Fragrances";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#111111",
        color: "#f6f4f0",
        fontFamily: "Georgia, serif",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "0.08em" }}>DE PERFUME SHOP</div>
      <div style={{ fontSize: 32, color: "#b9b2a8", letterSpacing: "0.04em" }}>
        Signature Fragrances
      </div>
    </div>,
    { ...size }
  );
}
