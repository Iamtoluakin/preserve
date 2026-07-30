const socialSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="Preserve property care">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect x="72" y="72" width="1056" height="486" rx="36" fill="#ffffff" stroke="#dbeafe" stroke-width="4"/>
  <rect x="116" y="118" width="112" height="112" rx="24" fill="#1d4ed8"/>
  <path d="M148 203v-58h27c13.8 0 23.3 8.3 23.3 21.2 0 12.8-9.5 21-23.3 21h-13.8V203H148Zm13.2-27.8H174c6.9 0 10.9-3.4 10.9-9s-4-9.2-10.9-9.2h-12.8v18.2Z" fill="#fff"/>
  <text x="116" y="304" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="800">Preserve</text>
  <text x="116" y="378" fill="#334155" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="500">Property preservation, handled from anywhere.</text>
  <text x="116" y="438" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="500">Lawn care, inspections, cleaning, repairs, and photo reports for remote owners and investors.</text>
  <rect x="835" y="142" width="194" height="194" rx="28" fill="#dbeafe"/>
  <path d="M884 294v-92l48-38 48 38v92h-35v-54h-26v54h-35Z" fill="#1d4ed8"/>
  <rect x="835" y="378" width="194" height="68" rx="18" fill="#1d4ed8"/>
  <text x="879" y="422" fill="#fff" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">Sign In</text>
</svg>`;

export function GET() {
  return new Response(socialSvg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
