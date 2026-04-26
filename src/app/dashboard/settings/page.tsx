'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  FileText,
  Home,
  Lock,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [photoReports, setPhotoReports] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '');
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">Preserve</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-24 lg:pb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your account and preservation preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Account</h2>
              </div>
              <div className="space-y-4">
                <InfoRow label="Email" value={userEmail || 'Signed in user'} />
                <InfoRow label="Role" value="Owner account" />
                <InfoRow label="Workspace" value="Preserve dashboard" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
              </div>
              <div className="space-y-3">
                <ToggleRow label="Email work-order updates" checked={emailUpdates} onChange={setEmailUpdates} />
                <ToggleRow label="Send photo reports when inspections finish" checked={photoReports} onChange={setPhotoReports} />
                <ToggleRow label="Alert me for urgent property issues" checked={urgentAlerts} onChange={setUrgentAlerts} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Preservation Defaults</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoBox title="Default service priority" value="Normal" />
                <InfoBox title="Preferred report type" value="Photo documentation" />
                <InfoBox title="Cleaning scope" value="Interior and exterior" />
                <InfoBox title="Billing cadence" value="Monthly when recurring" />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <Lock className="w-6 h-6 text-slate-500 mb-3" />
              <h2 className="font-semibold text-slate-900 mb-2">Session</h2>
              <p className="text-sm text-slate-500 mb-4">Sign out of this browser when you are done managing properties.</p>
              <button
                onClick={handleLogout}
                className="w-full border border-red-200 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-50 transition text-sm font-semibold"
              >
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/dashboard/properties" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-medium">Properties</span>
        </Link>
        <Link href="/dashboard/work-orders/create" className="flex flex-col items-center gap-0.5">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg -mt-5">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-500 mt-0.5">New</span>
        </Link>
        <Link href="/dashboard/work-orders" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 transition">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 text-right break-all">{value}</span>
    </div>
  );
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}
