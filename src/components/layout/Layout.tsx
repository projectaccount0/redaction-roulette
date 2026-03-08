import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{
            /* The outer container is now just a wrapper for positioning */
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingBottom: '5rem',
            position: 'relative',
            overflowX: 'hidden', // Prevent horizontal scroll from palms
            // backgroundColor: 'transparent' // Default is transparent
        }}>

            {/* Palm Trees Removed */}

            {/* The Temple Box - Container for the Document */}
            <div style={{
                marginTop: '3rem',
                padding: '2rem',
                /* Temple Blue/White Stripes restored */
                background: 'repeating-linear-gradient(to bottom, #ffffff, #ffffff 40px, #0055aa 40px, #0055aa 80px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '4px solid #000',
                maxWidth: '1000px',
                width: '95%',
                position: 'relative',
                zIndex: 10
            }}>
                {/* The Actual Document Sheet */}
                <div style={{
                    backgroundColor: '#f4f1ea', // The paper
                    padding: '3rem 2rem',
                    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                    border: '1px solid #999',
                    minHeight: '80vh'
                }}>
                    <header style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        borderBottom: '4px double #000',
                        paddingBottom: '2rem'
                    }}>
                        <div style={{
                            fontFamily: 'Impact, sans-serif',
                            border: '4px solid #cc0000',
                            color: '#cc0000',
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            transform: 'rotate(-2deg)',
                            fontSize: '1.5rem',
                            marginBottom: '1rem',
                            opacity: 0.9
                        }}>
                            CONFIDENTIAL
                        </div>

                        <h1 style={{
                            color: '#000000',
                            fontSize: '4rem',
                            fontFamily: '"Courier New", Courier, monospace',
                            fontWeight: 'bold',
                            letterSpacing: '-2px',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem'
                        }}>
                            REDACTION ROULETTE
                        </h1>
                        <p style={{
                            fontFamily: '"Times New Roman", Times, serif',
                            fontStyle: 'italic',
                            color: '#444444',
                            fontSize: '1.2rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            "Process any document as if it were a high-profile client list released by the Southern District of New York."
                        </p>
                    </header>

                    <main style={{ flex: 1 }}>
                        {children}
                    </main>

                    <footer style={{
                        marginTop: '4rem',
                        borderTop: '1px solid #000',
                        paddingTop: '2rem',
                        color: '#444444',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        fontFamily: '"Courier New", Courier, monospace',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        <div><strong>NOTICE:</strong> SATIRICAL TOOL. RANDOM REDACTIONS APPLIED.</div>
                        <div><strong>SECURITY LEVEL:</strong> CLIENT-SIDE ONLY. NO EXTERNAL DATA TRANSMISSION.</div>
                        <div><strong>OUTPUT:</strong> WATERMARKED PDF.</div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <a
                                href="https://x.com/redactroulette"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#444444', textDecoration: 'underline', fontWeight: 'bold', fontSize: '2rem' }}
                            >
                                X
                            </a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};
