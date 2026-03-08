import React, { useState } from 'react';
import { RetroButton } from './RetroButton';
import { RedactionEngine } from '../../features/RedactionEngine';
import { jsPDF } from 'jspdf';

// Font for the PDF generation (we'll just use standard courier for now in jsPDF to keep it simple, 
// or clean up the text).

export const TypewriterInput: React.FC = () => {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDownload = () => {
        setIsProcessing(true);

        // precise 100ms delay to simulate "processing"
        setTimeout(() => {
            try {
                const doc = new jsPDF();

                // Set font to Courier
                doc.setFont('Courier');
                doc.setFontSize(12);

                // Split text into lines that fit the page
                // A4 width is ~210mm. Margins ~20mm. Usable ~170mm.
                const splitText = doc.splitTextToSize(text, 170);

                let cursorY = 20;
                const lineHeight = 7;
                const pageHeight = 280; // approximate useful height

                // Draw text line by line
                splitText.forEach((line: string) => {
                    if (cursorY > pageHeight) {
                        doc.addPage();
                        cursorY = 20;
                    }

                    // Split line into words for redaction check
                    // This is a naive implementation; for perfectly robust visual redaction 
                    // we'd need to measure every word. 
                    // For "Roulette" vibe, we can just decide to redact the WHOLE line or random words.
                    // Let's do word-by-word measurement for better effect.

                    const words = line.split(' ');
                    let cursorX = 20;

                    words.forEach((word) => {
                        const wordWidth = doc.getTextWidth(word + ' ');

                        // Check redaction
                        if (RedactionEngine.shouldRedact(word)) {
                            // Draw Black Bar
                            doc.setFillColor(0, 0, 0);
                            doc.rect(cursorX, cursorY - 4, wordWidth, 5, 'F');
                        } else {
                            // Draw Text
                            doc.text(word, cursorX, cursorY);
                        }

                        cursorX += wordWidth;
                    });

                    cursorY += lineHeight;
                });

                // Add stamps randomly
                const stamps = ['CONFIDENTIAL', 'SECRET', 'TOP SECRET', 'EYES ONLY'];
                const randomStamp = stamps[Math.floor(Math.random() * stamps.length)];

                doc.setTextColor(204, 0, 0); // Red
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(30);
                // use `any` cast to get around missing typings for GState in the jsPDF typings version
                doc.setGState(new (doc.GState as any)({ opacity: 0.4 }));
                doc.text(randomStamp, 40, 40, { angle: 15 });

                doc.save('redacted_confession.pdf');
            } catch (error) {
                console.error("PDF Generation Failed:", error);
                alert("Critical Error: The redaction machine jammed. Check console.");
            } finally {
                setIsProcessing(false);
            }
        }, 1500);
    };

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '800px',
                minHeight: '400px',
            }}>
                {/* Paper Header / Watermark effect */}
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '20px',
                    fontSize: '0.8rem',
                    color: '#999',
                    fontFamily: 'Courier, monospace',
                    zIndex: 2
                }}>
                    FORM 82-B // INCIDENT REPORT
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="TYPE YOUR INCIDENT REPORT HERE..."
                    style={{
                        width: '100%',
                        minHeight: '60vh',
                        padding: '3rem 2rem',
                        backgroundColor: '#fdfbf7',
                        backgroundImage: 'linear-gradient(#e1e1e1 1px, transparent 1px)',
                        backgroundSize: '100% 2rem',
                        lineHeight: '2rem',
                        border: 'none',
                        resize: 'none',
                        fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
                        fontSize: '1.2rem',
                        color: '#333',
                        outline: 'none',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
                    }}
                    spellCheck={false}
                />
            </div>

            <RetroButton
                onClick={handleDownload}
                disabled={isProcessing || text.length === 0}
            >
                {isProcessing ? 'REDACTING...' : 'CLASSIFY & EXPORT'}
            </RetroButton>
        </div>
    );
};
