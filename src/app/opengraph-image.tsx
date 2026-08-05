import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Preserve property care";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "Arial, sans-serif",
          padding: 72,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            background: "#ffffff",
            border: "4px solid #dbeafe",
            borderRadius: 36,
            padding: 44,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: 112,
                height: 112,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 24,
                background: "#1d4ed8",
                color: "#ffffff",
                fontSize: 76,
                fontWeight: 800,
              }}
            >
              P
            </div>
            <div
              style={{
                marginTop: 48,
                color: "#0f172a",
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: 0,
              }}
            >
              Preserve
            </div>
            <div
              style={{
                marginTop: 22,
                color: "#334155",
                fontSize: 34,
                fontWeight: 500,
              }}
            >
              Property preservation, handled from anywhere.
            </div>
            <div
              style={{
                marginTop: 28,
                maxWidth: 760,
                color: "#64748b",
                fontSize: 26,
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              Lawn care, inspections, cleaning, repairs, and photo reports for
              remote owners and investors.
            </div>
          </div>
          <div
            style={{
              width: 240,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 42,
            }}
          >
            <div
              style={{
                width: 194,
                height: 194,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 28,
                background: "#dbeafe",
                color: "#1d4ed8",
                fontSize: 98,
                fontWeight: 800,
              }}
            >
              P
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 194,
                height: 68,
                borderRadius: 18,
                background: "#1d4ed8",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              Sign In
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
