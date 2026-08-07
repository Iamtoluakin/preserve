'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Home,
  LockKeyhole,
  MapPin,
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
    title: 'Customer requests work',
    text: 'Add the property, choose the service, and include access notes, timing, and photos.',
  },
  {
    number: '02',
    title: 'PreserveHQ dispatches',
    text: 'We rank approved contractors by coverage, service fit, insurance, availability, and quality.',
  },
  {
    number: '03',
    title: 'Field pro completes it',
    text: 'The assigned contractor accepts, starts, sends updates, uploads photos, and marks the job complete.',
  },
  {
    number: '04',
    title: 'Customer reviews proof',
    text: 'Updates, completion photos, notes, and history stay attached to the property record.',
  },
];

const trustPoints = [
  'Contractors apply, submit coverage and service categories, and wait for approval',
  'Dispatch uses service fit, location, workload, availability, insurance, and performance',
  'Workers receive assigned jobs through the vendor portal',
  'Customers see progress updates, photos, completion notes, and property history',
];

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<(typeof serviceCategories)[number] | null>(null);
  const getStartedHref = '/login?next=%2Fdashboard%2Fproperties%2Fadd';
  const signInHref = '/login?next=%2Fdashboard';
  const contractorHref = '/login?role=contractor&next=%2Fvendor%2Fonboarding';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7fbff] text-slate-950">
      <Header getStartedHref={getStartedHref} signInHref={signInHref} />

      <section className="relative isolate px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_86%_20%,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <div className="animate-[fadeUp_700ms_ease-out_both]">
            <p className="mb-5 inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
              Managed property work
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Request the work.
              <span className="block bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                We dispatch the pro.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              PreserveHQ connects property owners with approved field contractors, manages assignment, tracks progress, and returns photo proof when the job is done.
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
                Built around customer requests, PreserveHQ dispatch, contractor execution, and proof.
              </p>
              <p>For owners, landlords, investors, property managers, and approved field pros.</p>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="Workflow"
            title="The whole loop, from request to proof."
            text="Customers do not browse a contractor directory. PreserveHQ turns the request into an assigned, tracked, reviewable job."
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

      <section id="services" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            label="Services"
            title="The common jobs PreserveHQ can coordinate."
            text="Start with the service category. PreserveHQ handles dispatch, field updates, completion proof, and the property record."
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

      <section id="contractors" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Network</p>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Approved contractors, assigned with context.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Workers sign in through the contractor portal, complete onboarding, and receive jobs only after PreserveHQ approves their coverage, services, and compliance details.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={contractorHref}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Apply as a Contractor
              </Link>
              <Link
                href="/vendor/dashboard"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Contractor Portal
              </Link>
            </div>
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

      <section id="final-cta" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white shadow-2xl shadow-slate-200 sm:px-10 sm:py-16">
          <h2 className="text-4xl font-black tracking-normal sm:text-5xl">
            Submit the job. Track the proof.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            PreserveHQ gives customers one place to request property work and gives approved contractors one place to complete it.
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
          <a href="#how-it-works" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Workflow</a>
          <a href="#services" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Services</a>
          <a href="#contractors" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Network</a>
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
          <a href="#contractors" className="hover:text-blue-700">Network</a>
          <Link href={signInHref} className="hover:text-blue-700">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
