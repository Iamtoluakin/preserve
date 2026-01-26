'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle } from 'lucide-react';

interface WorkOrder {
  id: string;
  propertyAddress: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  priority: string;
}

interface WorkOrderCalendarProps {
  workOrders: WorkOrder[];
}

export default function WorkOrderCalendar({ workOrders }: WorkOrderCalendarProps) {
  const [date, setDate] = useState(new Date());
  const [selectedDateOrders, setSelectedDateOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    // Filter work orders for the selected date
    const ordersForDate = workOrders.filter(order => {
      if (order.scheduledDate) {
        try {
          const orderDate = new Date(order.scheduledDate);
          return isSameDay(orderDate, date);
        } catch (e) {
          return false;
        }
      }
      return false;
    });
    setSelectedDateOrders(ordersForDate);
  }, [date, workOrders]);

  // Get dates that have work orders
  const getDatesWithOrders = () => {
    const dates = new Set<string>();
    workOrders.forEach(order => {
      if (order.scheduledDate) {
        try {
          const orderDate = new Date(order.scheduledDate);
          dates.add(format(orderDate, 'yyyy-MM-dd'));
        } catch (e) {
          // Invalid date
        }
      }
    });
    return dates;
  };

  const datesWithOrders = getDatesWithOrders();

  // Add custom class to dates with work orders
  const tileClassName = ({ date, view }: any) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (datesWithOrders.has(dateStr)) {
        return 'has-work-orders';
      }
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">Work Order Calendar</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        {/* Calendar */}
        <div>
          <style jsx global>{`
            .react-calendar {
              width: 100%;
              border: none;
              font-family: inherit;
              background: transparent;
            }
            .react-calendar__navigation button {
              color: rgb(30, 41, 59);
              font-size: 1rem;
              font-weight: 600;
            }
            .react-calendar__tile {
              color: rgb(30, 41, 59);
              padding: 0.75rem 0.5rem;
            }
            .react-calendar__tile--active {
              background: #0ea5e9 !important;
              color: white !important;
            }
            .react-calendar__tile--now {
              background: #e0f2fe;
            }
            .react-calendar__tile:enabled:hover {
              background-color: #f0f9ff;
            }
            .react-calendar__month-view__days__day--weekend {
              color: #ef4444;
            }
            .has-work-orders {
              position: relative;
            }
            .has-work-orders::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #0ea5e9;
            }
            .react-calendar__tile--active.has-work-orders::after {
              background: white;
            }
          `}</style>
          <Calendar
            onChange={(value) => setDate(value as Date)}
            value={date}
            tileClassName={tileClassName}
            className="rounded-lg border shadow-sm"
          />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs md:text-sm text-blue-900">
              <strong>Tip:</strong> Dates with blue dots have scheduled work orders. Click a date to view details.
            </p>
          </div>
        </div>

        {/* Selected Date Details */}
        <div>
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-slate-900 mb-1 text-sm md:text-base">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </h3>
            <p className="text-xs md:text-sm text-slate-600">
              {selectedDateOrders.length} work order{selectedDateOrders.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>

          <div className="space-y-3 max-h-80 md:max-h-96 overflow-y-auto">
            {selectedDateOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CalendarIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-xs md:text-sm">No work orders scheduled for this date</p>
              </div>
            ) : (
              selectedDateOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-slate-200 rounded-lg p-3 md:p-4 hover:border-blue-300 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 mb-1 text-sm md:text-base truncate">
                        {order.serviceType}
                      </h4>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 mb-2">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">{order.propertyAddress}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs md:text-sm flex-wrap">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{order.scheduledDate ? format(new Date(order.scheduledDate), 'h:mm a') : 'TBD'}</span>
                    </div>
                    {order.priority && (
                      <div className={`flex items-center gap-1 ${getPriorityColor(order.priority)}`}>
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">{order.priority} priority</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
