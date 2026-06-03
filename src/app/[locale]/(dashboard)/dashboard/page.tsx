import { OrganizationList } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default async function DashboardIndexPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  
  const { orgId } = await auth();

  if (orgId) {
    redirect(`/dashboard/${orgId}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">Select an Organization</h1>
        <OrganizationList 
          hidePersonal
          afterCreateOrganizationUrl="/dashboard/:id"
          afterSelectOrganizationUrl="/dashboard/:id"
        />
      </div>
    </div>
  );
}
