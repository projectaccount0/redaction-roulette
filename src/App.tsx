import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DropZone } from './components/ui/DropZone';
import { PDFProcessor } from './components/features/PDFProcessor';
import { TypewriterInput } from './components/ui/TypewriterInput';
import { ModeSwitcher } from './components/ui/ModeSwitcher';
import { ImageProcessor } from './components/features/ImageProcessor';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'upload' | 'type' | 'image'>('upload');

  const handleReset = () => {
    // Basic "shredding" cleanup - simply reset state for now.
    // Ideally we'd add an animation here first.
    setFile(null);
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <ModeSwitcher currentMode={mode} onSwitch={setMode} />
      </div>

      {mode === 'upload' ? (
        !file ? (
          <DropZone onFileSelect={setFile} acceptType="pdf" />
        ) : (
          <PDFProcessor file={file} onReset={handleReset} />
        )
      ) : mode === 'image' ? (
        !file ? (
          <DropZone onFileSelect={setFile} acceptType="image" />
        ) : (
          <ImageProcessor file={file} onReset={handleReset} />
        )
      ) : (
        <TypewriterInput />
      )}
    </Layout>
  );
}

export default App;
