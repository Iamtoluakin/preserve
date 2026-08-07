import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PreserveHQ property care and preservation operations";
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
          background: "#0f172a",
          fontFamily: "Arial, sans-serif",
          padding: 48,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 34,
            background: "#ffffff",
            borderRadius: 42,
            padding: 44,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 510,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  background: "#2563eb",
                  color: "#ffffff",
                  fontSize: 48,
                  fontWeight: 800,
                }}
              >
                P
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ color: "#0f172a", fontSize: 36, fontWeight: 800 }}>
                  PreserveHQ
                </div>
                <div style={{ color: "#64748b", fontSize: 18, fontWeight: 700 }}>
                  Managed property operations
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#0f172a",
                  fontSize: 82,
                  lineHeight: 0.9,
                  fontWeight: 900,
                  letterSpacing: 0,
                }}
              >
                Property care. Handled.
              </div>
              <div
                style={{
                  marginTop: 28,
                  color: "#475569",
                  fontSize: 28,
                  lineHeight: 1.25,
                  fontWeight: 500,
                }}
              >
                From one home to an entire portfolio, PreserveHQ coordinates trusted local professionals to keep properties cared for.
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              flex: 1,
              display: "flex",
              overflow: "hidden",
              borderRadius: 34,
              background: "#dbeafe",
            }}
          >
            <img
              src="https://preservehq.com/images/preservehq-operations-hero.jpg"
              alt=""
              width="610"
              height="407"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 24,
                bottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 22,
                background: "rgba(255,255,255,0.94)",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: "#16a34a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 900,
                }}
              >
                ✓
              </div>
              <div style={{ color: "#0f172a", fontSize: 22, fontWeight: 800 }}>
                Property work coordinated
              </div>
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
