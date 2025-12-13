# Preserve - Property Preservation Platform

A professional web application for managing property preservation services for foreclosed and REO (Real Estate Owned) properties in North Carolina.

## Overview

Preserve provides banks, lenders, and asset managers with a comprehensive platform to manage property maintenance, inspections, and preservation services for their foreclosed property portfolios.

## Features

### Landing Page
- Professional hero section with clear value proposition
- Services overview showcasing all preservation offerings
- Statistics and trust indicators
- Contact information and service areas

### Client Dashboard
- Property portfolio management
- Real-time status tracking
- Work order creation and management
- Inspection reports with GPS-stamped photos
- Activity timeline and notifications

### Core Services
- **Lawn & Grounds Maintenance**: Regular mowing, trimming, and landscaping
- **Property Securing**: Lock changes, boarding, and security measures
- **Winterization**: Plumbing winterization and de-winterization
- **Inspections**: GPS-stamped photo documentation with detailed reports
- **Maintenance & Repairs**: Minor exterior repairs and painting
- **Documentation**: Professional reporting with timestamps and GPS coordinates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
preserve/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout
│       ├── page.tsx            # Landing page
│       ├── globals.css         # Global styles
│       └── dashboard/
│           └── page.tsx        # Dashboard page
├── public/                     # Static assets
├── .github/
│   └── copilot-instructions.md # Copilot guidelines
└── README.md
```

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

### Manual Deploy

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy your application.

### Environment Variables

If you add database or API integrations, configure environment variables in Vercel:

- Go to your project settings
- Navigate to "Environment Variables"
- Add your variables (e.g., DATABASE_URL, API_KEY)

## Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] PostgreSQL database integration
- [ ] Photo upload with GPS tagging
- [ ] Automated inspection scheduling
- [ ] PDF report generation
- [ ] Payment processing
- [ ] Mobile app for field technicians
- [ ] Email notifications
- [ ] Advanced analytics dashboard

## License

© 2025 Preserve. All rights reserved.

## Contact

For support or inquiries:
- Email: info@preserve-nc.com
- Phone: (919) 555-0123
- Location: Raleigh, North Carolina
