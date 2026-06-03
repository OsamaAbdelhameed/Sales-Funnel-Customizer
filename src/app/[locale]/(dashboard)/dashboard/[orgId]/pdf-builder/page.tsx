'use client';

import GrapesEditor from '@/components/Editor/GrapesEditor';
import Handlebars from 'handlebars';

export default function PdfBuilderPage({ params }: { params: { orgId: string } }) {
  const handleSave = (data: any) => {
    // Example usage of handlebars for template processing
    const template = Handlebars.compile(data.html);
    console.log('Processed template:', template({ orgId: params.orgId }));
    console.log('Saving PDF data for org:', params.orgId, data);
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">PDF Builder</h1>
        <div className="flex gap-2">
          <button className="rounded bg-red-600 text-white px-4 py-2 hover:bg-red-700">Export PDF</button>
        </div>
      </div>
      <div className="rounded border bg-white shadow-sm overflow-hidden" style={{ minHeight: '600px' }}>
        {/* We can pass a pdf mode or similar if needed */}
        <GrapesEditor onSave={handleSave} />
      </div>
    </div>
  );
}
