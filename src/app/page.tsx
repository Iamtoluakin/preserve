'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Home,
  LockKeyhole,
  MapPin,
  Repeat,
  Shield,
  Sparkles,
  Trash2,
  Wrench,
  Snowflake,
  Camera,
  LayoutDashboard,
  Users,
} from 'lucide-react';

const steps = [
  {
    title: 'Request',
    text: 'Tell us the property, service, timing, access notes, and anything the field team should know.',
  },
  {
    title: 'We Coordinate',
    text: 'PreserveHQ stays between the customer and vendor, assigns the right local pro, and manages the details.',
  },
  {
    title: 'Work Gets Done',
    text: 'The assigned professional completes the work, shares updates, and uploads required photos or notes.',
  },
  {
    title: 'Review the Result',
    text: 'You get completion proof, property history, and a clear record of what happened.',
  },
];

const membershipServices = [
  'Inspections',
  'Lawn care',
  'Cleaning',
  'Repairs',
  'Seasonal maintenance',
  'Vacancy checks',
  'Photo updates',
];

const preservationServices = [
  'Inspections',
  'Securing',
  'Lock changes',
  'Winterization',
  'Lawn care',
  'Debris removal',
  'Trash-outs',
  'Repairs',
  'Photo documentation',
];

const proofItems = [
  { label: 'Dispatch status', value: 'Assigned', icon: Users },
  { label: 'Field update', value: 'Work in progress', icon: ClipboardCheck },
  { label: 'Completion proof', value: 'Photos ready', icon: Camera },
];

export default function HomePage() {
  const getStartedHref = '/login?next=%2Fdashboard%2Fproperties%2Fadd';
  const signInHref = '/login?next=%2Fdashboard';
  const contractorHref = '/login?role=contractor&next=%2Fvendor%2Fonboarding';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-slate-950">
      <Header getStartedHref={getStartedHref} signInHref={signInHref} />

      <section className="relative isolate px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:pb-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(255,255,255,0.74)_45%,rgba(219,234,254,0.72)),radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.16),transparent_26%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
          <div className="animate-[fadeUp_700ms_ease-out_both]">
            <p className="mb-4 inline-flex rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm sm:text-xs">
              From one home to an entire portfolio.
            </p>
            <h1 className="max-w-3xl text-[3.1rem] font-black leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Property care.
              <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Handled.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-xl sm:leading-8">
              From everyday home maintenance to vacant and foreclosed property preservation, PreserveHQ coordinates trusted local professionals and manages the work from start to finish.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={getStartedHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                How It Works
              </a>
            </div>
            <Link
              href={contractorHref}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl px-1 text-sm font-bold text-blue-700 transition hover:text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Are you a service professional? Join the PreserveHQ Network <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="How it works"
            title="Request to proof, without the contractor marketplace chaos."
            text="PreserveHQ coordinates the job, manages the vendor relationship, and keeps the customer experience organized."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
                <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">
                  {index + 1}
                </div>
                <h3 className="text-lg font-black text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="membership" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2">
          <AudienceCard
            eyebrow="Property care membership"
            title="Ongoing care for owners, landlords, investors, and remote homeowners."
            text="Subscribe for coordinated property upkeep, updates, and work history without managing every vendor yourself."
            icon={Home}
            items={membershipServices}
          />
          <AudienceCard
            eyebrow="Foreclosure & REO property preservation"
            title="Vacant, bank-owned, and foreclosure property work managed end to end."
            text="REO (Real Estate Owned) is typically a property that has gone through foreclosure and is now owned by a bank or lender."
            icon={Shield}
            items={preservationServices}
            highlighted
          />
        </div>
      </section>

      <section id="preview" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionIntro
            label="Product preview"
            title="A simple command center for property operations."
            text="Track properties, requests, assignments, field updates, photos, and work history from one clean dashboard."
          />
          <ProductPreview />
        </div>
      </section>

      <section id="vendors" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-white p-5 shadow-sm sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">PreserveHQ vendor network</p>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Join the PreserveHQ Network.
            </h2>
            <p className="mt-4 text-lg font-bold text-slate-800">
              Do the work. We&apos;ll help handle the rest.
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Join the PreserveHQ Network and get matched with property-care and preservation jobs in your service area.
            </p>
            <Link
              href={contractorHref}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto"
            >
              Join the PreserveHQ Network <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Coverage fit', 'Receive opportunities that match your approved service area.'],
              ['Service fit', 'Get work aligned to the categories you perform.'],
              ['Managed workflow', 'PreserveHQ coordinates customer expectations, updates, and proof.'],
              ['Not a lead marketplace', 'Customers do not browse contractors or buy public leads.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="mt-4 text-base font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="final-cta" className="px-4 py-12 pb-16 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] bg-slate-950 px-5 py-10 text-center text-white shadow-2xl shadow-slate-200 sm:px-10 sm:py-14">
          <h2 className="text-3xl font-black tracking-normal sm:text-5xl">
            From one home to an entire portfolio.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            PreserveHQ coordinates property care and preservation work so every request has a clear owner, field pro, status, and result.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={getStartedHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300/40"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={signInHref}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer signInHref={signInHref} />
    </main>
  );
}

function Header({ getStartedHref, signInHref }: { getStartedHref: string; signInHref: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link href="/" className="flex min-w-0 items-center gap-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 sm:gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-2xl font-black text-white shadow-sm">
            P
          </div>
          <span className="truncate text-lg font-black text-slate-950 sm:text-xl">PreserveHQ</span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          <a href="#how-it-works" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">How It Works</a>
          <a href="#membership" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Membership</a>
          <a href="#vendors" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Network</a>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Link href={signInHref} className="hidden min-h-11 items-center rounded-xl px-4 text-sm font-bold text-slate-700 transition hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:inline-flex">
            Sign In
          </Link>
          <Link href={getStartedHref} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:px-4">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="relative animate-[fadeUp_900ms_ease-out_120ms_both]" aria-label="PreserveHQ coordinates property care from request to proof">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200/80 via-white to-sky-100 blur-2xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-2xl shadow-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/preservehq-operations-hero.jpg"
          alt="Property owner and field professional reviewing property work on a tablet outside a residential building"
          className="aspect-[1.08/1] w-full object-cover sm:aspect-[4/3] lg:aspect-[1.18/1]"
          width={2200}
          height={1467}
        />
      </div>
      <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">Work coordinated</p>
            <p className="truncate text-xs font-semibold text-slate-500">Updates and proof in one place</p>
          </div>
        </div>
      </div>
      <div className="absolute right-4 top-4 hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:block">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Managed dispatch</p>
        <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
          <MapPin className="h-4 w-4 text-blue-600" />
          Service area matched
        </div>
      </div>
    </div>
  );
}

function SectionIntro({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">{label}</p>
      <h2 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{text}</p>
    </div>
  );
}

function AudienceCard({
  eyebrow,
  title,
  text,
  icon: Icon,
  items,
  highlighted = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  icon: typeof Home;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <article className={`rounded-[1.75rem] border p-5 shadow-sm sm:p-7 ${highlighted ? 'border-blue-200 bg-blue-600 text-white shadow-blue-100' : 'border-slate-200 bg-white text-slate-950'}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${highlighted ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700'}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className={`mt-5 text-xs font-black uppercase tracking-[0.2em] ${highlighted ? 'text-blue-100' : 'text-blue-700'}`}>{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black tracking-normal sm:text-3xl">{title}</h2>
      <p className={`mt-4 text-sm leading-6 sm:text-base ${highlighted ? 'text-blue-50' : 'text-slate-600'}`}>{text}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-full px-3 py-2 text-xs font-bold ${highlighted ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-blue-100 sm:p-4">
      <div className="overflow-hidden rounded-[1.25rem] bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-black text-slate-950">Operations dashboard</span>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Live</span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[0.9fr_1.1fr] sm:p-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Property</p>
            <h3 className="mt-3 text-lg font-black text-slate-950">Vacant home check</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Exterior inspection, lawn condition, lockbox verification, and photo documentation.</p>
            <div className="mt-5 space-y-3">
              {proofItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white p-3">
                  <item.icon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-500">{item.label}</p>
                    <p className="truncate text-sm font-black text-slate-950">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ['Assigned professional', 'Coverage and service fit confirmed'],
              ['Customer timeline', 'Requested, assigned, updated, reviewed'],
              ['Property record', 'Notes, photos, status, and history attached'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-4">
                <h3 className="text-sm font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({ signInHref }: { signInHref: string }) {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-2xl font-black text-white">
            P
          </div>
          <div>
            <p className="font-black text-slate-950">PreserveHQ</p>
            <p className="text-sm text-slate-500">Property care. Handled.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-blue-700">How It Works</a>
          <a href="#membership" className="hover:text-blue-700">Membership</a>
          <a href="#vendors" className="hover:text-blue-700">Network</a>
          <Link href={signInHref} className="hover:text-blue-700">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
