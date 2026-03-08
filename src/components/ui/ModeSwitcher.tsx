import React from 'react';

interface ModeSwitcherProps {
    currentMode: 'upload' | 'type' | 'image';
    onSwitch: (mode: 'upload' | 'type' | 'image') => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onSwitch }) => {
    return (
        <div style={{
            display: 'flex',
            border: '2px solid #000',
            backgroundColor: '#fff',
            marginBottom: '2rem',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
            flexWrap: 'wrap' // handle smaller screens with 3 buttons
        }}>
            <button
                onClick={() => onSwitch('upload')}
                style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRight: '2px solid #000',
                    background: currentMode === 'upload' ? '#000' : 'transparent',
                    color: currentMode === 'upload' ? '#fff' : '#000',
                    fontFamily: '"Courier Prime", Courier, monospace',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                }}
            >
                Upload File
            </button>
            <button
                onClick={() => onSwitch('type')}
                style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRight: '2px solid #000',
                    background: currentMode === 'type' ? '#000' : 'transparent',
                    color: currentMode === 'type' ? '#fff' : '#000',
                    fontFamily: '"Courier Prime", Courier, monospace',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                }}
            >
                Write Confession
            </button>
            <button
                onClick={() => onSwitch('image')}
                style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    background: currentMode === 'image' ? '#000' : 'transparent',
                    color: currentMode === 'image' ? '#fff' : '#000',
                    fontFamily: '"Courier Prime", Courier, monospace',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                }}
            >
                Scrub Photo
            </button>
        </div>
    );
};
