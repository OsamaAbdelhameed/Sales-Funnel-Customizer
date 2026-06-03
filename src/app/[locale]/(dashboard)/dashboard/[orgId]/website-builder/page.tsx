'use client';

import GrapesEditor from '@/components/Editor/GrapesEditor';

export default function WebsiteBuilderPage({ params }: { params: { orgId: string } }) {
  const handleSave = (data: any) => {
    console.log('Saving website data for org:', params.orgId, data);
    // Here we will call the SpacetimeDB API
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Website Builder</h1>
        <div className="flex gap-2">
          <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Preview</button>
        </div>
      </div>
      <div className="rounded border bg-white shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
        <GrapesEditor onSave={handleSave} />
      </div>
    </div>
  );
}
