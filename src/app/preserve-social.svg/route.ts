const socialSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="PreserveHQ managed property operations">
  <rect width="1200" height="630" fill="#0f172a"/>
  <rect x="56" y="56" width="1088" height="518" rx="40" fill="#ffffff"/>
  <rect x="112" y="112" width="86" height="86" rx="22" fill="#2563eb"/>
  <text x="155" y="174" fill="#ffffff" font-family="Arial, sans-serif" font-size="58" font-weight="800" text-anchor="middle">P</text>
  <text x="216" y="150" fill="#0f172a" font-family="Arial, sans-serif" font-size="48" font-weight="800">PreserveHQ</text>
  <text x="216" y="184" fill="#64748b" font-family="Arial, sans-serif" font-size="22" font-weight="700">Managed property operations</text>
  <rect x="880" y="122" width="208" height="54" rx="27" fill="#dcfce7"/>
  <text x="984" y="157" fill="#166534" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">Verified field network</text>
  <text x="112" y="362" fill="#0f172a" font-family="Arial, sans-serif" font-size="72" font-weight="800">
    <tspan x="112" dy="0">Property operations,</tspan>
    <tspan x="112" dy="72">handled end to end.</tspan>
  </text>
  <text x="112" y="473" fill="#475569" font-family="Arial, sans-serif" font-size="30" font-weight="500">
    <tspan x="112" dy="0">Service requests, dispatch, contractor workflows,</tspan>
    <tspan x="112" dy="39">quality review, invoices, and property history.</tspan>
  </text>
  <g font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#1e3a8a">
    <rect x="866" y="292" width="222" height="66" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="888" y="334">Requests</text>
    <rect x="866" y="372" width="222" height="66" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="888" y="414">Dispatch</text>
    <rect x="866" y="452" width="222" height="66" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="888" y="494">Photos</text>
  </g>
</svg>`;

export function GET() {
  return new Response(socialSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
