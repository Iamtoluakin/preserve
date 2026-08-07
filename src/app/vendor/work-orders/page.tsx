'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  DollarSign,
  Camera,
  MessageSquare,
  Play,
  CheckCheck,
  Home,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';
import { readWorkOrders } from '@/lib/localData';
import { supabase } from '@/lib/supabase';

// Work order interface
interface WorkOrder {
  id: string;
  client: string;
  property: string;
  address: string;
  city: string;
  services: string[];
  totalCost: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'new' | 'accepted' | 'in_progress' | 'completed' | 'declined';
  requestedDate: string;
  acceptedDate?: string;
  startedDate?: string;
  completedDate?: string;
  createdAt: string;
  notes?: string;
  progressUpdates?: ProgressUpdate[];
  photos?: Photo[];
}

interface ProgressUpdate {
  id: string;
  timestamp: string;
  message: string;
  status: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  gpsCoordinates?: string;
}

type DispatchAssignment = {
  workOrderId: string;
  contractorName: string;
  companyName: string;
  score: number;
  assignedAt: string;
};

const ASSIGNMENTS_KEY = 'preserve_work_order_assignments';

function readDispatchAssignments(): DispatchAssignment[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(ASSIGNMENTS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readDispatchedVendorOrders(): WorkOrder[] {
  const assignments = readDispatchAssignments();
  if (assignments.length === 0) return [];

  const workOrders = readWorkOrders();
  return assignments
    .flatMap(assignment => {
      const order = workOrders.find(item => item.id === assignment.workOrderId);
      if (!order) return [];

      return [{
        id: order.orderNumber || order.id,
        client: 'PreserveHQ',
        property: order.propertyId || order.id,
        address: order.propertyAddress,
        city: '',
        services: [order.serviceType],
        totalCost: order.totalCost,
        priority: order.priority as WorkOrder['priority'],
        status: order.status === 'assigned' ? 'new' : (order.status.replace('-', '_') as WorkOrder['status']),
        requestedDate: order.scheduledDate || new Date(order.createdAt).toLocaleDateString(),
        createdAt: new Date(order.createdAt).toLocaleString(),
        notes: order.description || order.accessInstructions || `Assigned through PreserveHQ dispatch. Match score: ${assignment.score}/100.`,
        progressUpdates: [],
        photos: [],
      } satisfies WorkOrder];
    });
}

// ─── Detail Panel (shared between mobile and desktop) ──────────────────────
interface DetailPanelProps {
  order: WorkOrder;
  getStatusColor: (s: string) => string;
  getPriorityColor: (p: string) => string;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onAddProgress: () => void;
  onUploadPhoto: () => void;
}

function DetailPanel({
  order,
  getStatusColor,
  getPriorityColor,
  onAccept,
  onDecline,
  onStart,
  onComplete,
  onAddProgress,
  onUploadPhoto,
}: DetailPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{order.id}</h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
          {order.priority.toUpperCase()}
        </span>
      </div>

      {/* Property Info */}
      <div className="mb-5 pb-5 border-b space-y-2">
        <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide text-slate-500">Property Details</h3>
        <div className="text-sm"><span className="text-slate-500">Client:</span> <span className="font-medium text-slate-900">{order.client}</span></div>
        <div className="text-sm"><span className="text-slate-500">Property ID:</span> <span className="font-medium text-slate-900">{order.property}</span></div>
        <div className="text-sm"><span className="text-slate-500">Address:</span> <span className="font-medium text-slate-900">{order.address}, {order.city}</span></div>
        <div className="text-sm"><span className="text-slate-500">Requested:</span> <span className="font-medium text-slate-900">{order.requestedDate}</span></div>
        <div className="text-sm"><span className="text-slate-500">Total Cost:</span> <span className="font-semibold text-green-600">${order.totalCost.toFixed(2)}</span></div>
      </div>

      {/* Services */}
      <div className="mb-5 pb-5 border-b">
        <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide text-slate-500">Services</h3>
        <div className="space-y-1.5">
          {order.services.map((service, idx) => (
            <div key={idx} className="flex items-center text-sm gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-slate-800">{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-5 pb-5 border-b">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide text-slate-500">Notes</h3>
          <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-200">{order.notes}</p>
        </div>
      )}

      {/* Progress Updates */}
      {order.progressUpdates && order.progressUpdates.length > 0 && (
        <div className="mb-5 pb-5 border-b">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide text-slate-500">Progress Updates</h3>
          <div className="space-y-3">
            {order.progressUpdates.map((update) => (
              <div key={update.id} className="flex gap-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-800">{update.message}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{update.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {order.status === 'new' && (
          <>
            <button
              onClick={() => onAccept(order.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Accept Work Order
            </button>
            <button
              onClick={() => onDecline(order.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" /> Decline Work Order
            </button>
          </>
        )}
        {order.status === 'accepted' && (
          <button
            onClick={() => onStart(order.id)}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> Start Work
          </button>
        )}
        {order.status === 'in_progress' && (
          <>
            <button
              onClick={onAddProgress}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" /> Add Progress Update
            </button>
            <button
              onClick={onUploadPhoto}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" /> Upload Photos
            </button>
            <button
              onClick={() => onComplete(order.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-5 h-5" /> Mark as Complete
            </button>
          </>
        )}
        {order.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-800 font-semibold">Work Order Completed</p>
            {order.completedDate && <p className="text-sm text-green-600 mt-1">Completed: {order.completedDate}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VendorWorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'accepted' | 'in_progress' | 'completed'>('all');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Load work orders from localStorage
  useEffect(() => {
    async function loadAssignedWorkOrders() {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const response = await fetch('/api/vendor/work-orders', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (response.ok) {
          const result = await response.json();
          if (Array.isArray(result.workOrders) && result.workOrders.length > 0) {
            setWorkOrders(result.workOrders);
            localStorage.setItem('vendor-work-orders', JSON.stringify(result.workOrders));
            return;
          }
        }
      } catch {
        // Fall through to local/demo data.
      }

      const dispatchedOrders = readDispatchedVendorOrders();
      if (dispatchedOrders.length > 0) {
        setWorkOrders(dispatchedOrders);
        localStorage.setItem('vendor-work-orders', JSON.stringify(dispatchedOrders));
        return;
      }

      const stored = localStorage.getItem('vendor-work-orders');
      if (stored) {
        setWorkOrders(JSON.parse(stored));
      } else {
      // Initialize with sample data
      const sampleOrders: WorkOrder[] = [
        {
          id: 'WO-2025-0234',
          client: 'First National Bank',
          property: 'REO-12345',
          address: '1234 Main Street',
          city: 'Durham, NC 27701',
          services: ['Lawn Mowing', 'Exterior Cleaning'],
          totalCost: 300,
          priority: 'normal',
          status: 'new',
          requestedDate: '2025-12-15',
          createdAt: '2025-12-13 09:30 AM',
          notes: 'Property has been vacant for 3 months. Gate code: 1234',
          progressUpdates: [],
          photos: []
        },
        {
          id: 'WO-2025-0235',
          client: 'Community Savings Bank',
          property: 'REO-67890',
          address: '5678 Oak Avenue',
          city: 'Raleigh, NC 27603',
          services: ['Winterization', 'Property Securing'],
          totalCost: 600,
          priority: 'high',
          status: 'accepted',
          requestedDate: '2025-12-14',
          acceptedDate: '2025-12-13 11:00 AM',
          createdAt: '2025-12-13 10:15 AM',
          notes: 'Urgent - freeze expected this week',
          progressUpdates: [
            {
              id: '1',
              timestamp: '2025-12-13 11:00 AM',
              message: 'Work order accepted. Scheduling for tomorrow morning.',
              status: 'accepted'
            }
          ],
          photos: []
        },
        {
          id: 'WO-2025-0236',
          client: 'Regional Credit Union',
          property: 'REO-11223',
          address: '9012 Pine Road',
          city: 'Charlotte, NC 28202',
          services: ['Full Inspection', 'Photo Documentation'],
          totalCost: 250,
          priority: 'normal',
          status: 'in_progress',
          requestedDate: '2025-12-13',
          acceptedDate: '2025-12-13 08:00 AM',
          startedDate: '2025-12-13 10:00 AM',
          createdAt: '2025-12-13 07:45 AM',
          progressUpdates: [
            {
              id: '1',
              timestamp: '2025-12-13 08:00 AM',
              message: 'Work order accepted.',
              status: 'accepted'
            },
            {
              id: '2',
              timestamp: '2025-12-13 10:00 AM',
              message: 'Arrived on site. Beginning inspection.',
              status: 'in_progress'
            },
            {
              id: '3',
              timestamp: '2025-12-13 10:30 AM',
              message: 'Exterior inspection complete. Moving to interior.',
              status: 'in_progress'
            }
          ],
          photos: []
        }
      ];
        setWorkOrders(sampleOrders);
        localStorage.setItem('vendor-work-orders', JSON.stringify(sampleOrders));
      }
    }

    loadAssignedWorkOrders();
  }, []);

  // Save to localStorage whenever orders change
  const saveWorkOrders = (orders: WorkOrder[]) => {
    setWorkOrders(orders);
    localStorage.setItem('vendor-work-orders', JSON.stringify(orders));
  };

  // Filter work orders
  const filteredOrders = filter === 'all' 
    ? workOrders 
    : workOrders.filter(order => order.status === filter);

  // Accept work order
  const acceptOrder = (orderId: string) => {
    const updated = workOrders.map(order => {
      if (order.id === orderId) {
        const update: ProgressUpdate = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          message: 'Work order accepted. Will schedule service.',
          status: 'accepted'
        };
        return {
          ...order,
          status: 'accepted' as const,
          acceptedDate: new Date().toLocaleString(),
          progressUpdates: [...(order.progressUpdates || []), update]
        };
      }
      return order;
    });
    saveWorkOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId) || null);
    }
  };

  // Decline work order
  const declineOrder = (orderId: string) => {
    const updated = workOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'declined' as const };
      }
      return order;
    });
    saveWorkOrders(updated);
    setSelectedOrder(null);
  };

  // Start work
  const startWork = (orderId: string) => {
    const updated = workOrders.map(order => {
      if (order.id === orderId) {
        const update: ProgressUpdate = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          message: 'Arrived on site. Work has begun.',
          status: 'in_progress'
        };
        return {
          ...order,
          status: 'in_progress' as const,
          startedDate: new Date().toLocaleString(),
          progressUpdates: [...(order.progressUpdates || []), update]
        };
      }
      return order;
    });
    saveWorkOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId) || null);
    }
  };

  // Add progress update
  const addProgressUpdate = (orderId: string) => {
    if (!progressMessage.trim()) return;

    const updated = workOrders.map(order => {
      if (order.id === orderId) {
        const update: ProgressUpdate = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          message: progressMessage,
          status: order.status
        };
        return {
          ...order,
          progressUpdates: [...(order.progressUpdates || []), update]
        };
      }
      return order;
    });
    saveWorkOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId) || null);
    }
    setProgressMessage('');
    setShowProgressModal(false);
  };

  // Complete work order
  const completeOrder = (orderId: string) => {
    const updated = workOrders.map(order => {
      if (order.id === orderId) {
        const update: ProgressUpdate = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          message: 'Work completed successfully. Final photos uploaded.',
          status: 'completed'
        };
        return {
          ...order,
          status: 'completed' as const,
          completedDate: new Date().toLocaleString(),
          progressUpdates: [...(order.progressUpdates || []), update]
        };
      }
      return order;
    });
    saveWorkOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId) || null);
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            {selectedOrder ? (
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                href="/vendor/dashboard"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            <div>
              <h1 className="text-lg md:text-xl font-bold leading-tight">
                {selectedOrder ? selectedOrder.id : 'Work Orders'}
              </h1>
              <p className="text-blue-100 text-xs">
                {selectedOrder ? selectedOrder.client : 'Manage incoming jobs'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE: List view hidden when detail is shown */}
      <div className={`${selectedOrder ? 'hidden lg:block' : 'block'} pb-24 lg:pb-8`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border p-3 md:p-4 mb-4 md:mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {(['all', 'new', 'accepted', 'in_progress', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap ${
                    filter === status
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <span className="ml-1.5 text-xs opacity-75">
                    ({status === 'all' ? workOrders.length : workOrders.filter(o => o.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Work Orders List + Desktop Detail */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            {/* List */}
            <div className="space-y-3 md:space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No work orders in this category</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-sky-500 border-sky-300' : ''
                    }`}
                  >
                    <div className="p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-base font-bold text-slate-900">{order.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-700 font-medium text-sm truncate">{order.client}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
                            {order.priority.toUpperCase()}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 lg:hidden" />
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-start text-sm text-slate-600 gap-2">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                          <span className="truncate">{order.address}, {order.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 gap-2">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                          <span>Requested: {order.requestedDate}</span>
                        </div>
                        <div className="flex items-center text-sm font-semibold text-green-600 gap-2">
                          <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>${order.totalCost.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {order.services.map((service, idx) => (
                          <span key={idx} className="px-2 py-1 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Detail Panel */}
            <div className="hidden lg:block lg:sticky lg:top-4 h-fit">
              {selectedOrder ? (
                <DetailPanel
                  order={selectedOrder}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  onAccept={acceptOrder}
                  onDecline={declineOrder}
                  onStart={startWork}
                  onComplete={completeOrder}
                  onAddProgress={() => setShowProgressModal(true)}
                  onUploadPhoto={() => setShowPhotoModal(true)}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Select a Work Order</h3>
                  <p className="text-slate-600 text-sm">Choose a work order from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Detail view */}
      {selectedOrder && (
        <div className="lg:hidden pb-24">
          <div className="px-4 py-4">
            <DetailPanel
              order={selectedOrder}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              onAccept={acceptOrder}
              onDecline={declineOrder}
              onStart={startWork}
              onComplete={completeOrder}
              onAddProgress={() => setShowProgressModal(true)}
              onUploadPhoto={() => setShowPhotoModal(true)}
            />
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {showProgressModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add Progress Update</h3>
            <textarea
              value={progressMessage}
              onChange={(e) => setProgressMessage(e.target.value)}
              placeholder="Enter progress update for client..."
              className="w-full border border-slate-300 rounded-lg p-3 h-28 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-sm"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => addProgressUpdate(selectedOrder.id)}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg transition"
              >
                Send Update
              </button>
              <button
                onClick={() => { setShowProgressModal(false); setProgressMessage(''); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Upload Photos</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-1">Photo Upload</p>
              <p className="text-sm text-slate-500">Camera & GPS stamping coming soon</p>
            </div>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2">
        <Link href="/vendor/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/vendor/work-orders" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Client View</span>
        </Link>
        <Link href="/vendor/onboarding" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
