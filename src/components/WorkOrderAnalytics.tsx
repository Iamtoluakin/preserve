'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { formatWorkOrderStatus, type PreserveWorkOrder } from '@/lib/localData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface WorkOrderAnalyticsProps {
  workOrders: PreserveWorkOrder[];
}

export default function WorkOrderAnalytics({ workOrders }: WorkOrderAnalyticsProps) {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);

  useEffect(() => {
    if (workOrders && workOrders.length > 0) {
      // Calculate monthly trends (last 6 months)
      const monthlyTrends = calculateMonthlyTrends(workOrders);
      setMonthlyData(monthlyTrends);

      // Calculate status distribution
      const statusDist = calculateStatusDistribution(workOrders);
      setStatusData(statusDist);

      // Calculate top services
      const topServices = calculateTopServices(workOrders);
      setServiceData(topServices);
    }
  }, [workOrders]);

  const getStatus = (status: string) => status.toLowerCase().replace('_', '-');

  const calculateMonthlyTrends = (orders: PreserveWorkOrder[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt || order.scheduledDate || new Date());
        return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year;
      });

      const completed = monthOrders.filter(o => getStatus(o.status) === 'completed').length;
      const pending = monthOrders.filter(o => ['submitted', 'under-review', 'awaiting-assignment'].includes(getStatus(o.status))).length;
      const inProgress = monthOrders.filter(o => getStatus(o.status) === 'in-progress').length;

      last6Months.push({
        month: months[monthIndex],
        completed,
        pending,
        inProgress,
        total: monthOrders.length
      });
    }
    
    return last6Months;
  };

  const calculateStatusDistribution = (orders: PreserveWorkOrder[]) => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      const status = formatWorkOrderStatus(order.status || 'pending');
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.keys(statusCounts).map(status => ({
      name: status.replace(/\b\w/g, l => l.toUpperCase()),
      value: statusCounts[status]
    }));
  };

  const calculateTopServices = (orders: any[]) => {
    const serviceCounts: any = {};
    orders.forEach(order => {
      if (order.services && Array.isArray(order.services)) {
        order.services.forEach((service: any) => {
          const name = service.name || service.type || 'Unknown';
          serviceCounts[name] = (serviceCounts[name] || 0) + 1;
        });
      }
    });

    return Object.keys(serviceCounts)
      .map(service => ({
        service,
        count: serviceCounts[service]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateTotalServiceSpend = () => {
    return workOrders.reduce((sum, order) => {
      return sum + (order.totalCost || 0);
    }, 0);
  };

  const calculateAvgCompletionTime = () => {
    const completedOrders = workOrders.filter(o => getStatus(o.status) === 'completed' && o.completedDate && o.createdAt);
    if (completedOrders.length === 0) return 0;

    const totalDays = completedOrders.reduce((sum, order) => {
      if (!order.completedDate) return sum;
      const start = new Date(order.createdAt);
      const end = new Date(order.completedDate);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / completedOrders.length);
  };

  if (!workOrders || workOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-slate-600">Create some work orders to see trends and analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          title="Total Work Orders"
          value={workOrders.length}
          icon={<FileText className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Service Spend"
          value={`$${calculateTotalServiceSpend().toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Avg. Completion"
          value={`${calculateAvgCompletionTime()} days`}
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="This Month"
          value={monthlyData[monthlyData.length - 1]?.total || 0}
          icon={<Calendar className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Monthly Work Order Trends
        </h3>
        <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(30, 41, 59)', 
                border: '1px solid rgb(51, 65, 85)',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="Completed" />
            <Bar dataKey="inProgress" fill="#f59e0b" name="In Progress" />
            <Bar dataKey="pending" fill="#3b82f6" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Work Order Status</h3>
          <ResponsiveContainer width="100%" height={220} className="md:h-[250px]">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(30, 41, 59)', 
                  border: '1px solid rgb(51, 65, 85)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Most Requested Services</h3>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220} className="md:h-[250px]">
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="service" type="category" width={100} stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(30, 41, 59)', 
                    border: '1px solid rgb(51, 65, 85)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-center py-8">No service data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs md:text-sm font-medium text-slate-600">{title}</span>
        <div className={`p-1.5 md:p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <p className="text-xl md:text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
