'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home,
  Calendar, 
  ShoppingCart,
  Plus,
  Minus,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { serviceCatalog, calculateMonthlyCost } from '@/lib/supabase';
import {
  readProperties,
  readWorkOrders,
  type PreserveProperty,
  type PreserveWorkOrder,
  writeWorkOrders,
} from '@/lib/localData';

type SelectedService = {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  frequency: string;
  unit: string;
  total: number;
};

type BillingFrequency = 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export default function CreateWorkOrderV2Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    propertyId: '',
    priority: 'normal',
    scheduledDate: '',
    description: '',
    accessInstructions: ''
  });

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('monthly');
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [properties, setProperties] = useState<PreserveProperty[]>([]);

  useEffect(() => {
    const storedProperties = readProperties();
    const requestedPropertyId = new URLSearchParams(window.location.search).get('propertyId') || '';

    setProperties(storedProperties);
    if (requestedPropertyId && storedProperties.some(property => property.id === requestedPropertyId)) {
      setFormData(current => ({ ...current, propertyId: requestedPropertyId }));
    }
  }, []);

  const categories = [...new Set(serviceCatalog.map(s => s.category))];

  // Add Full Preservation Package (all recurring services)
  const addFullPackage = () => {
    const recurringServices = serviceCatalog.filter(s => 
      s.frequency === 'monthly' || s.frequency === 'quarterly'
    );
    const newServices: SelectedService[] = recurringServices.map(service => ({
      id: service.id,
      name: service.name,
      basePrice: service.basePrice,
      quantity: 1,
      frequency: service.frequency,
      unit: service.unit,
      total: service.basePrice
    }));
    setSelectedServices(newServices);
  };

  const addService = (service: typeof serviceCatalog[0]) => {
    const existing = selectedServices.find(s => s.id === service.id);
    if (existing) {
      // Toggle off if clicking an already selected service
      removeService(service.id);
    } else {
      // Add new service
      setSelectedServices([...selectedServices, {
        id: service.id,
        name: service.name,
        basePrice: service.basePrice,
        quantity: 1,
        frequency: service.frequency,
        unit: service.unit,
        total: service.basePrice
      }]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, change: number) => {
    setSelectedServices(selectedServices.map(s => {
      if (s.id === serviceId) {
        const newQuantity = Math.max(1, s.quantity + change);
        return { ...s, quantity: newQuantity, total: newQuantity * s.basePrice };
      }
      return s;
    }));
  };

  const getTotalCost = () => {
    return selectedServices.reduce((sum, service) => sum + service.total, 0);
  };

  const getMonthlyEstimate = () => {
    return selectedServices.reduce((sum, service) => {
      const serviceDef = serviceCatalog.find(s => s.id === service.id);
      if (serviceDef) {
        return sum + calculateMonthlyCost(service.total, serviceDef.frequency);
      }
      return sum;
    }, 0);
  };

  const getQuarterlyEstimate = () => {
    return getMonthlyEstimate() * 3;
  };

  const getBillingAmount = () => {
    if (billingFrequency === 'one-time') {
      return getTotalCost();
    } else if (billingFrequency === 'weekly') {
      return getMonthlyEstimate() / 4;
    } else if (billingFrequency === 'monthly') {
      return getMonthlyEstimate();
    } else if (billingFrequency === 'quarterly') {
      return getQuarterlyEstimate();
    } else {
      // yearly
      return getMonthlyEstimate() * 12 * 0.9; // 10% discount
    }
  };
  
  const getBillingLabel = () => {
    switch (billingFrequency) {
      case 'one-time': return 'Total Cost';
      case 'weekly': return 'Weekly Cost';
      case 'monthly': return 'Monthly Cost';
      case 'quarterly': return 'Quarterly Cost';
      case 'yearly': return 'Yearly Cost';
      default: return 'Total Cost';
    }
  };
  
  const getBillingSuffix = () => {
    switch (billingFrequency) {
      case 'weekly': return '/wk';
      case 'monthly': return '/mo';
      case 'quarterly': return '/qtr';
      case 'yearly': return '/yr';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const woNumber = `WO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setOrderNumber(woNumber);
    
    const selectedProperty = properties.find(p => p.id === formData.propertyId);
    const newWorkOrder: PreserveWorkOrder = {
      id: Date.now().toString(),
      orderNumber: woNumber,
      propertyId: formData.propertyId,
      propertyAddress: selectedProperty
        ? [selectedProperty.address, selectedProperty.city, selectedProperty.state, selectedProperty.zip]
            .filter(Boolean)
            .join(', ')
        : '',
      serviceType: selectedServices.map(s => s.name).join(', '),
      services: selectedServices,
      status: 'pending',
      priority: formData.priority || 'medium',
      scheduledDate: formData.scheduledDate || new Date().toISOString(),
      billingFrequency,
      totalCost: getTotalCost(),
      billingAmount: getBillingAmount(),
      description: formData.description || '',
      accessInstructions: formData.accessInstructions || '',
      createdAt: new Date().toISOString(),
    };

    writeWorkOrders([newWorkOrder, ...readWorkOrders()]);
    
    setSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard/work-orders');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Work Order Created!</h2>
            <p className="text-lg text-slate-600 mb-6">
              Your service request has been submitted to Preserve. We&apos;ll begin work shortly.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Work Order Number</p>
                  <p className="text-lg font-bold text-blue-900">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Billing Type</p>
                  <p className="text-lg font-bold text-blue-900 capitalize">{billingFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Services</p>
                  <p className="text-lg font-bold text-blue-900">{selectedServices.length}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    {getBillingLabel()}
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    ${getBillingAmount().toFixed(0)}
                    {getBillingSuffix()}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-500 mb-6">Redirecting to work orders...</div>
            
            <Link
              href="/dashboard/work-orders"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              View Work Orders
            </Link>
          </div>
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
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Request Preservation Services</h1>
          <p className="text-slate-600">Select the services you need to maintain your property</p>
        </div>

        {/* Mobile Order Summary Bar */}
        {selectedServices.length > 0 && (
          <div className="lg:hidden sticky top-16 z-30 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{selectedServices.length}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-slate-500">
                  ${getBillingAmount().toFixed(0)}{getBillingSuffix()} · {billingFrequency}
                </p>
              </div>
            </div>
            <button
              type="submit"
              form="work-order-form"
              disabled={!formData.propertyId}
              className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}

        <form id="work-order-form" onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Service Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Selection */}
              <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Select Property</h2>
                    <p className="text-sm text-slate-600">Choose the property that needs service</p>
                  </div>
                </div>

                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="">Select a property</option>
                  {properties.length === 0 ? (
                    <option value="" disabled>No properties available - Add a property first</option>
                  ) : (
                    properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.address}, {property.city}, {property.state} {property.zip}
                      </option>
                    ))
                  )}
                </select>
                {properties.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    ⚠️ You need to <Link href="/dashboard/properties/add" className="underline font-semibold">add a property</Link> before creating a work order.
                  </p>
                )}
              </div>

              {/* Service Catalog */}
              <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-slate-900">Select Services (Multiple)</h2>
                      <p className="text-sm text-slate-600">Click to add multiple services - they&apos;ll appear in your cart</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addFullPackage}
                    className="px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Full Preservation Package</span>
                    <span className="sm:hidden">Full Package</span>
                  </button>
                </div>

                {/* Full Package Info Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-1">Full Preservation Package</h3>
                      <p className="text-sm text-green-800 mb-2">
                        Get all recurring preservation services at once. Includes lawn care, interior house cleaning, exterior cleaning, inspections, and regular maintenance.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                        <span className="text-green-700 font-medium">💰 Best Value</span>
                        <span className="text-green-700 font-medium">🏠 Complete Protection</span>
                        <span className="text-green-700 font-medium">📅 Recurring Services</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Helper Text */}
                {selectedServices.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ✓ <strong>{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}</strong> added to cart. 
                      Keep clicking to add more!
                    </p>
                  </div>
                )}

                {categories.map(category => {
                  const categoryServices = serviceCatalog.filter(s => s.category === category);
                  return (
                    <div key={category} className="mb-6 last:mb-0">
                      <h3 className="font-semibold text-slate-900 mb-3 pb-2 border-b flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-xs text-slate-500 font-normal">Click any service to add</span>
                      </h3>
                      <div className="space-y-2">
                        {categoryServices.map(service => {
                          const isSelected = selectedServices.some(s => s.id === service.id);
                          const selectedService = selectedServices.find(s => s.id === service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => addService(service)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition relative ${
                                isSelected
                                  ? 'border-green-500 bg-green-50 shadow-lg'
                                  : 'border-slate-200 hover:border-blue-400 hover:shadow-md bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                {/* Left Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 mb-1">
                                    <h4 className={`font-semibold flex-1 ${isSelected ? 'text-green-900' : 'text-slate-900'}`}>
                                      {service.name}
                                    </h4>
                                    {/* Status Badge - Inline with title */}
                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
                                      isSelected 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-slate-200 text-slate-600'
                                    }`}>
                                      {isSelected ? (
                                        <>
                                          <CheckCircle2 className="w-3 h-3" />
                                          Added{selectedService && selectedService.quantity > 1 ? ` ×${selectedService.quantity}` : ''}
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="w-3 h-3" />
                                          Add
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-slate-500">
                                      {service.frequency === 'as-needed' ? 'As Needed' : 
                                       service.frequency.charAt(0).toUpperCase() + service.frequency.slice(1)}
                                    </span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500">{service.unit}</span>
                                  </div>
                                </div>
                                {/* Right Price - Always visible */}
                                <div className="text-right flex-shrink-0 ml-2">
                                  <div className="text-xl md:text-2xl font-bold text-blue-600 whitespace-nowrap">
                                    ${service.basePrice}
                                  </div>
                                  <div className="text-xs text-slate-500">{service.unit}</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Schedule & Details */}
              <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Schedule & Details</h2>
                    <p className="text-sm text-slate-600">When should we start?</p>
                  </div>
                </div>

                <div className="space-y-6">
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
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      >
                        <option value="low">Low - Routine maintenance</option>
                        <option value="normal">Normal - Standard service</option>
                        <option value="high">High - Needs attention soon</option>
                        <option value="emergency">Emergency - Immediate response</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer hover:border-blue-400 transition bg-white"
                          style={{ colorScheme: 'light' }}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Click the calendar icon or input field to select a date</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Instructions
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      placeholder="Any special requests or areas of concern..."
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      placeholder="Gate codes, lockbox location, key pickup instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Mobile-only Order Summary Card */}
              <div className="lg:hidden bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
                </div>

                {selectedServices.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No services selected yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {selectedServices.map(service => (
                        <div key={service.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{service.name}</p>
                            <p className="text-xs text-slate-500">${service.basePrice} × {service.quantity}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button type="button" onClick={() => updateQuantity(service.id, -1)}
                              className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                              <Minus className="w-3 h-3 text-slate-600" />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{service.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(service.id, 1)}
                              className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                              <Plus className="w-3 h-3 text-slate-600" />
                            </button>
                            <button type="button" onClick={() => removeService(service.id)}
                              className="text-red-500 text-xs ml-1">✕</button>
                          </div>
                          <p className="font-semibold text-slate-900 text-sm flex-shrink-0">${service.total}</p>
                        </div>
                      ))}
                    </div>

                    {/* Billing Frequency - Mobile */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Billing Frequency</label>
                      <select
                        value={billingFrequency}
                        onChange={e => setBillingFrequency(e.target.value as BillingFrequency)}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="one-time">One-Time — ${getTotalCost().toLocaleString()}</option>
                        <option value="weekly">Weekly — ${(getMonthlyEstimate() / 4).toFixed(0)}/wk</option>
                        <option value="monthly">Monthly — ${getMonthlyEstimate().toFixed(0)}/mo</option>
                        <option value="quarterly">Quarterly — ${getQuarterlyEstimate().toFixed(0)}/qtr (Save 5%)</option>
                        <option value="yearly">Yearly — ${(getMonthlyEstimate() * 12 * 0.9).toFixed(0)}/yr (Save 10%)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                      <span className="font-semibold text-slate-900 text-sm">{getBillingLabel()}</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${getBillingAmount().toFixed(0)}{getBillingSuffix()}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedServices.length === 0 || !formData.propertyId}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {billingFrequency === 'one-time' ? '🛒 Submit Order' : '✅ Subscribe & Submit'}
                    </button>
                    {!formData.propertyId && (
                      <p className="text-xs text-center text-amber-600 mt-2">⚠️ Please select a property first</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary (Desktop Sticky, already in code below) */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg border p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Order Summary</h2>
                  </div>

                  {selectedServices.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No services selected yet</p>
                      <p className="text-slate-400 text-xs mt-1">Choose services from the left</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {selectedServices.map(service => (
                          <div key={service.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 pr-2">
                                <h4 className="font-medium text-slate-900 text-sm">{service.name}</h4>
                                <p className="text-xs text-slate-500">
                                  ${service.basePrice} × {service.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900">${service.total}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(service.id, -1)}
                                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center transition"
                              >
                                <Minus className="w-4 h-4 text-slate-600" />
                              </button>
                              <span className="text-sm font-medium text-slate-700 w-8 text-center">
                                {service.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(service.id, 1)}
                                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center transition"
                              >
                                <Plus className="w-4 h-4 text-slate-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeService(service.id)}
                                className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Billing Frequency Selector */}
                      <div className="border-t pt-4 mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Billing Frequency
                        </label>
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setBillingFrequency('one-time')}
                            className={`w-full p-3 rounded-lg border-2 transition text-left ${
                              billingFrequency === 'one-time'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">One-Time</div>
                                <div className="text-xs text-slate-600">Pay once for all services</div>
                              </div>
                              <div className="text-base md:text-lg font-bold text-slate-900">
                                ${getTotalCost().toLocaleString()}
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBillingFrequency('weekly')}
                            className={`w-full p-3 rounded-lg border-2 transition text-left ${
                              billingFrequency === 'weekly'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">Weekly Subscription</div>
                                <div className="text-xs text-slate-600">Automatic weekly billing</div>
                              </div>
                              <div className="text-base md:text-lg font-bold text-blue-600">
                                ${(getMonthlyEstimate() / 4).toFixed(0)}/wk
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBillingFrequency('monthly')}
                            className={`w-full p-3 rounded-lg border-2 transition text-left ${
                              billingFrequency === 'monthly'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">Monthly Subscription</div>
                                <div className="text-xs text-slate-600">Automatic monthly billing</div>
                              </div>
                              <div className="text-base md:text-lg font-bold text-green-600">
                                ${getMonthlyEstimate().toFixed(0)}/mo
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBillingFrequency('quarterly')}
                            className={`w-full p-3 rounded-lg border-2 transition text-left ${
                              billingFrequency === 'quarterly'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-slate-900">Quarterly Subscription</div>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                                    SAVE 5%
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600">Bill every 3 months</div>
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                ${getQuarterlyEstimate().toFixed(0)}/qtr
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBillingFrequency('yearly')}
                            className={`w-full p-3 rounded-lg border-2 transition text-left ${
                              billingFrequency === 'yearly'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-slate-900">Yearly Subscription</div>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                                    SAVE 10%
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600">Bill annually - best value</div>
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                ${(getMonthlyEstimate() * 12 * 0.9).toFixed(0)}/yr
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Services Selected</span>
                          <span className="font-medium text-slate-900">{selectedServices.length}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-900">
                              {getBillingLabel()}
                            </span>
                            <span className="text-2xl font-bold text-blue-600">
                              ${getBillingAmount().toFixed(0)}
                              {billingFrequency !== 'one-time' && (
                                <span className="text-sm">{getBillingSuffix()}</span>
                              )}
                            </span>
                          </div>
                          {billingFrequency !== 'one-time' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                              <p className="text-xs text-green-800">
                                <strong>Subscription Benefits:</strong> Automatic scheduling, priority service, and consistent property care.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={selectedServices.length === 0 || !formData.propertyId}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {billingFrequency === 'one-time' ? '🛒 Checkout & Submit Order' : '✅ Subscribe & Submit Order'}
                      </button>
                      
                      {billingFrequency !== 'one-time' && (
                        <p className="text-xs text-center text-slate-500 mt-2">
                          You can cancel your subscription anytime
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Help Card */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 text-sm mb-2">Need Help?</h3>
                  <p className="text-xs text-blue-800">
                    Not sure which services you need? Our team can help you create a custom preservation plan. Contact us through the portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
