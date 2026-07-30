'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Home, MapPin, FileText, Upload } from 'lucide-react';
import { readProperties, type PreserveProperty, writeProperties } from '@/lib/localData';

const SERVICE_AREAS = {
  NC: [
    {
      name: 'Triangle',
      counties: ['Wake', 'Durham', 'Orange', 'Chatham', 'Johnston'],
      cities: [
        { name: 'Raleigh', county: 'Wake' },
        { name: 'Durham', county: 'Durham' },
        { name: 'Chapel Hill', county: 'Orange' },
        { name: 'Cary', county: 'Wake' },
        { name: 'Apex', county: 'Wake' },
        { name: 'Garner', county: 'Wake' },
        { name: 'Wake Forest', county: 'Wake' },
        { name: 'Clayton', county: 'Johnston' },
      ],
    },
    {
      name: 'Charlotte Metro',
      counties: ['Mecklenburg', 'Union', 'Cabarrus', 'Gaston', 'Iredell'],
      cities: [
        { name: 'Charlotte', county: 'Mecklenburg' },
        { name: 'Concord', county: 'Cabarrus' },
        { name: 'Gastonia', county: 'Gaston' },
        { name: 'Matthews', county: 'Mecklenburg' },
        { name: 'Huntersville', county: 'Mecklenburg' },
        { name: 'Mooresville', county: 'Iredell' },
        { name: 'Monroe', county: 'Union' },
      ],
    },
    {
      name: 'Triad',
      counties: ['Guilford', 'Forsyth', 'Alamance', 'Davidson', 'Randolph'],
      cities: [
        { name: 'Greensboro', county: 'Guilford' },
        { name: 'Winston-Salem', county: 'Forsyth' },
        { name: 'High Point', county: 'Guilford' },
        { name: 'Burlington', county: 'Alamance' },
        { name: 'Lexington', county: 'Davidson' },
        { name: 'Asheboro', county: 'Randolph' },
      ],
    },
    {
      name: 'Coastal NC',
      counties: ['New Hanover', 'Brunswick', 'Onslow', 'Pender', 'Carteret'],
      cities: [
        { name: 'Wilmington', county: 'New Hanover' },
        { name: 'Leland', county: 'Brunswick' },
        { name: 'Jacksonville', county: 'Onslow' },
        { name: 'Hampstead', county: 'Pender' },
        { name: 'Morehead City', county: 'Carteret' },
      ],
    },
  ],
  TX: [
    {
      name: 'Dallas-Fort Worth',
      counties: ['Dallas', 'Tarrant', 'Collin', 'Denton', 'Rockwall'],
      cities: [
        { name: 'Dallas', county: 'Dallas' },
        { name: 'Fort Worth', county: 'Tarrant' },
        { name: 'Arlington', county: 'Tarrant' },
        { name: 'Plano', county: 'Collin' },
        { name: 'Frisco', county: 'Collin' },
        { name: 'Denton', county: 'Denton' },
        { name: 'Rockwall', county: 'Rockwall' },
      ],
    },
    {
      name: 'Houston Metro',
      counties: ['Harris', 'Fort Bend', 'Montgomery', 'Brazoria', 'Galveston'],
      cities: [
        { name: 'Houston', county: 'Harris' },
        { name: 'Katy', county: 'Harris' },
        { name: 'Sugar Land', county: 'Fort Bend' },
        { name: 'The Woodlands', county: 'Montgomery' },
        { name: 'Pearland', county: 'Brazoria' },
        { name: 'Galveston', county: 'Galveston' },
      ],
    },
    {
      name: 'Austin-San Antonio',
      counties: ['Travis', 'Williamson', 'Hays', 'Bexar', 'Comal'],
      cities: [
        { name: 'Austin', county: 'Travis' },
        { name: 'Round Rock', county: 'Williamson' },
        { name: 'San Marcos', county: 'Hays' },
        { name: 'San Antonio', county: 'Bexar' },
        { name: 'New Braunfels', county: 'Comal' },
      ],
    },
    {
      name: 'East Texas',
      counties: ['Smith', 'Gregg', 'Bowie', 'Nacogdoches', 'Angelina'],
      cities: [
        { name: 'Tyler', county: 'Smith' },
        { name: 'Longview', county: 'Gregg' },
        { name: 'Texarkana', county: 'Bowie' },
        { name: 'Nacogdoches', county: 'Nacogdoches' },
        { name: 'Lufkin', county: 'Angelina' },
      ],
    },
  ],
} as const;

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    county: '',
    state: 'NC',
    serviceArea: '',
    zip: '',
    parcelId: '',
    propertyType: 'single_family',
    acquisitionDate: '',
    bankReference: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new property object
    const newProperty: PreserveProperty = {
      id: Date.now().toString(),
      address: formData.address,
      city: formData.city,
      county: formData.county,
      state: formData.state,
      serviceArea: formData.serviceArea,
      zip: formData.zip,
      propertyType: formData.propertyType,
      acquisitionDate: formData.acquisitionDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      bankReference: formData.bankReference || `REF-${Date.now()}`,
      parcelId: formData.parcelId,
      notes: formData.notes,
    };

    writeProperties([newProperty, ...readProperties()]);
    setSubmitted(true);
    
    // Redirect to properties list after 2 seconds
    setTimeout(() => {
      setSubmitted(false);
      window.location.href = '/dashboard/properties';
    }, 2000);
  };

  const stateAreas = SERVICE_AREAS[formData.state as keyof typeof SERVICE_AREAS] || [];
  const selectedArea = stateAreas.find(area => area.name === formData.serviceArea);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(previous => {
      if (name === 'state') {
        return { ...previous, state: value, serviceArea: '', city: '', county: '' };
      }

      if (name === 'serviceArea') {
        return { ...previous, serviceArea: value, city: '', county: '' };
      }

      if (name === 'city') {
        const city = selectedArea?.cities.find(option => option.name === value);
        return { ...previous, city: value, county: city?.county || previous.county };
      }

      return { ...previous, [name]: value };
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Added Successfully!</h2>
          <p className="text-slate-600 mb-6">Your property has been added. You can now schedule services for it.</p>
          <div className="text-sm text-slate-500">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <span className="text-xl md:text-2xl font-bold text-slate-900">Preserve</span>
              </Link>
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Add a Property</h1>
          <p className="text-slate-600">Enter your property details to start managing and scheduling services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Address Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Property Location</h2>
                <p className="text-sm text-slate-600">Enter the property address and location details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="1234 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                >
                  <option value="NC">North Carolina</option>
                  <option value="TX">Texas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Area *
                </label>
                <select
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                >
                  <option value="">Select nearest market</option>
                  {stateAreas.map(area => (
                    <option key={area.name} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!selectedArea}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">{selectedArea ? 'Select city' : 'Select service area first'}</option>
                  {selectedArea?.cities.map(city => (
                    <option key={`${city.name}-${city.county}`} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  County
                </label>
                <input
                  type="text"
                  name="county"
                  value={formData.county}
                  readOnly
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900"
                  placeholder="Auto-filled from city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{5}"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="27701"
                />
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Property Information</h2>
                <p className="text-sm text-slate-600">Property type and identification details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="single_family">Single Family Home</option>
                  <option value="condo">Condo/Townhouse</option>
                  <option value="multi_family">Multi-Family</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Parcel ID / Tax ID
                </label>
                <input
                  type="text"
                  name="parcelId"
                  value={formData.parcelId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="123-456-789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date Added to Portfolio
                </label>
                <input
                  type="date"
                  name="acquisitionDate"
                  value={formData.acquisitionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Nickname / Reference (Optional)
                </label>
                <input
                  type="text"
                  name="bankReference"
                  value={formData.bankReference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  placeholder="e.g. Beach House, Rental Unit A"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Additional Notes</h2>
                <p className="text-sm text-slate-600">Any special instructions or property conditions</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Property Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="Enter any special instructions, access codes, known issues, or other relevant information..."
              />
            </div>
          </div>

          {/* Documents Upload (UI Only) */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Documents (Optional)</h2>
                <p className="text-sm text-slate-600">Upload property documents, photos, or deeds</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 md:p-8 text-center hover:border-blue-400 transition">
              <Upload className="w-10 h-10 md:w-12 md:h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-2 text-sm md:text-base">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-slate-500">Supported: PDF, JPG, PNG (Max 10MB)</p>
              <button
                type="button"
                className="mt-4 px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition text-sm"
              >
                Choose Files
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 pb-8">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-center"
            >
              Add Property & Request Service
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
