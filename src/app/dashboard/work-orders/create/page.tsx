'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Wrench, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  Home,
  Shield,
  Snowflake,
  Camera,
  Trash2,
  PaintBucket
} from 'lucide-react';

export default function CreateWorkOrderPage() {
  const [formData, setFormData] = useState({
    propertyId: '',
    serviceType: 'lawn_maintenance',
    priority: 'normal',
    scheduledDate: '',
    description: '',
    urgency: '',
    accessInstructions: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const serviceTypes = [
    { value: 'lawn_maintenance', label: 'Lawn & Grounds Maintenance', icon: Home, color: 'green' },
    { value: 'securing', label: 'Property Securing', icon: Shield, color: 'blue' },
    { value: 'winterization', label: 'Winterization', icon: Snowflake, color: 'cyan' },
    { value: 'inspection', label: 'Property Inspection', icon: Camera, color: 'purple' },
    { value: 'debris_removal', label: 'Debris Removal', icon: Trash2, color: 'orange' },
    { value: 'repair', label: 'Minor Repairs & Painting', icon: PaintBucket, color: 'pink' }
  ];

  const sampleProperties = [
    { id: '1', address: '1234 Main Street, Durham, NC 27701' },
    { id: '2', address: '5678 Oak Avenue, Raleigh, NC 27601' },
    { id: '3', address: '9012 Pine Road, Charlotte, NC 28201' },
    { id: '4', address: '3456 Elm Court, Durham, NC 27703' },
    { id: '5', address: '7890 Maple Drive, Greensboro, NC 27401' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Work Order submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      window.location.href = '/dashboard/work-orders';
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Work Order Created!</h2>
          <p className="text-slate-600 mb-6">Your service request has been submitted to Preserve. We&apos;ll begin work shortly.</p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Work Order #:</strong> WO-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </p>
          </div>
          <div className="text-sm text-slate-500">Redirecting to work orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">Preserve</span>
              </Link>
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Work Order</h1>
          <p className="text-slate-600">Request preservation services for your property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Selection */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Select Property</h2>
                <p className="text-sm text-slate-600">Choose the property that needs service</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Property Address *
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a property</option>
                {sampleProperties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.address}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-slate-500">
                Don&apos;t see your property? <Link href="/dashboard/properties/add" className="text-blue-600 hover:underline">Add a new property</Link>
              </p>
            </div>
          </div>

          {/* Service Type Selection */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Service Type</h2>
                <p className="text-sm text-slate-600">What service do you need?</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {serviceTypes.map(service => {
                const Icon = service.icon;
                const isSelected = formData.serviceType === service.value;
                return (
                  <label
                    key={service.value}
                    className={`relative flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.value}
                      checked={isSelected}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {service.label}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Priority & Scheduling */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Priority & Schedule</h2>
                <p className="text-sm text-slate-600">When do you need this service?</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority Level *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - Routine maintenance</option>
                  <option value="normal">Normal - Standard service</option>
                  <option value="high">High - Needs attention soon</option>
                  <option value="emergency">Emergency - Immediate response</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Service Date *
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Service Details</h2>
                <p className="text-sm text-slate-600">Describe what needs to be done</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the service needed, specific issues, or areas of concern..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Urgency / Special Instructions
                </label>
                <textarea
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any code violations, HOA complaints, or time-sensitive issues?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Access Instructions
                </label>
                <textarea
                  name="accessInstructions"
                  value={formData.accessInstructions}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Gate codes, lockbox location, key pickup instructions, etc."
                />
              </div>
            </div>
          </div>

          {/* Estimated Cost Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Pricing Information</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Service costs vary based on property size, condition, and service type. You&apos;ll receive a detailed quote within 24 hours.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-slate-600">Lawn Maintenance</div>
                    <div className="font-semibold text-slate-900">$75 - $200</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-slate-600">Property Securing</div>
                    <div className="font-semibold text-slate-900">$150 - $500</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-slate-600">Winterization</div>
                    <div className="font-semibold text-slate-900">$200 - $400</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-slate-600">Inspections</div>
                    <div className="font-semibold text-slate-900">$100 - $250</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
            >
              <Wrench className="w-5 h-5" />
              Submit Work Order
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
