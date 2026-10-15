import DashboardNavigation from '@/components/DashboardNavigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0 lg:pl-64">
      <DashboardNavigation />
      {children}
    </div>
  );
}
