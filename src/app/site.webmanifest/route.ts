export function GET() {
  return Response.json(
    {
      name: 'Preserve',
      short_name: 'Preserve',
      icons: [
        {
          src: '/preserve-icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
      theme_color: '#1d4ed8',
      background_color: '#f8fafc',
      display: 'standalone',
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
