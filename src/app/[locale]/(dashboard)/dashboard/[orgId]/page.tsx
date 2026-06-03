import { setRequestLocale } from 'next-intl/server';
import * as Spacetime from '@/libs/Spacetime';

export default async function DashboardPage(props: { params: Promise<{ orgId: string; locale: string }> }) {
  const { orgId, locale } = await props.params;
  setRequestLocale(locale);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">Welcome to your organization's dashboard ({orgId}).</p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Websites</h2>
          <p className="mt-2 text-gray-500">Manage your funnel landing pages.</p>
          <button className="mt-4 text-indigo-600 hover:underline">New Page →</button>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">PDFs</h2>
          <p className="mt-2 text-gray-500">Create dynamic PDF documents.</p>
          <button className="mt-4 text-indigo-600 hover:underline">New PDF →</button>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Funnels</h2>
          <p className="mt-2 text-gray-500">Customize your questionnaire flow.</p>
          <button className="mt-4 text-indigo-600 hover:underline">New Funnel →</button>
        </div>
      </div>
    </div>
  );
}
