'use client';
import { useState } from 'react';

interface Question {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'text' | 'email' | 'image-select';
  text: string;
  subtext?: string;
  options?: { id: string; text: string; icon?: string; image?: string; nextId?: string }[];
  autoNext?: boolean;
}

interface FunnelConfig {
  navbar: { logo: string };
  questions: Question[];
  footer: { showPrev: boolean; showNext: boolean };
  finalPage: { title: string; content: string; openInNewTab?: boolean };
}

export default function FunnelBuilder({ onSave }: { onSave: (config: FunnelConfig) => void }) {
  const [config, setConfig] = useState<FunnelConfig>({
    navbar: { logo: '' },
    questions: [],
    footer: { showPrev: true, showNext: true },
    finalPage: { title: 'Finished!', content: 'Thank you for your answers.' },
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'single-choice',
      text: 'New Question',
      options: [{ id: '1', text: 'Option 1' }],
      autoNext: true,
    };
    setConfig({ ...config, questions: [...config.questions, newQuestion] });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setConfig({
      ...config,
      questions: config.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Navbar Configuration</h2>
        <input 
          type="text" 
          placeholder="Logo Icon URL" 
          className="w-full p-2 border rounded"
          value={config.navbar.logo}
          onChange={(e) => setConfig({ ...config, navbar: { logo: e.target.value } })}
        />
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          <button onClick={addQuestion} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add Question</button>
        </div>
        
        <div className="space-y-4">
          {config.questions.map((q, idx) => (
            <div key={q.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold"># {idx + 1}</span>
                <select 
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, { type: e.target.value as any })}
                  className="p-1 border rounded text-sm"
                >
                  <option value="single-choice">Single Choice</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="text">Text Input</option>
                  <option value="email">Email Input</option>
                  <option value="image-select">Image Select</option>
                </select>
              </div>
              <input 
                type="text" 
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                className="w-full p-2 border rounded mb-2 text-lg"
                placeholder="Question Text"
              />
              <div className="pl-4">
                <h4 className="text-sm font-semibold mb-2">Options</h4>
                {q.options?.map((opt, optIdx) => (
                  <div key={opt.id} className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={opt.text}
                      onChange={(e) => {
                        const newOpts = [...(q.options || [])];
                        if (newOpts[optIdx]) {
                          newOpts[optIdx]!.text = e.target.value;
                          updateQuestion(q.id, { options: newOpts });
                        }
                      }}
                      className="flex-1 p-1 border rounded text-sm"
                      placeholder="Option Text"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newOpts = [...(q.options || []), { id: Math.random().toString(), text: 'New Option' }];
                    updateQuestion(q.id, { options: newOpts });
                  }}
                  className="text-xs text-indigo-600 hover:underline"
                >+ Add Option</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onSave(config)}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
      >Save Funnel</button>
    </div>
  );
}

