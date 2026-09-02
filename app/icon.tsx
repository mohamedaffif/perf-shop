import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111111",
        color: "#f6f4f0",
        fontSize: 300,
        fontWeight: 600,
        fontFamily: "Georgia, serif",
        letterSpacing: "-0.05em",
      }}
    >
      D
    </div>,
    { ...size }
  );
}
