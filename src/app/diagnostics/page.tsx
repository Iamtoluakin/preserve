'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>({
    envVars: {},
    supabaseConnection: null,
    tablesExist: {},
    authStatus: null,
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const diagnostics: any = {
      envVars: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      },
      supabaseConnection: null,
      tablesExist: {},
      authStatus: null,
    };

    // Test Supabase connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        diagnostics.supabaseConnection = {
          status: 'error',
          message: error.message,
          code: error.code,
          details: error.details,
        };
      } else {
        diagnostics.supabaseConnection = {
          status: 'success',
          message: 'Connected to Supabase',
        };
      }
    } catch (err: any) {
      diagnostics.supabaseConnection = {
        status: 'error',
        message: err.message,
      };
    }

    // Check if tables exist
    const tables = ['users', 'organizations', 'properties', 'work_orders'];
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          diagnostics.tablesExist[table] = {
            exists: false,
            error: error.message,
            code: error.code,
          };
        } else {
          diagnostics.tablesExist[table] = {
            exists: true,
          };
        }
      } catch (err: any) {
        diagnostics.tablesExist[table] = {
          exists: false,
          error: err.message,
        };
      }
    }

    // Check auth status
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        diagnostics.authStatus = {
          authenticated: false,
          error: error.message,
        };
      } else if (session) {
        diagnostics.authStatus = {
          authenticated: true,
          user: session.user.email,
          userId: session.user.id,
        };
      } else {
        diagnostics.authStatus = {
          authenticated: false,
          message: 'No active session',
        };
      }
    } catch (err: any) {
      diagnostics.authStatus = {
        authenticated: false,
        error: err.message,
      };
    }

    setResults(diagnostics);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">🔍 System Diagnostics</h1>
          <p className="text-slate-600 mb-4">
            This page helps diagnose issues with your Supabase connection and database setup.
          </p>
          <button
            onClick={runDiagnostics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Run Diagnostics Again
          </button>
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${results.envVars.hasUrl ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL: {results.envVars.hasUrl ? '✅ Set' : '❌ Missing'}</span>
            </div>
            {results.envVars.url && results.envVars.url !== 'NOT SET' && (
              <div className="ml-6 text-sm text-slate-600">
                <code className="bg-slate-100 px-2 py-1 rounded">{results.envVars.url}</code>
              </div>
            )}
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${results.envVars.hasAnonKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY: {results.envVars.hasAnonKey ? '✅ Set' : '❌ Missing'}</span>
            </div>
          </div>
        </div>

        {/* Supabase Connection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Supabase Connection</h2>
          {results.supabaseConnection ? (
            <div>
              <div className="flex items-center mb-2">
                <span className={`w-3 h-3 rounded-full mr-3 ${results.supabaseConnection.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="font-semibold">
                  {results.supabaseConnection.status === 'success' ? '✅ Connected' : '❌ Connection Error'}
                </span>
              </div>
              <p className="text-sm text-slate-600 ml-6">{results.supabaseConnection.message}</p>
              {results.supabaseConnection.code && (
                <p className="text-sm text-red-600 ml-6 mt-1">Error Code: {results.supabaseConnection.code}</p>
              )}
              {results.supabaseConnection.details && (
                <pre className="text-xs text-slate-600 ml-6 mt-2 bg-slate-100 p-2 rounded overflow-x-auto">
                  {results.supabaseConnection.details}
                </pre>
              )}
            </div>
          ) : (
            <p className="text-slate-500">Running diagnostics...</p>
          )}
        </div>

        {/* Tables Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Database Tables</h2>
          <div className="space-y-3">
            {Object.entries(results.tablesExist).map(([table, info]: [string, any]) => (
              <div key={table}>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${info.exists ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-mono text-sm">{table}: {info.exists ? '✅ Exists' : '❌ Not Found'}</span>
                </div>
                {info.error && (
                  <p className="text-sm text-red-600 ml-6 mt-1">{info.error}</p>
                )}
              </div>
            ))}
          </div>
          {Object.values(results.tablesExist).some((t: any) => !t.exists) && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ Missing Tables Detected</p>
              <p className="text-yellow-700 text-sm mb-3">
                You need to run the database migration script to create the required tables.
              </p>
              <ol className="list-decimal list-inside text-yellow-700 text-sm space-y-1 ml-2">
                <li>Go to Supabase Dashboard → SQL Editor</li>
                <li>Open <code className="bg-yellow-100 px-1 py-0.5 rounded">database/migration-to-uuid.sql</code></li>
                <li>Copy the contents and run in SQL Editor</li>
              </ol>
            </div>
          )}
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Authentication Status</h2>
          {results.authStatus ? (
            <div>
              <div className="flex items-center mb-2">
                <span className={`w-3 h-3 rounded-full mr-3 ${results.authStatus.authenticated ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span className="font-semibold">
                  {results.authStatus.authenticated ? '✅ Logged In' : '⚠️ Not Logged In'}
                </span>
              </div>
              {results.authStatus.authenticated ? (
                <div className="ml-6 text-sm text-slate-600">
                  <p>User: <code className="bg-slate-100 px-2 py-1 rounded">{results.authStatus.user}</code></p>
                  <p className="mt-1">User ID: <code className="bg-slate-100 px-2 py-1 rounded text-xs">{results.authStatus.userId}</code></p>
                </div>
              ) : (
                <p className="text-sm text-slate-600 ml-6">{results.authStatus.message || results.authStatus.error}</p>
              )}
            </div>
          ) : (
            <p className="text-slate-500">Running diagnostics...</p>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">📋 Next Steps</h2>
          <div className="space-y-3 text-blue-800">
            {!results.envVars.hasUrl || !results.envVars.hasAnonKey ? (
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="font-semibold mb-2">1. Set up environment variables</p>
                <p className="text-sm">Make sure <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code> has your Supabase credentials.</p>
              </div>
            ) : null}
            {Object.values(results.tablesExist).some((t: any) => !t.exists) ? (
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="font-semibold mb-2">2. Run database migration</p>
                <p className="text-sm">Execute <code className="bg-blue-100 px-1 py-0.5 rounded">database/migration-to-uuid.sql</code> in Supabase SQL Editor.</p>
              </div>
            ) : null}
            {!results.authStatus?.authenticated ? (
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="font-semibold mb-2">3. Sign up or log in</p>
                <p className="text-sm">
                  <Link href="/login" className="text-blue-600 hover:underline">Go to login page</Link>
                </p>
              </div>
            ) : null}
            {results.authStatus?.authenticated && Object.values(results.tablesExist).every((t: any) => t.exists) ? (
              <div className="bg-white p-3 rounded border border-green-300">
                <p className="font-semibold mb-2 text-green-800">✅ Everything looks good!</p>
                <p className="text-sm text-green-700">
                  <Link href="/dashboard" className="text-green-600 hover:underline font-semibold">Go to Dashboard →</Link>
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
