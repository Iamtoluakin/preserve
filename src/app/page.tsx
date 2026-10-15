'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ClipboardCheck,
  Home,
  LockKeyhole,
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
    title: 'Add Property',
    text: 'Add a home, rental, or other property. Share the details that shape its care.',
  },
  {
    title: 'Build Your Schedule',
    text: 'Organize routine upkeep by cadence, from weekly seasonal tasks to monthly and annual maintenance.',
  },
  {
    title: 'We Coordinate the Work',
    text: 'Preserve matches each task with a local professional and handles scheduling and follow-through.',
  },
  {
    title: 'See Every Visit',
    text: 'Get updates, completion photos, and a clear maintenance history for your home.',
  },
];

const proofItems = [
  { label: 'Dispatch status', value: 'Assigned', icon: Users },
  { label: 'Field update', value: 'Work in progress', icon: ClipboardCheck },
  { label: 'Completion proof', value: 'Photos ready', icon: Camera },
];

export default function HomePage() {
  const getStartedHref = '/login?next=%2Fdashboard%2Fproperties%2Fadd';
  const signInHref = '/login?next=%2Fdashboard';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-slate-950">
      <Header getStartedHref={getStartedHref} signInHref={signInHref} />

      <section className="relative isolate px-4 pb-8 pt-20 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(255,255,255,0.74)_45%,rgba(219,234,254,0.72)),radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.16),transparent_26%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-6 sm:gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
          <div className="animate-[fadeUp_700ms_ease-out_both]">
            <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-white/85 px-3.5 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm sm:mb-4 sm:text-xs sm:tracking-[0.2em]">
              PROPERTY CARE, COORDINATED
            </p>
            <h1 className="max-w-3xl text-[3.2rem] font-black leading-[0.9] tracking-[-0.045em] text-slate-950 sm:text-6xl sm:leading-[0.94] lg:text-7xl">
              Property care.
              <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Handled.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-[0.94rem] leading-6 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
              From everyday home maintenance to vacant and foreclosed property preservation, PreserveHQ coordinates trusted local professionals, manages the work, and keeps every update, photo, and service record in one place.
            </p>
            <div className="mt-5 flex flex-row gap-2.5 sm:mt-7 sm:gap-3">
              <Link
                href={getStartedHref}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:flex-none sm:gap-2 sm:px-6 sm:text-base"
              >
                Get Started <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:flex-none sm:px-6 sm:text-base"
              >
                How It Works
              </a>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500 sm:mt-5 sm:text-sm">
              For homeowners, landlords, investors, and property preservation professionals.
            </p>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="How it works"
            title="A home-care plan that keeps moving."
            text="Preserve organizes the recurring schedule, coordinates the right local professionals, and shares updates and proof as work gets done."
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
        <div className="mx-auto grid max-w-6xl gap-7 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-10">
          <div>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Home maintenance membership</p>
              <h2 className="mt-3 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">Know what your home needs, and when.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Get a personalized upkeep schedule and help coordinating trusted local professionals, all in one place.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Seasonal checkups', 'HVAC filter changes', 'Safety checks'].map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{item}</span>
              ))}
            </div>
          </div>
          <figure className="relative overflow-hidden rounded-2xl border border-blue-100 bg-slate-100 shadow-lg shadow-blue-100/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home-service-crew.jpg"
              alt="Home service crew wearing work uniforms and carrying equipment outside a house"
              className="aspect-[4/3] w-full object-cover object-[center_72%]"
              width={1400}
              height={2100}
              loading="lazy"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
              <span className="block">Local pros, ready to help</span>
              <a className="mt-0.5 block text-[10px] font-medium text-slate-500 underline" href="https://www.pexels.com/photo/3-men-in-orange-and-black-uniform-standing-beside-white-and-brown-house-6196222/" target="_blank" rel="noreferrer">Photo by Tima Miroshnichenko / Pexels</a>
            </figcaption>
          </figure>
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

      <section id="final-cta" className="px-4 py-12 pb-16 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] bg-slate-950 px-5 py-10 text-center text-white shadow-2xl shadow-slate-200 sm:px-10 sm:py-14">
          <h2 className="text-3xl font-black tracking-normal sm:text-5xl">
            Your home has a schedule. Preserve helps you keep it.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Start with your home. We&apos;ll help organize routine maintenance and coordinate trusted professionals as it comes due.
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
    <div className="relative mx-auto w-full max-w-2xl animate-[fadeUp_900ms_ease-out_120ms_both]" aria-label="A property manager reviews a home visit with a field professional; a work report shows active progress and photos">
      <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200/80 via-white to-sky-100 blur-2xl sm:-inset-4" aria-hidden="true" />
      <div className="overflow-hidden rounded-[1.35rem] border border-white bg-white shadow-2xl shadow-blue-100 sm:rounded-[1.75rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/preservehq-operations-hero.jpg"
          alt="Property manager and field professional reviewing a residential property on a tablet"
          className="aspect-[1.62/1] w-full object-cover sm:aspect-[4/3] lg:aspect-[1.22/1]"
          width={2200}
          height={1467}
        />
      </div>
      <div className="absolute -right-1.5 top-3 w-[5.7rem] overflow-hidden rounded-xl border-2 border-white bg-white shadow-xl sm:-right-3 sm:top-5 sm:w-36 sm:rounded-2xl sm:border-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home-service-crew.jpg"
          alt="Three uniformed local service professionals with equipment outside a home"
          className="aspect-[0.78/1] w-full object-cover object-[center_72%]"
          width={1400}
          height={2100}
          loading="lazy"
        />
        <span className="block px-1.5 py-1 text-center text-[0.55rem] font-extrabold text-slate-700 sm:px-2 sm:py-1.5 sm:text-[0.65rem]">Local pros on site</span>
      </div>
      <div className="absolute -bottom-3 left-2 right-2 rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-xl backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:min-w-64 sm:rounded-2xl sm:p-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 sm:h-10 sm:w-10 sm:rounded-xl">
            <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-black text-slate-950 sm:text-sm">Vacant property check</p>
              <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[0.55rem] font-bold text-amber-700 sm:px-2 sm:text-[0.62rem]">In progress</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[0.58rem] font-semibold text-slate-500 sm:mt-2 sm:text-xs">
              <span className="inline-flex items-center gap-1"><Camera className="h-3 w-3" /> 3 site photos</span>
              <span>Field update received</span>
            </div>
          </div>
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
  items: string[] | { frequency: string; tasks: string[] }[];
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
      {typeof items[0] === 'string' ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {(items as string[]).map((item) => (
            <span key={item} className={`rounded-full px-3 py-2 text-xs font-bold ${highlighted ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {(items as { frequency: string; tasks: string[] }[]).map((group) => (
            <div key={group.frequency} className={`rounded-xl p-3 ${highlighted ? 'bg-white/10' : 'bg-slate-50'}`}>
              <h3 className={`text-xs font-black uppercase tracking-wide ${highlighted ? 'text-blue-100' : 'text-blue-700'}`}>{group.frequency}</h3>
              <p className={`mt-1 text-sm leading-6 ${highlighted ? 'text-white' : 'text-slate-700'}`}>{group.tasks.join(' · ')}</p>
            </div>
          ))}
          <p className={`text-xs leading-5 ${highlighted ? 'text-blue-100' : 'text-slate-500'}`}>
            Adapted from a sample 3-year homeowner checklist. Confirm each task and timing for the home, equipment, climate, and applicable warranties.
          </p>
        </div>
      )}
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
          <Link href={signInHref} className="hover:text-blue-700">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
