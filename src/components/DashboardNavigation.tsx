'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, FileText, Home, MapPin, Settings, UserCheck } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/properties', label: 'Your Properties', icon: MapPin },
  { href: '/dashboard/work-orders', label: 'Work Orders', icon: FileText },
  { href: '/dashboard/dispatch', label: 'Dispatch', icon: UserCheck },
  { href: '/dashboard/inspections', label: 'Inspections', icon: Camera },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <Link href="/dashboard" className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white">P</span>
          <span className="text-lg font-black text-slate-950">PreserveHQ</span>
        </Link>
        <nav aria-label="Dashboard navigation" className="space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav aria-label="Dashboard navigation" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t border-slate-200 bg-white/95 px-1 pt-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-0.5 text-center transition ${active ? 'text-blue-700' : 'text-slate-500 hover:text-blue-700'}`}
            >
              <Icon className="h-[1.15rem] w-[1.15rem] shrink-0" />
              <span className="text-[9px] font-semibold leading-[11px]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
