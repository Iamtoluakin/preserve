import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  User
} from 'lucide-react';

export default function WorkOrdersPage() {
  const workOrders = [
    {
      id: 'WO-2025-0234',
      property: '1234 Main Street, Durham, NC',
      service: 'Lawn & Grounds Maintenance',
      status: 'in_progress',
      priority: 'normal',
      scheduled: 'Dec 17, 2025',
      assignedTo: 'Field Team A',
      created: '2 days ago'
    },
    {
      id: 'WO-2025-0233',
      property: '5678 Oak Avenue, Raleigh, NC',
      service: 'Property Securing',
      status: 'pending',
      priority: 'high',
      scheduled: 'Dec 15, 2025',
      assignedTo: 'Pending Assignment',
      created: '1 day ago'
    },
    {
      id: 'WO-2025-0232',
      property: '9012 Pine Road, Charlotte, NC',
      service: 'Property Inspection',
      status: 'completed',
      priority: 'normal',
      scheduled: 'Dec 12, 2025',
      assignedTo: 'Field Team B',
      created: '5 days ago'
    },
    {
      id: 'WO-2025-0231',
      property: '3456 Elm Court, Durham, NC',
      service: 'Winterization',
      status: 'in_progress',
      priority: 'high',
      scheduled: 'Dec 16, 2025',
      assignedTo: 'Field Team A',
      created: '3 days ago'
    },
    {
      id: 'WO-2025-0230',
      property: '7890 Maple Drive, Greensboro, NC',
      service: 'Debris Removal',
      status: 'pending',
      priority: 'emergency',
      scheduled: 'Dec 14, 2025',
      assignedTo: 'Pending Assignment',
      created: '6 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Work Orders</h1>
            <p className="text-slate-600">Manage and track all service requests</p>
          </div>
          <Link
            href="/dashboard/work-orders/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Work Order
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-600 text-sm font-medium">Total Orders</div>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{workOrders.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-600 text-sm font-medium">Pending</div>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {workOrders.filter(wo => wo.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-600 text-sm font-medium">In Progress</div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {workOrders.filter(wo => wo.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-600 text-sm font-medium">Completed</div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {workOrders.filter(wo => wo.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-slate-900">All Work Orders</h2>
          </div>

          <div className="divide-y divide-slate-200">
            {workOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 text-lg">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{order.property}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Scheduled: {order.scheduled}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Assigned to: {order.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-slate-900 mb-2">{order.service}</div>
                    <div className="text-sm text-slate-500">Created {order.created}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium">
                    Update Status
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium">
                    Contact Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
