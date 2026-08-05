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
          background: "#0f172a",
          fontFamily: "Arial, sans-serif",
          padding: 56,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#ffffff",
            borderRadius: 40,
            padding: 56,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 86,
                  height: 86,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 22,
                  background: "#2563eb",
                  color: "#ffffff",
                  fontSize: 58,
                  fontWeight: 800,
                }}
              >
                P
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ color: "#0f172a", fontSize: 48, fontWeight: 800 }}>
                  PreserveHQ
                </div>
                <div style={{ color: "#64748b", fontSize: 22, fontWeight: 700 }}>
                  Managed property operations
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: "#dcfce7",
                color: "#166534",
                fontSize: 22,
                fontWeight: 700,
                padding: "14px 22px",
              }}
            >
              Verified field network
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
              <div
                style={{
                  color: "#0f172a",
                  fontSize: 72,
                  lineHeight: 0.98,
                  fontWeight: 800,
                  letterSpacing: 0,
                }}
              >
                Property operations, handled end to end.
              </div>
              <div
                style={{
                  marginTop: 28,
                  color: "#475569",
                  fontSize: 30,
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                Service requests, dispatch, contractor workflows, quality review,
                invoices, and permanent property history in one trusted platform.
              </div>
            </div>

            <div
              style={{
                width: 278,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                flexShrink: 0,
              }}
            >
              {["Requests", "Dispatch", "Photos", "Approvals"].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 20,
                    background: "#eff6ff",
                    border: "2px solid #bfdbfe",
                    color: "#1e3a8a",
                    fontSize: 26,
                    fontWeight: 800,
                    padding: "18px 22px",
                  }}
                >
                  {item}
                </div>
              ))}
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
