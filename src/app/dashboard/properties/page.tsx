'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  MapPin, 
  Calendar, 
  Building2,
  Search,
  Filter,
  Eye,
  FileText
} from 'lucide-react';

// Sample property data - in production, this would come from your database
const defaultProperties = [
  {
    id: '1',
    address: '1234 Main Street',
    city: 'Durham',
    county: 'Durham County',
    state: 'NC',
    zip: '27701',
    propertyType: 'Single Family Home',
    acquisitionDate: '2025-12-01',
    status: 'Active',
    bankReference: 'REF-2025-001234',
    workOrders: 2
  },
  {
    id: '2',
    address: '5678 Oak Avenue',
    city: 'Raleigh',
    county: 'Wake County',
    state: 'NC',
    zip: '27601',
    propertyType: 'Condo/Townhouse',
    acquisitionDate: '2025-11-28',
    status: 'Active',
    bankReference: 'REF-2025-001235',
    workOrders: 1
  },
  {
    id: '3',
    address: '9012 Pine Road',
    city: 'Charlotte',
    county: 'Mecklenburg County',
    state: 'NC',
    zip: '28201',
    propertyType: 'Single Family Home',
    acquisitionDate: '2025-11-20',
    status: 'Active',
    bankReference: 'REF-2025-001236',
    workOrders: 3
  }
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState(defaultProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load properties from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('preserve_properties');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with default properties (in case storage is empty)
        if (parsed.length > 0) {
          setProperties(parsed);
        }
      } catch (e) {
        console.error('Error loading properties:', e);
      }
    }
  }, []);

  // Filter properties based on search and filter
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.bankReference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || property.propertyType === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
            <Link 
              href="/dashboard/properties/add"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Property
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Properties</h1>
              <p className="text-slate-600">Manage and track all your foreclosed and REO properties</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by address, city, or reference number..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="all">All Property Types</option>
                <option value="Single Family Home">Single Family Homes</option>
                <option value="Condo/Townhouse">Condos/Townhouses</option>
                <option value="Multi-Family">Multi-Family</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Total Properties</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{properties.length}</div>
            <div className="text-sm text-slate-500 mt-1">Active listings</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Active Work Orders</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {properties.reduce((sum, prop) => sum + prop.workOrders, 0)}
            </div>
            <div className="text-sm text-slate-500 mt-1">In progress</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">This Month</span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {properties.filter(p => {
                const date = new Date(p.acquisitionDate);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <div className="text-sm text-slate-500 mt-1">New properties added</div>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first property'
                }
              </p>
              {!searchQuery && filterType === 'all' && (
                <Link
                  href="/dashboard/properties/add"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Property
                </Link>
              )}
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div 
                key={property.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Home className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">
                          {property.address}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{property.city}, {property.state} {property.zip}</span>
                          <span className="text-slate-400">•</span>
                          <span>{property.county}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{property.propertyType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Added {new Date(property.acquisitionDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              Ref: {property.bankReference}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold text-slate-900">{property.workOrders}</div>
                        <div className="text-xs text-slate-500">Work Orders</div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {property.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Link
                      href={`/dashboard/properties/${property.id}`}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/work-orders/create?propertyId=${property.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Create Work Order
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
