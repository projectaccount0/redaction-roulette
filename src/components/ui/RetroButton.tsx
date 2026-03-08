import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
}

export const RetroButton: React.FC<RetroButtonProps> = ({
    children,
    variant = 'primary',
    icon,
    className = '',
    ...props
}) => {

    const styles: React.CSSProperties = {
        fontFamily: '"Courier New", Courier, monospace',
        padding: '12px 24px',
        border: '2px solid #000',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: '4px 4px 0px #999',
        transition: 'transform 0.1s, box-shadow 0.1s',
        ...((variant === 'primary') ? {
            borderColor: '#000',
            backgroundColor: '#f0f0f0',
        } : {}),
        ...((variant === 'secondary') ? {
            borderColor: '#666',
            backgroundColor: '#fff',
            color: '#444',
        } : {}),
        ...((variant === 'danger') ? {
            borderColor: '#cc0000',
            color: '#cc0000',
            backgroundColor: '#fff0f0',
            boxShadow: '4px 4px 0px #cc0000',
        } : {}),
    } as React.CSSProperties;

    return (
        <button
            style={styles}
            className={className}
            onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0px ' + (variant === 'danger' ? '#cc0000' : '#999');
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '4px 4px 0px ' + (variant === 'danger' ? '#cc0000' : '#999');
            }}
            {...props}
        >
            {icon && <span className="icon">{icon}</span>}
            {children}
        </button>
    );
};
