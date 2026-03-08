import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { RedactionEngine } from '../../features/RedactionEngine';
import { RetroButton } from '../ui/RetroButton';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFProcessorProps {
    file: File;
    onReset: () => void;
}

export const PDFProcessor: React.FC<PDFProcessorProps> = ({ file, onReset }) => {
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentAction, setCurrentAction] = useState('Initializing...');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // We'll show the first page as a preview
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const processPDF = async () => {
        setProcessing(true);
        setDownloadUrl(null);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;

            const numPages = pdf.numPages;
            const processedPages: string[] = []; // Base64 images

            const newPdfDoc = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4', // Default, will adjust per page
                putOnlyUsedFonts: true,
            });

            // Cleanup existing pages (jsPDF starts with 1)
            newPdfDoc.deletePage(1);

            for (let i = 1; i <= numPages; i++) {
                setCurrentAction(`Processing page ${i} / ${numPages}...`);

                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High res for quality

                // Setup canvas for rendering
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) throw new Error('Canvas context not available');

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Render original page
                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                } as any).promise;

                // --- REDACTION PHASE ---
                const textContent = await page.getTextContent();

                // Loop through text items and redact
                for (const item of textContent.items) {
                    // pdf.js types are a bit loose, cast to any to access standard text item props safely or define interface
                    const textItem = item as any;

                    const tx = textItem.transform;

                    const fontSize = Math.sqrt((tx[0] * tx[0]) + (tx[1] * tx[1]));

                    const x = tx[4];
                    const y = tx[5];

                    const viewPoint = viewport.convertToViewportPoint(x, y);

                    const vx = viewPoint[0];
                    const vy = viewPoint[1]; // tailored for canvas

                    const width = textItem.width * viewport.scale;
                    const height = (textItem.height || fontSize) * viewport.scale; // Fallback to font size if height missing

                    // Decision Engine
                    if (RedactionEngine.shouldRedact(textItem.str)) {
                        context.fillStyle = '#000000';
                        // Draw rect. Adjust y because text baseline vs top-left
                        // Usually vy is the baseline. So we need to go up by height.

                        context.fillRect(vx - 2, vy - height + (height * 0.2), width + 4, height);
                    }
                }

                // --- WATERMARK PHASE ---
                context.save();
                // Updated Watermark for lighter theme - Red Stamped Look
                context.globalAlpha = 0.15; // Slightly more visible
                context.fillStyle = '#cc0000'; // Stamped Red

                context.font = 'bold 48px "Courier New"';
                context.translate(canvas.width / 2, canvas.height / 2);
                context.rotate(-30 * Math.PI / 180);
                context.textAlign = 'center';

                const watermarkLines = [
                    "F O I A - R E L E A S E",
                    "CASE: SDNY-1:19-cr-00499",
                    "SUBJECT: EPSTEIN RELATED",
                    "REDACTION LEVEL: STANDARD"
                ];

                watermarkLines.forEach((line, idx) => {
                    context.fillText(line, 0, (idx - 1.5) * 60);
                });

                context.restore();

                // --- PREVIEW UPDATE ---
                if (i === 1 && canvasRef.current) {
                    const previewCtx = canvasRef.current.getContext('2d');
                    if (previewCtx) {
                        // Scale down for preview
                        // We'll just draw the full res canvas into the preview canvas which might be small
                        // But let's keep the preview canvas responsive
                        canvasRef.current.width = canvas.width;
                        canvasRef.current.height = canvas.height;
                        previewCtx.drawImage(canvas, 0, 0);
                    }
                }

                // --- EXPORT PHASE ---
                const imgData = canvas.toDataURL('image/jpeg', 0.8); // JPEG for size, 0.8 quality
                processedPages.push(imgData);

                // Add to PDF
                // JsPDF units are weird. Let's use px and match the canvas size.
                newPdfDoc.addPage([canvas.width, canvas.height], viewport.width > viewport.height ? 'l' : 'p');
                newPdfDoc.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

                setProgress(Math.round((i / numPages) * 100));
            }

            const pdfBlob = newPdfDoc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setDownloadUrl(url);
            setCurrentAction('COMPLETE');
            setProcessing(false);

        } catch (error) {
            console.error(error);
            setCurrentAction('ERROR: ' + (error as Error).message);
            setProcessing(false);
        }
    };

    useEffect(() => {
        // Auto-start processing on mount
        processPDF();
        return () => {
            // Cleanup
            if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        };
    }, [file]); // processing depends on file

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '2rem',
                padding: '1rem',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f9f9f9'
            }}>
                <RetroButton onClick={processPDF} disabled={processing} icon="🔀">
                    Re-Redact
                </RetroButton>

                {downloadUrl && (
                    <a href={downloadUrl} download="REDACTED_DOCUMENT.pdf" style={{ textDecoration: 'none' }}>
                        <RetroButton variant="primary" icon="📥">
                            Download Redacted PDF
                        </RetroButton>
                    </a>
                )}

                <RetroButton onClick={onReset} variant="danger" icon="🗑️">
                    Shred Evidence
                </RetroButton>
            </div>

            {/* Status */}
            <div style={{ textAlign: 'center', marginBottom: '1rem', fontFamily: 'monospace', color: '#000' }}>
                STATUS: <span style={{ color: processing ? '#cc0000' : 'green', fontWeight: 'bold' }}>{processing ? 'REDACTING...' : 'READY'}</span> [{progress}%]
                <br />
                <span style={{ color: '#666', fontSize: '0.8rem' }}>{currentAction}</span>
            </div>

            {/* Viewer */}
            <div style={{
                background: '#fff',
                padding: '2rem',
                border: '1px solid #ccc',
                minHeight: '500px',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)'
            }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        maxWidth: '100%',
                        boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
                        border: '1px solid #ddd'
                    }}
                />
            </div>
        </div>
    );
};
