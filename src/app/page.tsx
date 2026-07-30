'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  Shield,
  ClipboardCheck,
  Wrench,
  Camera,
  Snowflake,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  X,
  DollarSign,
  Clock,
  Users,
  CheckSquare,
  Star,
  Zap,
  Sparkles,
} from 'lucide-react';

const serviceDetails = {
  lawn: {
    title: 'Lawn & Grounds Maintenance',
    icon: Home,
    color: 'green',
    images: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621574541862-c7c0c7e876f2?w=800&h=600&fit=crop',
    ],
    description: 'Regular mowing, trimming, edging, and landscaping to keep your property looking its best.',
    longDescription: "Whether you own a vacation home, a rental property, or a home you're preparing to sell, our lawn care team keeps your grounds neat, code-compliant, and curb-appeal-ready — without you lifting a finger.",
    pricing: { base: 100, frequency: 'per visit', monthly: 'From $100/visit' },
    includes: ['Mowing & edging', 'Trimming around structures', 'Clipping removal', 'Weed control', 'GPS-stamped before/after photos', 'Code compliance check'],
    frequency: 'Weekly, Bi-weekly, or Monthly',
    timeline: '1–2 hours per visit',
    team: '2-person crew',
  },
  securing: {
    title: 'Property Securing',
    icon: Shield,
    color: 'orange',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&h=600&fit=crop',
    ],
    description: 'Lock changes, lockboxes, and boarding to protect vacant or unoccupied properties.',
    longDescription: "Heading away for months? Inherited a property? We secure your home fast — lock changes, lockboxes, window boarding — so you're protected from unauthorized entry and vandalism.",
    pricing: { base: 250, frequency: 'one-time', monthly: 'From $250' },
    includes: ['Lock change on all entry points', 'Secure lockbox installation', 'Window/door boarding', 'Exterior lighting check', 'Photo documentation', 'Insurance-compliant report'],
    frequency: 'One-time or as-needed',
    timeline: '2–4 hours',
    team: 'Licensed security specialists',
  },
  winterization: {
    title: 'Winterization',
    icon: Snowflake,
    color: 'cyan',
    images: [
      'https://images.unsplash.com/photo-1516380851973-7c4b90251c91?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&h=600&fit=crop',
    ],
    description: 'Protect your plumbing from freeze damage during cold months.',
    longDescription: 'A single burst pipe can cost thousands. Our licensed technicians drain all water lines, treat drain traps with antifreeze, and shut down your HVAC safely — then de-winterize in the spring.',
    pricing: { base: 350, frequency: 'seasonal', monthly: 'From $300/season' },
    includes: ['Drain all supply lines', 'Antifreeze in drain traps', 'HVAC shutdown', 'Water heater drain', 'Toilet winterization', 'Detailed photo report'],
    frequency: 'Fall & Spring',
    timeline: '2–3 hours',
    team: 'Licensed plumbing specialists',
  },
  inspection: {
    title: 'Property Inspections',
    icon: ClipboardCheck,
    color: 'purple',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    description: 'Detailed inspections with GPS-stamped photos and condition reports delivered to your inbox.',
    longDescription: 'Can\'t visit your property in person? We inspect it for you — interior and exterior — with GPS-stamped photos, a written condition report, and alerts for any urgent issues.',
    pricing: { base: 200, frequency: 'per visit', monthly: 'From $150/visit' },
    includes: ['Full interior & exterior walk-through', '30–50+ GPS-stamped photos', 'Condition checklist', 'HVAC/plumbing/electrical checks', 'Immediate emergency alerts', 'PDF report within 24 hrs'],
    frequency: 'Monthly, Bi-weekly, or Custom',
    timeline: '1–2 hours',
    team: 'Certified inspectors',
  },
  cleaning: {
    title: 'Interior House Cleaning',
    icon: Sparkles,
    color: 'teal',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=600&fit=crop',
    ],
    description: 'Interior cleaning, move-out deep cleans, deodorizing, and sanitation for vacant or preserved homes.',
    longDescription: 'Preservation is not only exterior upkeep. Preserve can clean the house itself after vacancy, turnover, weather events, or long periods away, then document the finished condition with photos.',
    pricing: { base: 250, frequency: 'per visit', monthly: 'From $250/visit' },
    includes: ['Kitchen & bathroom cleaning', 'Floor sweeping and mopping', 'Dusting and surface sanitizing', 'Move-out deep clean options', 'Odor treatment', 'Before/after photos'],
    frequency: 'One-time, Monthly, or As-needed',
    timeline: '2-6 hours',
    team: 'Interior cleaning crew',
  },
  maintenance: {
    title: 'Maintenance & Repairs',
    icon: Wrench,
    color: 'gray',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&h=600&fit=crop',
    ],
    description: 'Minor repairs, touch-ups, debris removal, and general upkeep to protect property value.',
    longDescription: 'From gutter cleaning to pressure washing to small repairs, our team keeps your property in great shape between visits — preserving its value and preventing small issues from becoming big ones.',
    pricing: { base: 150, frequency: 'per hour', monthly: 'From $150/hr' },
    includes: ['Minor carpentry & repairs', 'Exterior paint touch-ups', 'Debris & trash removal', 'Gutter cleaning', 'Pressure washing', 'Work completion reports'],
    frequency: 'As-needed',
    timeline: 'Varies by scope',
    team: 'Licensed contractors',
  },
  documentation: {
    title: 'Photo Documentation',
    icon: Camera,
    color: 'blue',
    images: [
      'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551847812-b84ae5d63762?w=800&h=600&fit=crop',
    ],
    description: 'Professional GPS-stamped photos and condition reports for insurance, legal, or rental use.',
    longDescription: 'Keep a timestamped visual record of your property — perfect for insurance claims, tenant move-in/out, legal disputes, or simply staying informed about a home you can\'t visit often.',
    pricing: { base: 50, frequency: 'per visit', monthly: 'From $50/visit' },
    includes: ['GPS-stamped exterior photos', 'Interior condition photos', 'Cloud storage & instant access', 'Detailed written notes', 'Before/after comparisons', 'PDF reports'],
    frequency: 'Monthly or with any service',
    timeline: '30–60 minutes',
    team: 'Documentation specialists',
  },
};

const plans = [
  {
    name: 'Starter',
    price: 49,
    period: '/mo',
    description: 'Perfect for a single property owner',
    color: 'slate',
    features: [
      '1 property',
      'Monthly inspection report',
      'Photo documentation',
      'Work order management',
      'Email support',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Essential',
    price: 99,
    period: '/mo',
    description: 'Most popular for 2–5 properties',
    color: 'blue',
    features: [
      'Up to 5 properties',
      'Bi-weekly inspection reports',
      'Priority work orders',
      'Lawn care scheduling',
      'Winterization reminders',
      'Phone & email support',
    ],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Portfolio',
    price: 199,
    period: '/mo',
    description: 'For serious property owners & landlords',
    color: 'purple',
    features: [
      'Unlimited properties',
      'Weekly inspection reports',
      'Emergency 24/7 response',
      'Full service scheduling',
      'Team & vendor access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const coverageMarkets = [
  {
    state: 'North Carolina',
    areas: ['Triangle', 'Charlotte Metro', 'Triad', 'Coastal NC'],
  },
  {
    state: 'Texas',
    areas: ['Dallas-Fort Worth', 'Houston Metro', 'Austin-San Antonio', 'East Texas'],
  },
];

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const service = selectedService ? serviceDetails[selectedService as keyof typeof serviceDetails] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">Preserve</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition text-sm">Services</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition text-sm">Pricing</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition text-sm">Contact</a>
              <Link href="/login" className="text-slate-600 hover:text-blue-600 transition text-sm font-medium">Sign In</Link>
              <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                Get Started
              </Link>
            </div>
            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-blue-600 transition text-sm">Sign In</Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                First Property Preservation for remote owners, landlords &amp; investors
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Property preservation,<br />handled from anywhere
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Preserve coordinates lawn care, house cleaning, inspections, securing, winterization, repairs, and photo reports for every property you own.
                Request service, track progress, and protect your asset without chasing contractors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition font-semibold text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                  Start Free — Add Your First Property <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#pricing"
                  className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-blue-600 hover:text-blue-600 transition font-semibold text-center">
                  View Pricing
                </a>
              </div>
              <p className="text-sm text-slate-500 mt-4">No credit card required · Cancel anytime</p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Works for</p>
                  {[
                    'Vacation & second homes',
                    'Rental properties',
                    'Inherited homes',
                    'Properties for sale',
                    'Snowbird homes',
                    'Investment portfolios',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Get your properties on Preserve in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create your account', desc: 'Sign up free in 30 seconds — no credit card needed.' },
              { step: '2', title: 'Add your properties', desc: 'Enter each address and pick the services you need.' },
              { step: '3', title: 'Relax', desc: "We handle everything and send you reports so you're always in the loop." },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything Your Property Needs</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From regular maintenance to emergency response — all managed through one simple dashboard
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(serviceDetails).map(([key, svc]) => (
              <ServiceCard key={key} icon={<svc.icon className="w-8 h-8" />} title={svc.title}
                description={svc.description} onClick={() => { setSelectedService(key); setCurrentImageIndex(0); }} />
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 mb-4">
                <MapPin className="w-4 h-4" />
                Current launch markets
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Starting in North Carolina and Texas
              </h2>
              <p className="text-lg text-slate-600">
                Preserve is rolling out city by city so every property is matched to the right service area and local crew.
                Add your property, choose the nearest market, and we will route work orders from there.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {coverageMarkets.map(market => (
                <div key={market.state} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{market.state}</h3>
                  <div className="space-y-3">
                    {market.areas.map(area => (
                      <div key={area} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-slate-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { val: '1,200+', label: 'Properties Managed' },
              { val: '4.9★', label: 'Average Rating' },
              { val: '24/7', label: 'Emergency Response' },
              { val: '100%', label: 'Satisfaction Guarantee' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{s.val}</div>
                <div className="text-blue-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 max-w-xl mx-auto">
              Platform access is a flat monthly fee. Individual services are priced separately based on your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div key={plan.name}
                className={`bg-white rounded-2xl p-8 border-2 flex flex-col ${plan.highlight ? 'border-blue-600 shadow-2xl shadow-blue-100 scale-105' : 'border-slate-200 shadow-sm'}`}>
                {plan.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                  <p className="text-xs text-slate-400 mt-1">+ service costs</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login"
                  className={`w-full text-center py-3 rounded-xl font-semibold transition ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">All plans include a 14-day free trial. No credit card required to start.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Marcus T.', role: 'Owns 3 rental properties', text: "I live 4 hours away from my rentals. Preserve gives me eyes on the ground and handles everything. Best investment I've made." },
              { name: 'Sandra K.', role: 'Vacation home owner', text: "Our beach house sits empty 8 months a year. With Preserve, I know it's being checked, maintained, and ready whenever we show up." },
              { name: 'David R.', role: 'Property investor', text: 'Managing 7 properties used to be a full-time job. Now I get weekly reports and a single dashboard. Completely transformed my workflow.' },
            ].map(t => (
              <div key={t.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 mb-4 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-600 mb-10">Create your free account and add your first property in minutes.</p>
          <Link href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition font-semibold text-lg shadow-lg shadow-blue-200">
            Start Free Today <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { icon: <Phone className="w-6 h-6 text-blue-600" />, label: 'Phone', val: '(919) 555-0123' },
              { icon: <Mail className="w-6 h-6 text-blue-600" />, label: 'Email', val: 'hello@preserve.app' },
              { icon: <MapPin className="w-6 h-6 text-blue-600" />, label: 'Based in', val: 'Raleigh, NC' },
            ].map(c => (
              <div key={c.label} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">{c.icon}</div>
                <p className="font-semibold text-slate-900 mb-1">{c.label}</p>
                <p className="text-slate-600 text-sm">{c.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Modal */}
      {selectedService && service && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-slate-900/75" onClick={() => setSelectedService(null)} />
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <button onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition">
                <X className="w-6 h-6 text-slate-600" />
              </button>
              <div className="relative h-64 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.images[currentImageIndex]} alt={service.title} className="w-full h-full object-cover" />
                {service.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {service.images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImageIndex(i)}
                        className={`rounded-full transition-all h-2 ${i === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{service.title}</h2>
                <p className="text-slate-600 mb-4">{service.longDescription}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-xl text-center text-sm">
                  <div><DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" /><div className="text-slate-500">Pricing</div><div className="font-semibold text-slate-900">{service.pricing.monthly}</div></div>
                  <div><Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" /><div className="text-slate-500">Time</div><div className="font-semibold text-slate-900">{service.timeline}</div></div>
                  <div><Users className="w-5 h-5 text-blue-600 mx-auto mb-1" /><div className="text-slate-500">Team</div><div className="font-semibold text-slate-900">{service.team}</div></div>
                  <div><CheckSquare className="w-5 h-5 text-blue-600 mx-auto mb-1" /><div className="text-slate-500">Schedule</div><div className="font-semibold text-slate-900">{service.frequency}</div></div>
                </div>
                <div className="grid md:grid-cols-2 gap-2 mb-6">
                  {service.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Link href="/login" onClick={() => setSelectedService(null)}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-center">
                    Get Started
                  </Link>
                  <button onClick={() => setSelectedService(null)}
                    className="flex-1 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition font-semibold">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <span className="text-2xl font-bold">Preserve</span>
              </div>
              <p className="text-slate-400 mb-2">Property care made simple — for homeowners, landlords, and investors.</p>
              <p className="text-slate-500 text-sm">Launching in North Carolina and Texas service areas.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-slate-300">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide text-slate-300">Contact</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>(919) 555-0123</li>
                <li>hello@preserve.app</li>
                <li>Raleigh, NC</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
            <p>© 2026 Preserve. All rights reserved. Licensed & Insured.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick?: () => void }) {
  return (
    <div onClick={onClick}
      className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition border border-slate-200 cursor-pointer group">
      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition">{title}</h3>
      <p className="text-slate-600 mb-4 text-sm">{description}</p>
      <div className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
        Learn More <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
