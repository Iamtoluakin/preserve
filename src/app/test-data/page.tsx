'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function TestDataPage() {
  const { user, session, loading } = useAuth();
  const [dbData, setDbData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Test fetching properties
        const { data: properties, error: propError } = await supabase
          .from('properties')
          .select('*')
          .limit(10);

        // Test fetching work orders
        const { data: workOrders, error: woError } = await supabase
          .from('work_orders')
          .select('*')
          .limit(10);

        // Test fetching organizations
        const { data: organizations, error: orgError } = await supabase
          .from('organizations')
          .select('*');

        // Test fetching users
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*');

        setDbData({
          properties: properties || [],
          workOrders: workOrders || [],
          organizations: organizations || [],
          users: users || [],
          errors: {
            propError,
            woError,
            orgError,
            usersError,
          },
        });
      } catch (err) {
        setError(String(err));
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Not logged in</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Database Test Page</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Current User</h2>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm text-slate-900">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Session</h2>
          <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm text-slate-900">
            {session ? 'Logged in ✅' : 'No session ❌'}
          </pre>
        </div>

        {/* Database Data */}
        {dbData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">Database Data</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Users ({dbData.users.length})</h3>
                <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm text-slate-900">
                  {JSON.stringify(dbData.users, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-slate-900">Organizations ({dbData.organizations.length})</h3>
                <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm text-slate-900">
                  {JSON.stringify(dbData.organizations, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-slate-900">Properties ({dbData.properties.length})</h3>
                <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm text-slate-900">
                  {JSON.stringify(dbData.properties, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-slate-900">Work Orders ({dbData.workOrders.length})</h3>
                <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm text-slate-900">
                  {JSON.stringify(dbData.workOrders, null, 2)}
                </pre>
              </div>

              {Object.values(dbData.errors).some((e: any) => e) && (
                <div>
                  <h3 className="font-semibold text-lg text-red-600">Errors</h3>
                  <pre className="bg-red-50 p-4 rounded overflow-auto text-sm text-red-900">
                    {JSON.stringify(dbData.errors, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-900">Error</h2>
            <pre className="text-sm text-red-900">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
