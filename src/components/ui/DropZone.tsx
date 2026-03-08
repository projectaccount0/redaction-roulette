import React, { useRef, useState } from 'react';

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    acceptType?: 'pdf' | 'image';
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, acceptType = 'pdf' }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];

            if (acceptType === 'pdf' && file.type === 'application/pdf') {
                onFileSelect(file);
            } else if (acceptType === 'image' && file.type.startsWith('image/')) {
                onFileSelect(file);
            } else {
                alert(`Only ${acceptType === 'pdf' ? 'PDF' : 'Image'} files are supported.`);
            }
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (acceptType === 'pdf' && file.type === 'application/pdf') {
                onFileSelect(file);
            } else if (acceptType === 'image' && file.type.startsWith('image/')) {
                onFileSelect(file);
            } else {
                alert(`Only ${acceptType === 'pdf' ? 'PDF' : 'Image'} files are supported.`);
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: '4px dashed ' + (isDragOver ? '#cc0000' : '#444'),
                borderRadius: '0px',
                backgroundColor: isDragOver ? '#fafafa' : '#fcfcfc',
                padding: '5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                marginTop: '2rem',
                position: 'relative',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)'
            }}
        >
            <input
                type="file"
                ref={inputRef}
                style={{ display: 'none' }}
                accept={acceptType === 'pdf' ? "application/pdf" : "image/*"}
                onChange={handleFileChange}
            />

            <div style={{ fontSize: '5rem', opacity: 0.2, filter: 'grayscale(100%)' }}>📁</div>

            <h2 style={{
                color: '#000',
                fontSize: '2rem',
                fontFamily: '"Courier New", Courier, monospace',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                INSERT {acceptType === 'pdf' ? 'CASE FILE (PDF)' : 'EVIDENCE (IMG)'}
            </h2>

            <p style={{ color: '#666', fontSize: '1rem', fontStyle: 'italic', fontFamily: 'Times New Roman' }}>
                "Maximum file size classification: 10MB"
            </p>

            <div style={{
                marginTop: '1rem',
                padding: '12px 24px',
                backgroundColor: '#fff',
                color: '#cc0000',
                border: '3px solid #cc0000',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '1rem',
                transform: 'rotate(-2deg)',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
            }}>
                INITIATE PROCESS
            </div>
        </div>
    );
};
