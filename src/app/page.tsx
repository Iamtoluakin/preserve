import Link from 'next/link';
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
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
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
            />
            <ServiceCard
              icon={<Shield className="w-8 h-8" />}
              title="Property Securing"
              description="Lock changes, door/window boarding, and comprehensive security measures to protect vacant properties."
            />
            <ServiceCard
              icon={<Snowflake className="w-8 h-8" />}
              title="Winterization Services"
              description="Complete winterization and de-winterization of plumbing systems to prevent freeze damage."
            />
            <ServiceCard
              icon={<ClipboardCheck className="w-8 h-8" />}
              title="Property Inspections"
              description="Detailed inspections with GPS-stamped photos, timestamps, and comprehensive checklists."
            />
            <ServiceCard
              icon={<Wrench className="w-8 h-8" />}
              title="Maintenance & Repairs"
              description="Minor exterior repairs, painting, debris removal, and general property upkeep services."
            />
            <ServiceCard
              icon={<Camera className="w-8 h-8" />}
              title="Documentation & Reporting"
              description="Professional photo documentation with GPS coordinates and detailed condition reports."
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

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition border border-slate-200">
      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
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
