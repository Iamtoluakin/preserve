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
  Upload,
  Play,
  Pause,
  CheckCheck
} from 'lucide-react';

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

export default function VendorWorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'accepted' | 'in_progress' | 'completed'>('all');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Load work orders from localStorage
  useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/vendor/dashboard"
            className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Work Order Management</h1>
          <p className="text-slate-600">Manage incoming work orders and track job progress</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'new', 'accepted', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All Orders' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <span className="ml-2 text-sm">
                  ({status === 'all' ? workOrders.length : workOrders.filter(o => o.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Work Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No work orders in this category</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-sky-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-slate-800">{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{order.client}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
                      {order.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{order.address}</div>
                        <div>{order.city}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Requested: {order.requestedDate}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${order.totalCost.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.services.map((service, idx) => (
                      <span key={idx} className="px-3 py-1 bg-sky-50 text-sky-700 rounded-lg text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Work Order Details */}
          <div className="lg:sticky lg:top-4 h-fit">
            {selectedOrder ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedOrder.id}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getPriorityColor(selectedOrder.priority)}`}>
                    {selectedOrder.priority.toUpperCase()}
                  </span>
                </div>

                {/* Property Info */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-slate-800 mb-3">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-600">Client:</span> <span className="font-medium">{selectedOrder.client}</span></div>
                    <div><span className="text-slate-600">Property ID:</span> <span className="font-medium">{selectedOrder.property}</span></div>
                    <div><span className="text-slate-600">Address:</span> <span className="font-medium">{selectedOrder.address}, {selectedOrder.city}</span></div>
                    <div><span className="text-slate-600">Requested Date:</span> <span className="font-medium">{selectedOrder.requestedDate}</span></div>
                    <div><span className="text-slate-600">Total Cost:</span> <span className="font-medium text-green-600">${selectedOrder.totalCost.toFixed(2)}</span></div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-slate-800 mb-3">Services Requested</h3>
                  <div className="space-y-2">
                    {selectedOrder.services.map((service, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-slate-800 mb-3">Notes</h3>
                    <p className="text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Progress Updates */}
                {selectedOrder.progressUpdates && selectedOrder.progressUpdates.length > 0 && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-slate-800 mb-3">Progress Updates</h3>
                    <div className="space-y-3">
                      {selectedOrder.progressUpdates.map((update) => (
                        <div key={update.id} className="flex gap-3">
                          <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-800">{update.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{update.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {selectedOrder.status === 'new' && (
                    <>
                      <button
                        onClick={() => acceptOrder(selectedOrder.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Accept Work Order
                      </button>
                      <button
                        onClick={() => declineOrder(selectedOrder.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Decline Work Order
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'accepted' && (
                    <button
                      onClick={() => startWork(selectedOrder.id)}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Work
                    </button>
                  )}

                  {selectedOrder.status === 'in_progress' && (
                    <>
                      <button
                        onClick={() => setShowProgressModal(true)}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Add Progress Update
                      </button>
                      <button
                        onClick={() => setShowPhotoModal(true)}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Upload Photos
                      </button>
                      <button
                        onClick={() => completeOrder(selectedOrder.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <CheckCheck className="w-5 h-5 mr-2" />
                        Mark as Complete
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-800 font-semibold">Work Order Completed</p>
                      <p className="text-sm text-green-600 mt-1">Completed on {selectedOrder.completedDate}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Select a Work Order</h3>
                <p className="text-slate-600">Choose a work order from the list to view details and take action</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Update Modal */}
      {showProgressModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Add Progress Update</h3>
            <textarea
              value={progressMessage}
              onChange={(e) => setProgressMessage(e.target.value)}
              placeholder="Enter progress update for client..."
              className="w-full border border-slate-300 rounded-lg p-3 h-32 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => addProgressUpdate(selectedOrder.id)}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Send Update
              </button>
              <button
                onClick={() => {
                  setShowProgressModal(false);
                  setProgressMessage('');
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Upload Photos</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Photo upload feature</p>
              <p className="text-sm text-slate-500">Will integrate with camera/file upload and GPS stamping</p>
            </div>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="w-full mt-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
