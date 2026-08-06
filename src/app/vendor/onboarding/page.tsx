'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home,
  Loader2,
  MapPin,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  ContractorProfile,
  saveContractorProfile,
  serviceCategoryOptions,
} from '@/lib/vendorData';

const emptyProfile: ContractorProfile = {
  id: 'current-contractor',
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  approvalStatus: 'submitted',
  serviceCategories: ['inspection'],
  coverageZipCodes: [],
  coverageRadiusMiles: 25,
  insuranceStatus: 'submitted',
  licenses: ['general-liability'],
  available: true,
  qualityScore: 0,
  onTimeRate: 0,
  completionRate: 0,
  openJobCount: 0,
  complaintCount: 0,
  notes: '',
};

export default function VendorOnboardingPage() {
  const [profile, setProfile] = useState<ContractorProfile>(emptyProfile);
  const [zipInput, setZipInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isApproved = profile.approvalStatus === 'approved';
  const canSubmit = profile.companyName.trim() && profile.contactName.trim() && profile.phone.trim() && profile.serviceCategories.length > 0;

  const statusCopy = useMemo(() => {
    if (profile.approvalStatus === 'approved') return 'Approved contractors can receive assigned PreserveHQ work orders.';
    if (profile.approvalStatus === 'under-review') return 'Your application is under review. PreserveHQ will verify coverage, insurance, and service fit.';
    if (profile.approvalStatus === 'rejected') return 'This contractor profile was not approved. Contact PreserveHQ for next steps.';
    if (profile.approvalStatus === 'suspended') return 'This contractor profile is suspended and cannot receive new assignments.';
    return 'Submit your profile so PreserveHQ can review and approve your field account.';
  }, [profile.approvalStatus]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const nextProfile = {
        ...emptyProfile,
        id: user?.id || emptyProfile.id,
        userId: user?.id,
        email: user?.email || '',
        contactName: user?.user_metadata?.full_name || '',
      };

      try {
        const response = await fetch('/api/contractor-profile', { cache: 'no-store' });
        if (response.ok) {
          const result = await response.json();
          if (result.contractorProfile && active) {
            setProfile({ ...nextProfile, ...result.contractorProfile });
            setZipInput((result.contractorProfile.coverageZipCodes || []).join(', '));
            setLoading(false);
            return;
          }
        }
      } catch {
        // The local fallback keeps contractor onboarding usable before backend tables exist.
      }

      if (active) {
        setProfile(nextProfile);
        setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const toggleCategory = (categoryId: string) => {
    setProfile(current => {
      const hasCategory = current.serviceCategories.includes(categoryId);
      const serviceCategories = hasCategory
        ? current.serviceCategories.filter(id => id !== categoryId)
        : [...current.serviceCategories, categoryId];

      return { ...current, serviceCategories };
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Company, contact, phone, and at least one service category are required.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const nextProfile: ContractorProfile = {
      ...profile,
      approvalStatus: profile.approvalStatus === 'approved' ? 'approved' : 'submitted',
      coverageZipCodes: zipInput
        .split(',')
        .map(zip => zip.trim())
        .filter(Boolean),
    };

    saveContractorProfile(nextProfile);
    setProfile(nextProfile);

    try {
      const response = await fetch('/api/contractor-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextProfile),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Saved locally. Backend contractor profile table is not ready yet.');
      }

      const result = await response.json();
      setProfile({ ...nextProfile, ...result.contractorProfile });
      setMessage('Contractor profile submitted for PreserveHQ review.');
    } catch (err: any) {
      setMessage(err.message || 'Saved locally. Backend contractor profile table is not ready yet.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white">P</div>
            <div>
              <p className="text-lg font-black text-slate-950">PreserveHQ</p>
              <p className="text-xs font-semibold text-slate-500">Contractor onboarding</p>
            </div>
          </Link>
          <Link href="/vendor/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Portal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 md:py-8">
        <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Field pro account</p>
              <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Get approved to receive PreserveHQ jobs.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{statusCopy}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-1 text-xl font-black capitalize text-slate-950">{profile.approvalStatus.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-950">Company Details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Company name" value={profile.companyName} onChange={value => setProfile({ ...profile, companyName: value })} />
                <Field label="Contact name" value={profile.contactName} onChange={value => setProfile({ ...profile, contactName: value })} />
                <Field label="Email" value={profile.email || ''} onChange={value => setProfile({ ...profile, email: value })} />
                <Field label="Phone" value={profile.phone} onChange={value => setProfile({ ...profile, phone: value })} />
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-950">Service Categories</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceCategoryOptions.map(option => (
                  <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={profile.serviceCategories.includes(option.id)}
                      onChange={() => toggleCategory(option.id)}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-950">Coverage</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                <Field label="Coverage ZIP codes" value={zipInput} onChange={setZipInput} placeholder="27701, 27603, 28202" />
                <Field label="Radius miles" type="number" value={String(profile.coverageRadiusMiles)} onChange={value => setProfile({ ...profile, coverageRadiusMiles: Number(value || 0) })} />
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-950">Compliance</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Insurance status</span>
                  <select
                    value={profile.insuranceStatus}
                    onChange={event => setProfile({ ...profile, insuranceStatus: event.target.value as ContractorProfile['insuranceStatus'] })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="missing">Missing</option>
                    <option value="submitted">Submitted</option>
                    <option value="verified">Verified</option>
                  </select>
                </label>
                <Field label="Licenses / credentials" value={profile.licenses.join(', ')} onChange={value => setProfile({ ...profile, licenses: value.split(',').map(item => item.trim()).filter(Boolean) })} />
              </div>
              <textarea
                value={profile.notes || ''}
                onChange={event => setProfile({ ...profile, notes: event.target.value })}
                placeholder="Add notes about equipment, service limitations, or dispatch preferences."
                className="mt-4 h-28 w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            {message && <p className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-700">{message}</p>}

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
              Submit Contractor Profile
            </button>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-950">What PreserveHQ reviews</h2>
              <div className="mt-4 space-y-3">
                {['Service fit and geographic coverage', 'Insurance and required licenses', 'Availability and workload', 'Quality, completion, and complaint history'].map(item => (
                  <div key={item} className="flex gap-2 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {isApproved && (
              <Link href="/vendor/work-orders" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800">
                View Assigned Jobs
              </Link>
            )}
          </aside>
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 border-t bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <Link href="/vendor/dashboard" className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-slate-500">
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/vendor/work-orders" className="flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-slate-500">
          <FileText className="h-5 w-5" />
          <span className="text-xs font-medium">Orders</span>
        </Link>
        <Link href="/vendor/onboarding" className="flex flex-col items-center gap-0.5 rounded-lg bg-blue-50 px-1 py-1.5 text-blue-600">
          <UserCheck className="h-5 w-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
