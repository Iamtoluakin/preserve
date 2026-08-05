'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  History,
  Home,
  LockKeyhole,
  MapPin,
  MessageSquare,
  Repeat,
  Shield,
  Sparkles,
  Trash2,
  Wrench,
  X,
  Snowflake,
} from 'lucide-react';

const serviceCategories = [
  { title: 'Inspections', icon: ClipboardCheck, description: 'Interior, exterior, vacancy, and utility checks with photo documentation.' },
  { title: 'Lawn care', icon: Home, description: 'Recurring mowing, grounds care, trimming, and property upkeep.' },
  { title: 'Cleaning', icon: Sparkles, description: 'Move-out cleans, interior cleaning, sanitation, and make-ready support.' },
  { title: 'Repairs', icon: Wrench, description: 'Minor repairs, maintenance, touch-ups, and property preservation tasks.' },
  { title: 'Lock changes', icon: LockKeyhole, description: 'Rekeying, lockboxes, securing, and access coordination.' },
  { title: 'Debris removal', icon: Trash2, description: 'Trash-outs, debris hauling, cleanups, and exterior clearing.' },
  { title: 'Winterization', icon: Snowflake, description: 'Seasonal protection, de-winterization, and utility checks.' },
  { title: 'Property preservation', icon: Shield, description: 'Coordinated services to keep vacant or remote properties protected.' },
  { title: 'Rental turns', icon: Repeat, description: 'Turnover work, cleaning, repairs, and readiness coordination.' },
  { title: 'Recurring maintenance', icon: Clock, description: 'Scheduled property care with history attached to each address.' },
];

const steps = [
  {
    number: '01',
    title: 'Request',
    text: 'Tell us what your property needs and upload any helpful details or photos.',
  },
  {
    number: '02',
    title: 'We Assign',
    text: 'We match the work with a verified local professional.',
  },
  {
    number: '03',
    title: 'Track the Work',
    text: 'Follow progress, messages, photos, and updates in one place.',
  },
  {
    number: '04',
    title: 'Review and Approve',
    text: 'Review the completed work and keep the full record attached to the property.',
  },
];

const outcomes = [
  {
    title: 'Work without chasing contractors',
    text: 'PreserveHQ handles assignment, communication, progress tracking, and follow-up.',
    icon: MessageSquare,
  },
  {
    title: 'Proof you can trust',
    text: 'Review timestamps, updates, and before-and-after photos from anywhere.',
    icon: Camera,
  },
  {
    title: 'Every property has a history',
    text: 'Keep completed work, reports, invoices, notes, and service records organized by property.',
    icon: History,
  },
  {
    title: 'One platform for recurring needs',
    text: 'Manage inspections, lawn care, cleanings, repairs, preservation, and recurring maintenance.',
    icon: Repeat,
  },
];

const audiences = [
  {
    title: 'Property owners',
    icon: Home,
    text: 'Protect remote, vacant, inherited, or second homes without coordinating every job yourself.',
  },
  {
    title: 'Landlords and investors',
    icon: Building2,
    text: 'Keep service requests, repairs, turns, and records organized across every unit.',
  },
  {
    title: 'Property managers',
    icon: ClipboardList,
    text: 'Centralize requests, status updates, photo proof, and approvals across portfolios.',
  },
  {
    title: 'Asset and regional operators',
    icon: BriefcaseBusiness,
    text: 'Create repeatable operating visibility across markets, vendors, and field work.',
  },
];

const trustPoints = [
  'Professionals are reviewed before receiving work',
  'Work is tracked through PreserveHQ',
  'Required updates and photo proof stay attached to the job',
  'Property history remains available to the customer',
  'Issues can be reviewed through the platform',
];

const plans = [
  {
    name: 'Starter',
    price: 49,
    description: 'For one property and essential service tracking.',
    features: ['1 property', 'Work order management', 'Photo documentation', 'Email support'],
  },
  {
    name: 'Essential',
    price: 99,
    description: 'For owners managing several properties.',
    features: ['Up to 5 properties', 'Priority work orders', 'Recurring services', 'Phone and email support'],
    featured: true,
  },
  {
    name: 'Portfolio',
    price: 199,
    description: 'For investors and operators with ongoing needs.',
    features: ['Unlimited properties', 'Portfolio tracking', 'Team and vendor access', 'Dedicated account support'],
  },
];

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<(typeof serviceCategories)[number] | null>(null);
  const getStartedHref = '/login?next=%2Fdashboard%2Fproperties%2Fadd';
  const signInHref = '/login?next=%2Fdashboard';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-slate-950">
      <Header getStartedHref={getStartedHref} signInHref={signInHref} />

      <section className="relative isolate px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_86%_20%,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <div className="animate-[fadeUp_700ms_ease-out_both]">
            <p className="mb-5 inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
              Property operations, simplified
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Property care.
              <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Handled.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Request inspections, maintenance, cleaning, repairs, and preservation services. We assign verified local professionals and manage the work from start to finish.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                See How It Works
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm font-medium text-slate-600">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Trusted property care through verified local professionals.
              </p>
              <p>Built for property owners, landlords, investors, and property managers.</p>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <ProductPreview />

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="How it works"
            title="From request to completion."
            text="PreserveHQ coordinates the entire job so you do not have to manage contractors, photos, updates, and paperwork separately."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-8 text-sm font-black text-blue-600">{step.number}</div>
                <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="owners" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="Visibility"
            title="Know what is happening at every property."
            text="Request the work. Track the progress. Review the proof."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome) => (
              <article key={outcome.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <outcome.icon className="h-7 w-7 text-blue-600" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold text-slate-950">{outcome.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{outcome.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="Services"
            title="One trusted platform for the work your properties need."
            text="Choose the service category and PreserveHQ coordinates the operating details."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCategories.map((service) => (
              <button
                key={service.title}
                onClick={() => setSelectedService(service)}
                className="group min-h-36 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <service.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h3 className="mt-4 text-base font-bold text-slate-950 group-hover:text-blue-700">{service.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-600">{service.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">Who it is for</p>
            <h2 className="mt-4 text-3xl font-black tracking-normal sm:text-4xl">
              Built for operators who need property work to be visible, repeatable, and reviewable.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((audience) => (
              <article key={audience.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <audience.icon className="h-7 w-7 text-sky-300" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{audience.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contractors" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Trust</p>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Local professionals. PreserveHQ accountability.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              PreserveHQ is not a public contractor directory. Customers request outcomes, and the platform manages assignment, communication, proof, and review.
            </p>
          </div>
          <div className="grid gap-3">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <p className="text-sm font-semibold text-slate-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="Pricing"
            title="Simple plans for property operations."
            text="Platform access is a monthly fee. Individual services are priced based on property needs and scope."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-6 shadow-sm ${plan.featured ? 'border-blue-500 bg-blue-50 shadow-blue-100' : 'border-slate-200 bg-white'}`}
              >
                {plan.featured && (
                  <span className="mb-4 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-slate-950">${plan.price}</span>
                  <span className="font-semibold text-slate-500">/mo</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">+ service costs</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={getStartedHref}
                  className={`mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${plan.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                  Get Started
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="final-cta" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white shadow-2xl shadow-slate-200 sm:px-10 sm:py-16">
          <h2 className="text-4xl font-black tracking-normal sm:text-5xl">
            Take care of every property from one place.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Request the work, follow the progress, and review the results without managing every contractor yourself.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} getStartedHref={getStartedHref} />
      )}
    </main>
  );
}

function Header({ getStartedHref, signInHref }: { getStartedHref: string; signInHref: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-2xl font-black text-white shadow-sm">
            P
          </div>
          <span className="text-xl font-black text-slate-950">PreserveHQ</span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          <a href="#how-it-works" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">How It Works</a>
          <a href="#services" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Services</a>
          <a href="#owners" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">For Property Owners</a>
          <a href="#contractors" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">For Contractors</a>
          <a href="#pricing" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Pricing</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href={signInHref} className="hidden min-h-11 items-center rounded-xl px-4 text-sm font-bold text-slate-700 transition hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:inline-flex">
            Sign In
          </Link>
          <Link href={getStartedHref} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="relative animate-[fadeUp_900ms_ease-out_120ms_both]" aria-label="PreserveHQ coordinates property work from request to review">
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-200/80 via-white to-sky-100 blur-2xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/preservehq-operations-hero.jpg"
          alt="Property professionals reviewing property details on a tablet outside a residential building"
          className="aspect-[4/3] w-full object-cover lg:aspect-[1.22/1]"
          width={1536}
          height={1024}
        />
      </div>
      <div className="absolute bottom-4 left-4 hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950">Job complete</p>
            <p className="text-xs font-semibold text-slate-500">Photos ready to review</p>
          </div>
        </div>
      </div>
      <div className="absolute right-4 top-4 hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur md:block">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Professional assigned</p>
        <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700">
          <MapPin className="h-4 w-4 text-blue-600" />
          Verified local coverage
        </div>
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-blue-100/50 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Product preview</p>
              <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">
                One place to request, track, review, and manage property work.
              </h2>
            </div>
            <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              Ready for review
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">Property overview</p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">Oak Ridge Rental</h3>
                  <p className="mt-1 text-sm text-slate-600">Raleigh, NC · Single family</p>
                </div>
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <Home className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {['Inspection completed', 'Cleaning scheduled', 'Lawn care recurring'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-700">{item}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-700">Active service request</p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">Exterior inspection and photo report</h3>
                  <p className="mt-1 text-sm text-slate-600">Assigned professional · Field workflow in progress</p>
                </div>
                <div className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                  Awaiting customer approval
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.8fr]">
                <div className="space-y-3">
                  {[
                    ['Request submitted', 'Customer details captured'],
                    ['Professional assigned', 'Coverage and availability confirmed'],
                    ['Photo evidence uploaded', 'Before and after set attached'],
                    ['Ready for review', 'Completion package prepared'],
                  ].map(([title, text], index) => (
                    <div key={title} className="flex gap-3">
                      <div className={`mt-1 h-3 w-3 rounded-full ${index === 3 ? 'bg-blue-600' : 'bg-green-500'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3">
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-300 to-slate-100" />
                    <p className="mt-2 text-xs font-bold text-slate-600">Before</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-green-200 to-blue-100" />
                    <p className="mt-2 text-xs font-bold text-blue-700">After</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">{label}</p>
      <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{text}</p>
    </div>
  );
}

function ServiceModal({
  service,
  onClose,
  getStartedHref,
}: {
  service: (typeof serviceCategories)[number];
  onClose: () => void;
  getStartedHref: string;
}) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-0 text-left sm:p-4">
        <button className="fixed inset-0 cursor-default bg-slate-950/70" onClick={onClose} aria-label="Close service details" />
        <div className="relative w-full max-w-2xl overflow-hidden bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <service.icon className="h-10 w-10 text-blue-600" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-black text-slate-950">{service.title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{service.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {['Request details', 'Assigned professional', 'Photo proof'].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={getStartedHref}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
            <button
              onClick={onClose}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              Close
            </button>
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
          <a href="#services" className="hover:text-blue-700">Services</a>
          <a href="#pricing" className="hover:text-blue-700">Pricing</a>
          <Link href={signInHref} className="hover:text-blue-700">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
