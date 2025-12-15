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
  CheckSquare
} from 'lucide-react';

// Service details data with comprehensive information
const serviceDetails = {
  'lawn': {
    title: 'Lawn & Grounds Maintenance',
    icon: Home,
    color: 'green',
    images: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621574541862-c7c0c7e876f2?w=800&h=600&fit=crop'
    ],
    description: 'Professional lawn care and grounds maintenance to keep your properties looking pristine and code-compliant.',
    longDescription: 'Our comprehensive lawn and grounds maintenance service ensures your foreclosed properties maintain excellent curb appeal, comply with municipal codes, and avoid HOA violations. We provide regular scheduled maintenance with documented before/after photos.',
    pricing: {
      base: 100,
      frequency: 'per visit',
      monthly: 'Starting at $100-300/month'
    },
    includes: [
      'Complete lawn mowing and edging',
      'Trimming around structures and obstacles',
      'Grass clipping removal and disposal',
      'Sidewalk and driveway edging',
      'Basic weed control in lawn areas',
      'GPS-stamped before/after photos',
      'Municipal code compliance reporting',
      'Emergency same-day service available'
    ],
    frequency: 'Weekly, Bi-weekly, or Monthly',
    timeline: '1-2 hours per visit',
    team: '2-person crew with professional equipment'
  },
  'securing': {
    title: 'Property Securing',
    icon: Shield,
    color: 'orange',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&h=600&fit=crop'
    ],
    description: 'Comprehensive security measures to protect vacant properties from unauthorized access and vandalism.',
    longDescription: 'Protect your vacant properties with our professional securing services. We provide immediate response to secure properties after foreclosure, break-ins, or weather damage. All work meets insurance requirements and municipal regulations.',
    pricing: {
      base: 250,
      frequency: 'one-time',
      monthly: 'Starting at $250-500 per property'
    },
    includes: [
      'Complete lock change on all entry points',
      'Installation of secure lockbox systems',
      'Window and door boarding (if needed)',
      'Gate securing and lock installation',
      'Exterior lighting inspection',
      'Security system documentation',
      'Detailed photo documentation',
      'Insurance-compliant reporting'
    ],
    frequency: 'As-needed / Emergency Response',
    timeline: '2-4 hours per property',
    team: 'Licensed security specialists'
  },
  'winterization': {
    title: 'Winterization Services',
    icon: Snowflake,
    color: 'cyan',
    images: [
      'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop'
    ],
    description: 'Complete plumbing winterization and de-winterization to prevent costly freeze damage.',
    longDescription: 'Protect your properties from freeze damage with our comprehensive winterization services. Our licensed technicians follow industry-standard protocols and provide detailed documentation for insurance and compliance purposes.',
    pricing: {
      base: 350,
      frequency: 'seasonal',
      monthly: 'Starting at $300-400 per service'
    },
    includes: [
      'Drain all water supply lines',
      'Add antifreeze to all drain traps',
      'HVAC system shutdown and protection',
      'Water heater drainage and shutdown',
      'Toilet winterization with antifreeze',
      'Exterior spigot and sprinkler winterization',
      'Posted winterization notices',
      'Detailed service report with photos'
    ],
    frequency: 'Seasonal (Fall/Spring)',
    timeline: '2-3 hours per property',
    team: 'Licensed plumbing specialists'
  },
  'inspection': {
    title: 'Property Inspections',
    icon: ClipboardCheck,
    color: 'purple',
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    ],
    description: 'Detailed property inspections with GPS-stamped photos and comprehensive condition reports.',
    longDescription: 'Our thorough property inspections provide you with complete visibility into your asset condition. Every inspection includes GPS-stamped photos, detailed checklists, and immediate notification of urgent issues.',
    pricing: {
      base: 200,
      frequency: 'per visit',
      monthly: 'Starting at $150-250 per inspection'
    },
    includes: [
      'Complete interior and exterior inspection',
      'GPS-stamped photos (30-50+ images)',
      'Detailed condition checklist',
      'HVAC, plumbing, electrical checks',
      'Security and entry point verification',
      'Code violation identification',
      'Immediate emergency alerts',
      'Professional PDF report within 24 hours'
    ],
    frequency: 'Monthly, Bi-weekly, or Custom',
    timeline: '1-2 hours per property',
    team: 'Certified property inspectors'
  },
  'maintenance': {
    title: 'Maintenance & Repairs',
    icon: Wrench,
    color: 'gray',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&h=600&fit=crop'
    ],
    description: 'Professional maintenance and minor repairs to preserve property value and prevent deterioration.',
    longDescription: 'Keep your properties in excellent condition with our comprehensive maintenance and repair services. From minor repairs to major exterior work, we provide quality workmanship with detailed documentation.',
    pricing: {
      base: 150,
      frequency: 'per hour',
      monthly: 'Starting at $150-500 depending on scope'
    },
    includes: [
      'Minor carpentry and repairs',
      'Exterior painting and touch-ups',
      'Debris and trash removal',
      'Gutter cleaning and repair',
      'Pressure washing services',
      'Door and window repairs',
      'Fence and deck maintenance',
      'Detailed work completion reports'
    ],
    frequency: 'As-needed',
    timeline: 'Varies by project scope',
    team: 'Licensed contractors and handymen'
  },
  'documentation': {
    title: 'Documentation & Reporting',
    icon: Camera,
    color: 'blue',
    images: [
      'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551847812-b84ae5d63762?w=800&h=600&fit=crop'
    ],
    description: 'Professional photo documentation with GPS coordinates and comprehensive condition reports.',
    longDescription: 'Maintain complete documentation of all your properties with our professional photo and reporting services. Every service includes GPS-stamped images, detailed timestamps, and cloud-based storage for easy access.',
    pricing: {
      base: 50,
      frequency: 'per visit',
      monthly: 'Starting at $50-100 per visit'
    },
    includes: [
      'GPS-stamped exterior photos (all angles)',
      'Interior condition photography',
      'Timestamp on all images',
      'Cloud storage with instant access',
      'Detailed written condition notes',
      'Code violation documentation',
      'Before/after service comparisons',
      'Professional PDF reports'
    ],
    frequency: 'Monthly or with each service',
    timeline: '30-60 minutes per property',
    team: 'Professional documentation specialists'
  }
};

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openServiceModal = (serviceKey: string) => {
    setSelectedService(serviceKey);
    setCurrentImageIndex(0);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    setCurrentImageIndex(0);
  };

  const service = selectedService ? serviceDetails[selectedService as keyof typeof serviceDetails] : null;
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
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
              <Link href="#services" className="text-slate-600 hover:text-blue-600 transition">Services</Link>
              <Link href="#about" className="text-slate-600 hover:text-blue-600 transition">About</Link>
              <Link href="#contact" className="text-slate-600 hover:text-blue-600 transition">Contact</Link>
              <Link href="/vendor/dashboard" className="text-slate-600 hover:text-blue-600 transition font-medium">
                Management Portal
              </Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Trusted by Banks & Lenders Across North Carolina
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Professional Property Preservation Services
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Comprehensive maintenance, inspection, and preservation solutions for REO and foreclosed properties. 
                Protecting your assets with documented, compliant service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-center flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="#contact" 
                  className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="text-slate-700 font-medium">Licensed & Insured</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="text-slate-700 font-medium">24/7 Emergency Response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="text-slate-700 font-medium">GPS-Stamped Reporting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="text-slate-700 font-medium">Code Compliance Experts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive property preservation solutions tailored for banks, lenders, and asset managers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Cards */}
            <ServiceCard
              icon={<Home className="w-8 h-8" />}
              title="Lawn & Grounds Maintenance"
              description="Regular mowing, trimming, edging, and landscaping to maintain curb appeal and prevent code violations."
              onClick={() => openServiceModal('lawn')}
            />
            <ServiceCard
              icon={<Shield className="w-8 h-8" />}
              title="Property Securing"
              description="Lock changes, door/window boarding, and comprehensive security measures to protect vacant properties."
              onClick={() => openServiceModal('securing')}
            />
            <ServiceCard
              icon={<Snowflake className="w-8 h-8" />}
              title="Winterization Services"
              description="Complete winterization and de-winterization of plumbing systems to prevent freeze damage."
              onClick={() => openServiceModal('winterization')}
            />
            <ServiceCard
              icon={<ClipboardCheck className="w-8 h-8" />}
              title="Property Inspections"
              description="Detailed inspections with GPS-stamped photos, timestamps, and comprehensive checklists."
              onClick={() => openServiceModal('inspection')}
            />
            <ServiceCard
              icon={<Wrench className="w-8 h-8" />}
              title="Maintenance & Repairs"
              description="Minor exterior repairs, painting, debris removal, and general property upkeep services."
              onClick={() => openServiceModal('maintenance')}
            />
            <ServiceCard
              icon={<Camera className="w-8 h-8" />}
              title="Documentation & Reporting"
              description="Professional photo documentation with GPS coordinates and detailed condition reports."
              onClick={() => openServiceModal('documentation')}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Properties Managed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Bank Partners</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Emergency Response</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Code Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Banks Choose Preserve</h2>
              <div className="space-y-6">
                <Feature
                  title="Code Compliance Expertise"
                  description="We stay current with all North Carolina municipal codes and vacant property registration requirements."
                />
                <Feature
                  title="Documented Service"
                  description="Every service includes GPS-stamped photos, timestamps, and detailed checklists for your records."
                />
                <Feature
                  title="Licensed & Insured"
                  description="Fully licensed contractors with comprehensive GL, commercial auto, and WC insurance coverage."
                />
                <Feature
                  title="SLA-Driven Operations"
                  description="We meet strict service level agreements with guaranteed response times and quality standards."
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Service Areas</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">North Carolina</div>
                    <div className="text-slate-600 text-sm">Serving all major metro areas and counties</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-slate-600 mb-4">Primary Coverage Areas:</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-slate-700">• Durham County</div>
                    <div className="text-slate-700">• Wake County</div>
                    <div className="text-slate-700">• Mecklenburg County</div>
                    <div className="text-slate-700">• Guilford County</div>
                    <div className="text-slate-700">• Forsyth County</div>
                    <div className="text-slate-700">• Cumberland County</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Get Started Today</h2>
            <p className="text-xl text-slate-600 mb-12">
              Ready to partner with a professional property preservation team? Contact us for vendor enrollment.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
                <p className="text-slate-600">(919) 555-0123</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                <p className="text-slate-600">info@preserve-nc.com</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Office</h3>
                <p className="text-slate-600">Raleigh, NC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {selectedService && service && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity"
              onClick={closeServiceModal}
            />

            {/* Modal */}
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Close Button */}
              <button
                onClick={closeServiceModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>

              {/* Image Gallery */}
              <div className="relative h-80 bg-slate-100">
                <img
                  src={service.images[currentImageIndex]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                {service.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {service.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 bg-${service.color}-100 rounded-xl flex items-center justify-center`}>
                    <service.icon className={`w-8 h-8 text-${service.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{service.title}</h2>
                    <p className="text-lg text-slate-600">{service.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-slate-700 leading-relaxed">{service.longDescription}</p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                  <div className="text-center">
                    <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Pricing</div>
                    <div className="font-semibold text-slate-900">{service.pricing.monthly}</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Timeline</div>
                    <div className="font-semibold text-slate-900">{service.timeline}</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Team</div>
                    <div className="font-semibold text-slate-900 text-sm">{service.team}</div>
                  </div>
                  <div className="text-center">
                    <CheckSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">Frequency</div>
                    <div className="font-semibold text-slate-900 text-sm">{service.frequency}</div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    What&apos;s Included
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {service.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Link
                    href="/dashboard/work-orders/create"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
                    onClick={closeServiceModal}
                  >
                    Request This Service
                  </Link>
                  <Link
                    href="#contact"
                    className="flex-1 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold text-center"
                    onClick={closeServiceModal}
                  >
                    Contact Us
                  </Link>
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
              <p className="text-slate-400 mb-4">
                Professional property preservation services for banks and lenders across North Carolina.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="#about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Client Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>(919) 555-0123</li>
                <li>info@preserve-nc.com</li>
                <li>Raleigh, NC</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Preserve. All rights reserved. Licensed & Insured.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition border border-slate-200 cursor-pointer group"
    >
      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <div className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
        Learn More <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}
