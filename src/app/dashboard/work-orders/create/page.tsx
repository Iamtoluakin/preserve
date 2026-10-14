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
  CheckCircle2,
  Snowflake,
  Sparkles,
} from 'lucide-react';
import { serviceCatalog, calculateMonthlyCost, supabase } from '@/lib/supabase';
import {
  readProperties,
  readWorkOrders,
  type PreserveProperty,
  type PreserveWorkOrder,
  writeWorkOrders,
} from '@/lib/localData';
import { notifyNewWorkOrder, notifyWorkOrderProgress } from '@/lib/notificationClient';
import {
  homeMaintenanceTasks,
  maintenanceFrequencyOptions,
  type CustomerMaintenanceTask,
  type MaintenanceFrequency,
} from '@/lib/homeMaintenance';

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
type SubscriptionInterval = 'monthly' | 'quarterly' | 'yearly';
type ServiceFolderId = 'inspection' | 'work-orders' | 'maintenance' | 'hvac' | 'lawn';

const serviceFolders: {
  id: ServiceFolderId;
  title: string;
  summary: string;
  icon: typeof Home;
  serviceIds: string[];
}[] = [
  { id: 'inspection', title: 'Inspection', summary: 'Home checks, condition reports, and photos', icon: CheckCircle2, serviceIds: ['full_inspection', 'photo_documentation'] },
  { id: 'work-orders', title: 'One-Time Requests', summary: 'Repairs, cleanup, debris removal, property securing, and urgent help', icon: ShoppingCart, serviceIds: ['move_out_deep_clean', 'odor_sanitation', 'property_securing', 'board_up', 'debris_removal', 'minor_repairs', 'emergency_response'] },
  { id: 'maintenance', title: 'Maintenance', summary: 'Recurring home-care tasks and seasonal services', icon: Calendar, serviceIds: ['exterior_cleaning', 'pressure_washing', 'window_cleaning', 'interior_house_cleaning', 'winterization', 'de_winterization', 'gutter_cleaning', 'pest_control'] },
  { id: 'hvac', title: 'HVAC', summary: 'Heating, cooling, and system service', icon: Snowflake, serviceIds: ['hvac_check'] },
  { id: 'lawn', title: 'Lawn', summary: 'Mowing, yard cleanup, and grounds care', icon: Home, serviceIds: ['lawn_mowing', 'lawn_cleanup'] },
];

const maintenanceTaskPriceService: Record<string, string> = {
  'exterior-wash': 'pressure_washing',
  'gutters-roof': 'gutter_cleaning',
  'termite-plan': 'pest_control',
};

const visitsPerYear: Record<MaintenanceFrequency, number | null> = {
  'Monthly': 12,
  'Every 2 months': 6,
  'Quarterly': 4,
  'Twice a year': 2,
  'Annually': 1,
  'As needed': null,
};

const WORK_ORDER_DRAFT_KEY = 'preserve_work_order_draft';

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
  const [activeServiceFolder, setActiveServiceFolder] = useState<ServiceFolderId | null>(null);
  const [selectedMaintenanceTasks, setSelectedMaintenanceTasks] = useState<Record<string, CustomerMaintenanceTask>>({});
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('monthly');
  const [planBillingFrequency, setPlanBillingFrequency] = useState<SubscriptionInterval>('monthly');
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [properties, setProperties] = useState<PreserveProperty[]>([]);

  useEffect(() => {
    const storedProperties = readProperties();
    const requestedPropertyId = new URLSearchParams(window.location.search).get('propertyId') || '';
    const savedDraft = window.localStorage.getItem(WORK_ORDER_DRAFT_KEY);

    setProperties(storedProperties);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(current => ({ ...current, ...draft.formData }));
        setSelectedServices(Array.isArray(draft.selectedServices) ? draft.selectedServices : []);
        setActiveServiceFolder(draft.activeServiceFolder || null);
        const savedMaintenancePlan = Array.isArray(draft.maintenancePlan) ? draft.maintenancePlan as CustomerMaintenanceTask[] : [];
        setSelectedMaintenanceTasks(Object.fromEntries(savedMaintenancePlan.map(task => [task.id, task])));
        setBillingFrequency(draft.billingFrequency || 'monthly');
        setPlanBillingFrequency(draft.planBillingFrequency || 'monthly');
        window.localStorage.removeItem(WORK_ORDER_DRAFT_KEY);
        return;
      } catch {
        window.localStorage.removeItem(WORK_ORDER_DRAFT_KEY);
      }
    }

    if (requestedPropertyId && storedProperties.some(property => property.id === requestedPropertyId)) {
      setFormData(current => ({ ...current, propertyId: requestedPropertyId }));
    }
  }, []);

  const activeFolder = serviceFolders.find(folder => folder.id === activeServiceFolder);
  const folderServices = activeFolder
    ? serviceCatalog.filter(service => activeFolder.serviceIds.includes(service.id))
    : [];
  const categories = [...new Set(folderServices.map(service => service.category))];
  const maintenanceCategories = [...new Set(homeMaintenanceTasks.map(task => task.category))];
  const maintenancePlan = Object.values(selectedMaintenanceTasks);
  const maintenancePricePreview = maintenancePlan.map(task => {
    const catalogService = serviceCatalog.find(service => service.id === maintenanceTaskPriceService[task.id]);
    const yearlyVisits = visitsPerYear[task.firstYearFrequency];
    return {
      task,
      visitPrice: catalogService?.basePrice,
      monthlyEstimate: catalogService && yearlyVisits ? catalogService.basePrice * yearlyVisits / 12 : null,
    };
  });
  const pricedMaintenanceTasks = maintenancePricePreview.filter(item => item.monthlyEstimate !== null);
  const pendingMaintenancePriceCount = maintenancePricePreview.length - pricedMaintenanceTasks.length;
  const maintenanceMonthlyEstimate = pricedMaintenanceTasks.reduce((sum, item) => sum + (item.monthlyEstimate || 0), 0);
  const selectedCount = selectedServices.length + maintenancePlan.length;
  const preferredBillingFrequency = maintenancePlan.length ? planBillingFrequency : billingFrequency;
  const selectedProperty = properties.find(property => property.id === formData.propertyId);
  const homeAge = selectedProperty?.yearBuilt ? new Date().getFullYear() - selectedProperty.yearBuilt : null;
  const recommendedTaskIds = new Set([
    'smoke-alarms', 'gfi-outlets', 'air-filters', 'gutters-roof', 'water-heater',
    ...(homeAge !== null && homeAge >= 20 ? ['foundation-drains', 'exterior-caulk', 'crawlspace-lines', 'main-water-valve', 'steps-rails'] : []),
  ]);
  const recommendedTasks = homeMaintenanceTasks.filter(task => recommendedTaskIds.has(task.id));
  const recommendationReason = homeAge === null
    ? 'A balanced starter checklist covers routine safety, HVAC, drainage, and water-heater checks. Add the year built to tailor it for an older home.'
    : homeAge >= 20
      ? `Built in ${selectedProperty?.yearBuilt}, this home is about ${homeAge} years old. The suggested checklist adds closer checks for drainage, seals, crawlspace lines, and shutoffs alongside routine upkeep.`
      : `Built in ${selectedProperty?.yearBuilt}, this home is about ${homeAge} years old. The suggested checklist starts with routine safety, HVAC, drainage, and water-heater upkeep.`;

  const addRecommendedMaintenancePlan = () => {
    setSelectedMaintenanceTasks(Object.fromEntries(homeMaintenanceTasks.map(task => [task.id, {
      id: task.id,
      category: task.category,
      name: task.name,
      firstDueMonth: task.firstDueMonth,
      firstYearFrequency: task.firstYearFrequency,
      ongoingFrequency: task.ongoingFrequency,
    }])));
  };

  const applyPersonalizedRecommendation = () => {
    setSelectedMaintenanceTasks(Object.fromEntries(recommendedTasks.map(task => [task.id, {
      id: task.id,
      category: task.category,
      name: task.name,
      firstDueMonth: task.firstDueMonth,
      firstYearFrequency: task.firstYearFrequency,
      ongoingFrequency: task.ongoingFrequency,
    }])));
  };

  const toggleMaintenanceTask = (task: typeof homeMaintenanceTasks[number]) => {
    setSelectedMaintenanceTasks(current => {
      if (current[task.id]) {
        const next = { ...current };
        delete next[task.id];
        return next;
      }
      return {
        ...current,
        [task.id]: {
          id: task.id,
          category: task.category,
          name: task.name,
          firstDueMonth: task.firstDueMonth,
          firstYearFrequency: task.firstYearFrequency,
          ongoingFrequency: task.ongoingFrequency,
        },
      };
    });
  };

  const toggleMaintenanceCategory = (category: string) => {
    const tasks = homeMaintenanceTasks.filter(task => task.category === category);
    const allSelected = tasks.every(task => selectedMaintenanceTasks[task.id]);
    setSelectedMaintenanceTasks(current => {
      const next = { ...current };
      for (const task of tasks) {
        if (allSelected) delete next[task.id];
        else next[task.id] = {
          id: task.id,
          category: task.category,
          name: task.name,
          firstDueMonth: task.firstDueMonth,
          firstYearFrequency: task.firstYearFrequency,
          ongoingFrequency: task.ongoingFrequency,
        };
      }
      return next;
    });
  };

  const updateMaintenanceTask = <K extends keyof CustomerMaintenanceTask>(
    taskId: string,
    field: K,
    value: CustomerMaintenanceTask[K],
  ) => {
    setSelectedMaintenanceTasks(current => ({
      ...current,
      [taskId]: { ...current[taskId], [field]: value },
    }));
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
      return getMonthlyEstimate() * 12;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.localStorage.setItem(WORK_ORDER_DRAFT_KEY, JSON.stringify({
        formData,
        selectedServices,
        activeServiceFolder,
        maintenancePlan,
        billingFrequency,
        planBillingFrequency,
      }));
      const next = `${window.location.pathname}${window.location.search}`;
      router.push(`/login?next=${encodeURIComponent(next)}&intent=service`);
      return;
    }

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
      serviceType: [
        ...selectedServices.map(s => s.name),
        ...(maintenancePlan.length ? ['Home maintenance subscription plan'] : []),
      ].join(', '),
      services: selectedServices,
      maintenancePlan,
      status: 'submitted',
      priority: formData.priority || 'medium',
      scheduledDate: formData.scheduledDate || new Date().toISOString(),
      billingFrequency: preferredBillingFrequency,
      totalCost: getTotalCost(),
      billingAmount: getBillingAmount(),
      pricingStatus: maintenancePlan.length ? 'quote-pending' : 'estimate',
      description: [
        formData.description,
        maintenancePlan.length
          ? `Requested home-maintenance schedule (${preferredBillingFrequency} preferred billing):\n${maintenancePlan.map(task => `- ${task.name}: first due in month ${task.firstDueMonth} of plan; Year 1 ${task.firstYearFrequency}; after Year 1 ${task.ongoingFrequency}`).join('\n')}`
          : '',
      ].filter(Boolean).join('\n\n'),
      accessInstructions: formData.accessInstructions || '',
      createdAt: new Date().toISOString(),
    };

    writeWorkOrders([newWorkOrder, ...readWorkOrders()]);
    void notifyNewWorkOrder(newWorkOrder);
    void notifyWorkOrderProgress(newWorkOrder, undefined, 'submitted');

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 max-w-2xl w-full">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-200">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{maintenancePlan.length ? 'Maintenance Plan Request Submitted' : 'Work Order Created!'}</h2>
            <p className="text-base sm:text-lg text-slate-600 mb-6">
              {maintenancePlan.length
                ? 'Your selected task schedule and preferred billing interval are saved for review. Preserve will confirm availability and pricing before a subscription starts.'
                : 'Your service request has been submitted to Preserve. We&apos;ll begin work shortly.'}
            </p>
            
            <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6">
              <div className="grid gap-4 min-[380px]:grid-cols-2 text-left">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Work Order Number</p>
                  <p className="text-lg font-bold text-blue-900">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">{maintenancePlan.length ? 'Preferred billing interval' : 'Billing Type'}</p>
                  <p className="text-lg font-bold text-blue-900 capitalize">{preferredBillingFrequency}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Services</p>
                  <p className="text-lg font-bold text-blue-900">{maintenancePlan.length ? `${maintenancePlan.length} plan tasks` : selectedServices.length}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    {maintenancePlan.length ? 'Subscription pricing' : getBillingLabel()}
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {maintenancePlan.length
                      ? `${selectedServices.length ? `$${getBillingAmount().toFixed(0)} service estimate + ` : ''}plan quote pending`
                      : `$${getBillingAmount().toFixed(0)}${getBillingSuffix()}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-500 mb-6">Redirecting to work orders...</div>
            
            <Link
              href="/dashboard/work-orders"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-sky-600"
            >
              View Work Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl md:text-2xl">P</span>
                </div>
                <span className="text-xl md:text-2xl font-bold text-slate-900">Preserve</span>
              </Link>
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 md:px-6 md:py-8">
        <div className="relative isolate mb-6 overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-5 py-6 shadow-sm md:mb-8 md:px-8 md:py-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <p className="inline-flex rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">Your home, cared for</p>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-4xl">Build a Home Care Plan</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">Choose recurring maintenance tasks for a new or longtime home, or request a one-time service. Preserve helps coordinate the work and keep your home on schedule.</p>
        </div>

        {/* Mobile Order Summary Bar */}
        {selectedCount > 0 && (
          <div className="sticky top-16 z-30 flex items-center justify-between gap-2 rounded-2xl border border-blue-100 bg-white/95 px-3 py-2.5 shadow-lg shadow-blue-100/60 backdrop-blur lg:hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-sm">
                <span className="text-white text-xs font-bold">{selectedServices.length}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-slate-500">
                  {maintenancePlan.length
                    ? `${selectedServices.length ? `$${getBillingAmount().toFixed(0)} service estimate + ` : ''}plan quote pending · ${preferredBillingFrequency} preference`
                    : `$${getBillingAmount().toFixed(0)}${getBillingSuffix()} · ${preferredBillingFrequency}`}
                </p>
              </div>
            </div>
            <button
              type="submit"
              form="work-order-form"
              disabled={!formData.propertyId || selectedCount === 0}
              className="min-h-11 flex-shrink-0 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm transition hover:shadow-md md:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-100">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-950 md:text-xl">Select Property</h2>
                    <p className="text-sm text-slate-600">Choose the property that needs service</p>
                  </div>
                </div>

                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
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

              <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/80 to-sky-50/70 p-4 shadow-sm md:p-6" aria-labelledby="service-folders-heading">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">Step 1 · Choose a service folder</p>
                    <h2 id="service-folders-heading" className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">What does your home need?</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Start with a category. We’ll show the matching services, visit cadence, and pricing next.</p>
                  </div>
                  {selectedCount > 0 && <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-2 text-sm font-bold text-blue-800 shadow-sm"><CheckCircle2 className="h-4 w-4" />{selectedCount} selected</span>}
                </div>
                <div className="-mx-1 flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-scroll overscroll-x-contain px-1 pb-3 [scrollbar-width:thin] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-5">
                  {serviceFolders.map(folder => {
                    const FolderIcon = folder.icon;
                    const folderServiceCount = selectedServices.filter(service => folder.serviceIds.includes(service.id)).length;
                    const folderTaskCount = folder.id === 'maintenance' ? maintenancePlan.length : 0;
                    const selected = activeServiceFolder === folder.id;
                    return (
                      <button key={folder.id} type="button" onClick={() => setActiveServiceFolder(folder.id)} aria-pressed={selected}
                        className={`group relative w-[min(78vw,17rem)] shrink-0 snap-start overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto sm:shrink sm:snap-align-none ${selected ? 'border-blue-400 bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200/70' : 'border-white/80 bg-white/90 hover:border-blue-200'}`}>
                        {selected && <span aria-hidden="true" className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-white/15 blur-xl" />}
                        <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition ${selected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'}`}>
                          <FolderIcon className="h-5 w-5" />
                        </div>
                        <span className={`relative mt-3 block font-black ${selected ? 'text-white' : 'text-slate-950'}`}>{folder.title}</span>
                        <span className={`relative mt-1 block min-h-10 text-xs leading-5 ${selected ? 'text-blue-50' : 'text-slate-600'}`}>{folder.summary}</span>
                        <span className={`relative mt-3 inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${selected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {(folderServiceCount + folderTaskCount) > 0 ? `${folderServiceCount + folderTaskCount} selected` : `${folder.serviceIds.length} services`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Home maintenance subscription builder */}
              {activeServiceFolder === 'maintenance' && (
              <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-white p-4 shadow-sm md:p-6" aria-labelledby="home-plan-heading">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm">Step 2 · Recurring home care</p>
                    <h2 id="home-plan-heading" className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">Build a maintenance subscription</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                      Pick the jobs you want Preserve to coordinate. Set a first-year cadence and an ongoing cadence for each task.
                    </p>
                    <div className="mt-4 max-w-3xl rounded-2xl border border-sky-200 bg-sky-50/80 p-4">
                      <p className="flex items-center gap-2 text-sm font-black text-sky-950"><Sparkles className="h-4 w-4" />Suggested starting plan for your home</p>
                      <p className="mt-1 text-sm leading-6 text-sky-900">{recommendationReason}</p>
                      {selectedProperty?.squareFeet && <p className="mt-1 text-xs text-sky-800">Home profile: {selectedProperty.squareFeet.toLocaleString()} sq ft{selectedProperty.propertyType ? ` · ${selectedProperty.propertyType}` : ''}. The suggestion is a starting point; your home’s condition, upgrades, and equipment can change what it needs.</p>}
                    </div>
                  </div>
                  <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
                    <button type="button" onClick={applyPersonalizedRecommendation} className="min-h-12 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:min-h-0 sm:py-2.5">
                      Use suggested plan · {recommendedTasks.length} tasks
                    </button>
                    <button type="button" onClick={addRecommendedMaintenancePlan} className="min-h-12 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50 sm:min-h-0 sm:py-2.5">
                      Add full checklist
                    </button>
                    {maintenancePlan.length > 0 && (
                    <button type="button" onClick={() => setSelectedMaintenanceTasks({})} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 sm:min-h-0 sm:py-2.5">
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm leading-6 text-blue-900 shadow-sm">
                  {maintenancePlan.length} of {homeMaintenanceTasks.length} checklist tasks selected. This is a plan request, not a charge. Preserve will confirm coverage, vendor pricing, and the final subscription price before activation.
                </div>

                {maintenancePlan.length > 0 && (
                  <section className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm" aria-labelledby="maintenance-preview-heading">
                    <div className="flex flex-col gap-3 border-b border-blue-50 bg-gradient-to-r from-blue-50/80 to-sky-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-blue-700">Live selection</p>
                        <h3 id="maintenance-preview-heading" className="mt-1 text-base font-black text-slate-950">Your plan preview</h3>
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-white px-3 py-2 sm:text-right">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500">Known monthly estimate</p>
                        <p className="text-xl font-black text-blue-700">${maintenanceMonthlyEstimate.toFixed(2)}<span className="ml-1 text-xs font-bold text-slate-500">/mo</span></p>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {maintenancePricePreview.map(({ task, visitPrice, monthlyEstimate }) => (
                        <div key={task.id} className="flex items-start gap-3 px-4 py-3">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[0.65rem] font-black text-blue-700">✓</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold leading-5 text-slate-900">{task.name}</p>
                            <p className="mt-0.5 text-xs leading-5 text-slate-500">Year 1: {task.firstYearFrequency} · After Year 1: {task.ongoingFrequency}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            {monthlyEstimate !== null ? (
                              <><p className="text-sm font-black text-slate-900">${monthlyEstimate.toFixed(2)}<span className="text-xs font-semibold text-slate-500">/mo</span></p><p className="text-[0.65rem] text-slate-500">${visitPrice} per visit</p></>
                            ) : <p className="max-w-24 text-xs font-bold leading-4 text-amber-700">Price confirmed after review</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-blue-50 bg-slate-50/70 px-4 py-3">
                      <p className="text-xs leading-5 text-slate-600">
                        {pendingMaintenancePriceCount > 0
                          ? `${pendingMaintenancePriceCount} selected task${pendingMaintenancePriceCount === 1 ? '' : 's'} need vendor pricing, so the ${planBillingFrequency} subscription total is still a quote pending. The estimate above includes only tasks with a matching catalog rate.`
                          : 'Monthly estimate uses the selected Year 1 cadence and matching catalog rates. Preserve confirms the final plan price before activation.'}
                      </p>
                    </div>
                  </section>
                )}

                {maintenancePlan.length > 0 && (
                  <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <label className="text-sm font-medium text-slate-700">
                      Preferred subscription billing interval
                      <select value={planBillingFrequency} onChange={event => setPlanBillingFrequency(event.target.value as SubscriptionInterval)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-slate-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 sm:max-w-xs">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </label>
                    <button type="submit" disabled={!formData.propertyId} className="min-h-12 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-black text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
                      Request plan review
                    </button>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  {maintenanceCategories.map(category => (
                    <div key={category} className="rounded-2xl border border-slate-100 bg-white/75 p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="flex items-center gap-2 text-sm font-black text-slate-900"><span className="h-2 w-2 rounded-full bg-blue-500" />{category}<span className="text-xs font-semibold text-slate-500">{homeMaintenanceTasks.filter(task => task.category === category).length} items</span></h3>
                        <button type="button" onClick={() => toggleMaintenanceCategory(category)} className="min-h-10 rounded-lg px-3 text-xs font-bold text-blue-700 hover:bg-blue-50">
                          {homeMaintenanceTasks.filter(task => task.category === category).every(task => selectedMaintenanceTasks[task.id]) ? 'Clear group' : 'Select group'}
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {homeMaintenanceTasks.filter(task => task.category === category).map(task => {
                          const selected = selectedMaintenanceTasks[task.id];
                          return (
                            <div key={task.id} className={`rounded-xl border p-3 transition-colors ${selected ? 'border-blue-300 bg-blue-50/80 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
                              <label className="flex cursor-pointer items-start gap-3">
                                <input type="checkbox" checked={Boolean(selected)} onChange={() => toggleMaintenanceTask(task)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-semibold text-slate-900">{task.name}</span>
                                  <span className="mt-0.5 block text-xs leading-5 text-slate-600">{task.description}</span>
                                </span>
                              </label>
                              {selected && (
                                <div className="mt-3 grid gap-2 pl-7 sm:grid-cols-3">
                                  <label className="text-xs font-medium text-slate-600">
                                    First due from plan start
                                    <select value={selected.firstDueMonth} onChange={event => updateMaintenanceTask(task.id, 'firstDueMonth', Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100">
                                      {Array.from({ length: 12 }, (_, index) => index + 1).map(month => <option key={month} value={month}>Month {month}</option>)}
                                    </select>
                                  </label>
                                  <label className="text-xs font-medium text-slate-600">
                                    During Year 1
                                    <select value={selected.firstYearFrequency} onChange={event => updateMaintenanceTask(task.id, 'firstYearFrequency', event.target.value as MaintenanceFrequency)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100">
                                      {maintenanceFrequencyOptions.map(frequency => <option key={frequency}>{frequency}</option>)}
                                    </select>
                                  </label>
                                  <label className="text-xs font-medium text-slate-600">
                                    After Year 1
                                    <select value={selected.ongoingFrequency} onChange={event => updateMaintenanceTask(task.id, 'ongoingFrequency', event.target.value as MaintenanceFrequency)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100">
                                      {maintenanceFrequencyOptions.map(frequency => <option key={frequency}>{frequency}</option>)}
                                    </select>
                                  </label>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Cadences are starter recommendations adapted from the supplied checklist. Preserve will confirm each task against the home, local climate, equipment guidance, and warranty requirements.
                </p>
              </section>
              )}

              {/* Open one folder at a time to browse its services and prices. */}
              {activeFolder && (
              <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-white p-4 shadow-sm md:p-6" aria-labelledby="folder-services-heading">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-200">
                      {(() => { const FolderIcon = activeFolder.icon; return <FolderIcon className="h-6 w-6" />; })()}
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700">Step 3 · Browse services</p>
                      <h2 id="folder-services-heading" className="text-xl font-black tracking-tight text-slate-950 md:text-2xl">{activeFolder.title} Services</h2>
                      <p className="text-sm text-slate-600">Select one or more services in this folder. The price and visit frequency are shown on each option.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setActiveServiceFolder(null)} className="rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700">
                    Change folder
                  </button>
                </div>

                {/* Helper Text */}
                {selectedServices.length > 0 && (
                  <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/80 p-4 text-blue-800 shadow-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100"><CheckCircle2 className="h-5 w-5 text-blue-700" /></span>
                    <p className="text-sm">
                      <strong>{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}</strong> added to your request.
                      Keep clicking to add more!
                    </p>
                  </div>
                )}

                {categories.map(category => {
                  const categoryServices = folderServices.filter(service => service.category === category);
                  return (
                    <div key={category} className="mb-6 last:mb-0">
                      <h3 className="mb-3 flex flex-col gap-1 border-b border-blue-100 pb-3 font-black text-slate-950 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                        <span>{category}</span>
                        <span className="text-xs font-medium text-slate-500">Click any service to add</span>
                      </h3>
                      <div className="grid gap-3">
                        {categoryServices.map(service => {
                          const isSelected = selectedServices.some(s => s.id === service.id);
                          const selectedService = selectedServices.find(s => s.id === service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => addService(service)}
                              className={`group w-full text-left p-4 sm:p-5 rounded-2xl border transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                                isSelected
                                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-md shadow-blue-100'
                                  : 'border-slate-200/80 bg-white/90 hover:border-blue-300 hover:shadow-lg'
                              }`}
                            >
                              <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between gap-3 min-[380px]:gap-4">
                                {/* Left Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-start gap-2 mb-1">
                                    <h4 className="flex-1 font-black text-slate-950">
                                      {service.name}
                                    </h4>
                                    {/* Status Badge - Inline with title */}
                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
                                      isSelected 
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700'
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
                                  <p className="mb-3 text-sm leading-6 text-slate-600">{service.description}</p>
                                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                                      {service.frequency === 'as-needed' ? 'As Needed' : 
                                       service.frequency.charAt(0).toUpperCase() + service.frequency.slice(1)}
                                    </span>
                                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-800">{service.unit}</span>
                                  </div>
                                </div>
                                {/* Right Price - Always visible */}
                                <div className="flex min-w-28 flex-col justify-center rounded-xl bg-blue-50/80 px-4 py-3 text-left min-[380px]:ml-2 min-[380px]:text-right">
                                  <div className="whitespace-nowrap text-xl font-black text-blue-700 md:text-2xl">
                                    ${service.basePrice}
                                  </div>
                                  <div className="text-xs font-semibold text-slate-500">per {service.unit}</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
              )}

              {/* Schedule & Details */}
              <div className="rounded-[1.5rem] border border-blue-100 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-100">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-950 md:text-xl">Schedule & Details</h2>
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
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
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
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition hover:border-blue-300 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                      placeholder="Gate codes, lockbox location, key pickup instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Mobile-only Order Summary Card */}
              <div className="lg:hidden rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500"><DollarSign className="h-5 w-5 text-white" /></div>
                  <div><p className="text-[0.6rem] font-black uppercase tracking-[0.16em] text-blue-700">Your selection</p><h2 className="text-lg font-black text-slate-950">Order Summary</h2></div>
                </div>

                {selectedServices.length === 0 ? (
                  maintenancePlan.length > 0 ? (
                    <div className="rounded-xl border border-blue-100 bg-white p-4">
                      <p className="text-sm font-bold text-slate-900">{maintenancePlan.length} maintenance tasks selected</p>
                      <p className="mt-1 text-xs text-slate-500">Known Year 1 monthly equivalent</p>
                      <p className="mt-1 text-2xl font-black text-blue-700">${maintenanceMonthlyEstimate.toFixed(2)}<span className="ml-1 text-sm font-bold text-slate-500">/mo</span></p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{pendingMaintenancePriceCount > 0 ? `${pendingMaintenancePriceCount} task prices still need review; final subscription quote pending.` : 'Final subscription quote pending review.'}</p>
                    </div>
                  ) : (
                    <div className="py-6 text-center"><ShoppingCart className="mx-auto mb-2 h-10 w-10 text-slate-300" /><p className="text-sm text-slate-500">No services selected yet</p></div>
                  )
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {selectedServices.map(service => (
                        <div key={service.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-50 py-3 last:border-b-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{service.name}</p>
                            <p className="text-xs text-slate-500">${service.basePrice} × {service.quantity}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button type="button" onClick={() => updateQuantity(service.id, -1)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                              <Minus className="w-3 h-3 text-slate-600" />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{service.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(service.id, 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="one-time">One-Time — ${getTotalCost().toLocaleString()}</option>
                        <option value="weekly">Weekly — ${(getMonthlyEstimate() / 4).toFixed(0)}/wk</option>
                        <option value="monthly">Monthly — ${getMonthlyEstimate().toFixed(0)}/mo</option>
                        <option value="quarterly">Quarterly — ${getQuarterlyEstimate().toFixed(0)}/qtr (Save 5%)</option>
                        <option value="yearly">Yearly — ${(getMonthlyEstimate() * 12).toFixed(0)}/yr estimate</option>
                      </select>
                    </div>

                    <div className="mb-4 flex items-center justify-between rounded-xl border border-blue-100 bg-white p-3">
                      <span className="font-semibold text-slate-900 text-sm">{getBillingLabel()}</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${getBillingAmount().toFixed(0)}{getBillingSuffix()}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedServices.length === 0 || !formData.propertyId}
                      className="min-h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-3.5 text-base font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {billingFrequency === 'one-time' ? '🛒 Request Service Quote' : '✅ Request Subscription Quote'}
                    </button>
                    {!formData.propertyId && (
                      <p className="text-xs text-center text-amber-600 mt-2">⚠️ Please select a property first</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary (Desktop Sticky, already in code below) */}
            <div className="hidden lg:col-span-1 lg:block">
              <div className="sticky top-24">
                <div className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-white p-4 shadow-xl shadow-blue-100/60 md:p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-100"><DollarSign className="h-5 w-5 text-white" /></div>
                    <div><p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-blue-700">Your selection</p><h2 className="text-lg font-black text-slate-950 md:text-xl">Order Summary</h2></div>
                  </div>

                  {selectedServices.length === 0 ? (
                    maintenancePlan.length > 0 ? (
                      <div className="rounded-2xl border border-blue-100 bg-white p-4">
                        <p className="text-sm font-bold text-slate-900">{maintenancePlan.length} maintenance tasks selected</p>
                        <p className="mt-2 text-xs text-slate-500">Known Year 1 monthly equivalent</p>
                        <p className="mt-1 text-2xl font-black text-blue-700">${maintenanceMonthlyEstimate.toFixed(2)}<span className="ml-1 text-sm font-bold text-slate-500">/mo</span></p>
                        <p className="mt-2 text-xs leading-5 text-slate-600">{pendingMaintenancePriceCount > 0 ? `${pendingMaintenancePriceCount} task prices need review. The total subscription price is quote pending.` : 'The total subscription price is quote pending review.'}</p>
                      </div>
                    ) : (
                      <div className="py-8 text-center"><ShoppingCart className="mx-auto mb-3 h-12 w-12 text-slate-300" /><p className="text-sm text-slate-500">No services selected yet</p><p className="mt-1 text-xs text-slate-400">Choose services from the left</p></div>
                    )
                  ) : (
                    <>
                      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                        {selectedServices.map(service => (
                          <div key={service.id} className="rounded-xl border border-blue-50 bg-white/80 p-3">
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
                                ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">One-Time Request</div>
                                <div className="text-xs text-slate-600">Service estimate, confirmed before work</div>
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
                                ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">Weekly Billing Preference</div>
                                <div className="text-xs text-slate-600">Final quote confirmed before activation</div>
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
                                ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">Monthly Billing Preference</div>
                                <div className="text-xs text-slate-600">Final quote confirmed before activation</div>
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
                                ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-slate-900">Quarterly Billing Preference</div>
                                </div>
                                <div className="text-xs text-slate-600">Preferred interval; final quote confirmed first</div>
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
                                ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-slate-900">Yearly Billing Preference</div>
                                </div>
                                <div className="text-xs text-slate-600">Preferred interval; final quote confirmed first</div>
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                ${(getMonthlyEstimate() * 12).toFixed(0)}/yr
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
                            <div className="mb-2 rounded-xl border border-blue-100 bg-blue-50/80 p-3">
                              <p className="text-xs leading-5 text-blue-900">
                                <strong>Plan request:</strong> Preserve will confirm task schedule, vendor availability, and the final price before activation.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={selectedServices.length === 0 || !formData.propertyId}
                        className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-4 text-lg font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {billingFrequency === 'one-time' ? '🛒 Request Service Quote' : '✅ Request Subscription Quote'}
                      </button>
                      
                      {billingFrequency !== 'one-time' && (
                        <p className="text-xs text-center text-slate-500 mt-2">
                          No recurring charge starts until the plan and price are confirmed.
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Help Card */}
                <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
                  <h3 className="mb-2 text-sm font-black text-blue-900">Need Help?</h3>
                  <p className="text-xs leading-5 text-blue-800">
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
