'use client';

import React, { useEffect, useRef } from 'react';
// @ts-ignore
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
// @ts-ignore
import webpagePlugin from 'grapesjs-preset-webpage';

interface GrapesEditorProps {
  initialData?: string;
  onSave?: (data: any) => void;
}

const GrapesEditor: React.FC<GrapesEditorProps> = ({ onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: 'calc(100vh - 120px)',
      width: 'auto',
      storageManager: false,
      plugins: [webpagePlugin],
      pluginsOpts: {
        [webpagePlugin]: {},
      },
    });

    // Add Logic Blocks
    const blockManager = editor.BlockManager;

    blockManager.add('if-block', {
      label: 'If Condition',
      category: 'Logic',
      content: {
        type: 'text',
        content: `{{#if condition}} <div>Visible if condition is true</div> {{/if}}`,
        style: { padding: '10px', border: '1px dashed #ccc' }
      },
    });

    blockManager.add('each-block', {
      label: 'For Each',
      category: 'Logic',
      content: {
        type: 'text',
        content: `{{#each items}} <div>{{this}}</div> {{/each}}`,
        style: { padding: '10px', border: '1px dashed #ccc' }
      },
    });

    blockManager.add('variable', {
      label: 'Variable',
      category: 'Variables',
      content: {
        type: 'text',
        content: `{{variable_name}}`,
      },
    });

    // Custom Save Button
    editor.Panels.addButton('options', {
      id: 'save-db',
      className: 'fa fa-floppy-o',
      command: 'save-to-db',
      attributes: { title: 'Save to DB' },
    });

    editor.Commands.add('save-to-db', {
      run: (editor: any) => {
        const htmlexport = editor.getHtml();
        const cssexport = editor.getCss();
        const data = { html: htmlexport, css: cssexport, json: editor.getProjectData() };
        if (onSave) onSave(data);
        alert('Saved successfully!');
      },
    });

    return () => {
      editor.destroy();
    };
  }, [onSave]);

  return (
    <div className="w-full h-full">
      <div ref={editorRef} />
    </div>
  );
};

export default GrapesEditor;
