'use client';

import FunnelBuilder from '@/components/Funnel/FunnelBuilder';

export default function FunnelBuilderPage({ params }: { params: { orgId: string } }) {
  const handleSave = (config: any) => {
    console.log('Saving funnel config for org:', params.orgId, config);
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Questionnaire Funnel Customizer</h1>
      </div>
      <div className="rounded border bg-gray-50 shadow-sm overflow-hidden min-h-[600px]">
        <FunnelBuilder onSave={handleSave} />
      </div>
    </div>
  );
}
