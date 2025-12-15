'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  Camera, 
  Settings,
  Search,
  Bell,
  User,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  pendingWorkOrders: number;
  completedWorkOrders: number;
  inProgressWorkOrders: number;
}

export default function DashboardPageDynamic() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    pendingWorkOrders: 0,
    completedWorkOrders: 0,
    inProgressWorkOrders: 0,
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);

      // Fetch properties stats
      const { data: allProperties } = await supabase
        .from('properties')
        .select('*');

      const activeProps = allProperties?.filter(p => p.status === 'active') || [];

      // Fetch work orders stats
      const { data: allWorkOrders } = await supabase
        .from('work_orders')
        .select('*');

      const pendingWO = allWorkOrders?.filter(w => w.status === 'pending') || [];
      const inProgressWO = allWorkOrders?.filter(w => w.status === 'in_progress') || [];
      const completedWO = allWorkOrders?.filter(w => w.status === 'completed') || [];

      setStats({
        totalProperties: allProperties?.length || 0,
        activeProperties: activeProps.length,
        pendingWorkOrders: pendingWO.length,
        completedWorkOrders: completedWO.length,
        inProgressWorkOrders: inProgressWO.length,
      });

      // Fetch recent properties (last 5)
      const { data: recentProps } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentProperties(recentProps || []);

      // Fetch recent work orders (last 5)
      const { data: recentWO } = await supabase
        .from('work_orders')
        .select('*, property:properties(*)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentWorkOrders(recentWO || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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
              <button className="flex items-center space-x-2 p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <User className="w-6 h-6" />
                <span className="hidden md:block">{user.firstName} {user.lastName}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen hidden lg:block">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/test-data" className="flex items-center space-x-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              <FileText className="w-5 h-5" />
              <span>Test Data</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.firstName}!</h2>
            <p className="text-slate-600">Here's what's happening with your properties</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Properties"
              value={stats.totalProperties}
              subtitle={`${stats.activeProperties} active`}
              icon={<Home className="w-6 h-6" />}
              color="blue"
            />
            <StatCard
              title="Pending Work Orders"
              value={stats.pendingWorkOrders}
              subtitle="Need attention"
              icon={<AlertCircle className="w-6 h-6" />}
              color="yellow"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressWorkOrders}
              subtitle="Being worked on"
              icon={<Clock className="w-6 h-6" />}
              color="purple"
            />
            <StatCard
              title="Completed"
              value={stats.completedWorkOrders}
              subtitle="This period"
              icon={<CheckCircle2 className="w-6 h-6" />}
              color="green"
            />
          </div>

          {/* Recent Properties & Work Orders */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Properties */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-slate-900">Recent Properties</h3>
              </div>
              <div className="p-6">
                {recentProperties.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No properties yet. Add some sample data!</p>
                ) : (
                  <div className="space-y-4">
                    {recentProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{property.address}</p>
                          <p className="text-sm text-slate-600">{property.city}, {property.state} {property.zip}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.status === 'active' ? 'bg-green-100 text-green-800' :
                          property.status === 'under_contract' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Work Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-slate-900">Recent Work Orders</h3>
              </div>
              <div className="p-6">
                {recentWorkOrders.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No work orders yet. Add some sample data!</p>
                ) : (
                  <div className="space-y-4">
                    {recentWorkOrders.map((wo) => (
                      <div key={wo.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{wo.title}</p>
                          <p className="text-sm text-slate-600">
                            {wo.property?.address || 'Unknown property'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          wo.status === 'completed' ? 'bg-green-100 text-green-800' :
                          wo.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {wo.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action */}
          {stats.totalProperties === 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Get Started</h3>
              <p className="text-blue-700 mb-4">
                Your database is empty. Run the sample data script in Supabase to see this dashboard in action!
              </p>
              <Link
                href="/test-data"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Test Data Page
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm text-slate-600 mt-1">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}
