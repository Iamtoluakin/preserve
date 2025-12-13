import Link from 'next/link';
import { 
  Home, 
  FileText, 
  Camera, 
  Settings,
  Plus,
  Search,
  Bell,
  User,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">Preserve</span>
              </Link>
              <div className="hidden md:block border-l pl-4 ml-4">
                <h1 className="text-lg font-semibold text-slate-900">Property Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2 p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <User className="w-6 h-6" />
                <span className="hidden md:block">Bank Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen hidden lg:block">
          <nav className="p-4 space-y-2">
            <NavItem icon={<Home />} label="Properties" active />
            <NavItem icon={<FileText />} label="Work Orders" />
            <NavItem icon={<Camera />} label="Inspections" />
            <NavItem icon={<Settings />} label="Settings" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Active Properties"
              value="48"
              change="+12%"
              trend="up"
              icon={<Home className="w-6 h-6" />}
            />
            <StatCard
              title="Pending Work Orders"
              value="23"
              change="-5%"
              trend="down"
              icon={<FileText className="w-6 h-6" />}
            />
            <StatCard
              title="This Month Inspections"
              value="156"
              change="+8%"
              trend="up"
              icon={<Camera className="w-6 h-6" />}
            />
            <StatCard
              title="Code Compliance"
              value="100%"
              change="0%"
              trend="neutral"
              icon={<CheckCircle2 className="w-6 h-6" />}
            />
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Property
              </button>
              <button className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
                Create Work Order
              </button>
            </div>
            <div className="flex items-center gap-2">
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option>All Properties</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option>All Counties</option>
                <option>Durham</option>
                <option>Wake</option>
                <option>Mecklenburg</option>
              </select>
            </div>
          </div>

          {/* Properties Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-slate-900">Your Properties</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Property Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      County
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Last Inspection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Next Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <PropertyRow
                    address="1234 Main Street, Durham"
                    county="Durham"
                    status="active"
                    lastInspection="Dec 10, 2025"
                    nextService="Dec 17, 2025"
                  />
                  <PropertyRow
                    address="5678 Oak Avenue, Raleigh"
                    county="Wake"
                    status="active"
                    lastInspection="Dec 11, 2025"
                    nextService="Dec 18, 2025"
                  />
                  <PropertyRow
                    address="9012 Pine Road, Charlotte"
                    county="Mecklenburg"
                    status="pending"
                    lastInspection="Dec 9, 2025"
                    nextService="Dec 16, 2025"
                  />
                  <PropertyRow
                    address="3456 Elm Court, Durham"
                    county="Durham"
                    status="active"
                    lastInspection="Dec 12, 2025"
                    nextService="Dec 19, 2025"
                  />
                  <PropertyRow
                    address="7890 Maple Drive, Greensboro"
                    county="Guilford"
                    status="attention"
                    lastInspection="Dec 8, 2025"
                    nextService="Dec 15, 2025"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                icon={<Camera className="w-5 h-5 text-blue-600" />}
                title="Inspection completed"
                description="1234 Main Street, Durham - All clear"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<FileText className="w-5 h-5 text-green-600" />}
                title="Work order completed"
                description="Lawn maintenance at 5678 Oak Avenue"
                time="5 hours ago"
              />
              <ActivityItem
                icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
                title="Attention required"
                description="7890 Maple Drive - Minor repair needed"
                time="1 day ago"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon 
}: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-600">{title}</div>
        <div className="text-slate-400">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
      <div className={`text-sm font-medium ${
        trend === 'up' ? 'text-green-600' :
        trend === 'down' ? 'text-red-600' :
        'text-slate-600'
      }`}>
        {change} from last month
      </div>
    </div>
  );
}

function PropertyRow({
  address,
  county,
  status,
  lastInspection,
  nextService,
}: {
  address: string;
  county: string;
  status: 'active' | 'pending' | 'attention';
  lastInspection: string;
  nextService: string;
}) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    attention: 'bg-red-100 text-red-800',
  };

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-900">{address}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{county}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          {lastInspection}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{nextService}</td>
      <td className="px-6 py-4">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          View Details
        </button>
      </td>
    </tr>
  );
}

function ActivityItem({ 
  icon, 
  title, 
  description, 
  time 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  time: string;
}) {
  return (
    <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
