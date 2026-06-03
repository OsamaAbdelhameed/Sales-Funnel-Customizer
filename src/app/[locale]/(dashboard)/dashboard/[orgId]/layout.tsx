import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              SaaS Funnel
            </Link>
            <OrganizationSwitcher 
              afterCreateOrganizationUrl="/dashboard/:id"
              afterSelectOrganizationUrl="/dashboard/:id"
            />
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-gray-50 p-6">
          <nav className="flex flex-col gap-2">
            <Link href={`./website-builder`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
              Website Builder
            </Link>
            <Link href={`./pdf-builder`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
              PDF Builder
            </Link>
            <Link href={`./funnel-builder`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
              Questionnaire Funnel
            </Link>
            <div className="my-4 border-t" />
            <Link href={`./billing`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
              Billing
            </Link>
            <Link href={`./settings`} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
