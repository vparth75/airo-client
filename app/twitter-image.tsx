import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function Image() {
  const logoResponse = await fetch(
    new URL("../public/airo-logo.png", import.meta.url)
  );
  const logoBuffer = await logoResponse.arrayBuffer();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: 72,
        }}
      >
        <img
          src={logoBuffer as unknown as string}
          alt="AIRO 2026"
          style={{
            width: 120,
            height: 120,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            AIRO 2026
          </span>
          <span
            style={{
              color: "rgba(255, 255, 255, 0.72)",
              fontSize: 24,
              marginTop: 10,
            }}
          >
            AIRO 2026 • Mahindra University
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
