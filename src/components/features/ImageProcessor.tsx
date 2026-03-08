import React, { useRef, useState, useEffect } from 'react';

interface ImageProcessorProps {
    file: File;
    onReset: () => void;
}

interface Point {
    x: number;
    y: number;
}

interface Rect {
    start: Point;
    end: Point;
}

export const ImageProcessor: React.FC<ImageProcessorProps> = ({ file, onReset }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<Point>({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState<Point>({ x: 0, y: 0 });
    const [rectangles, setRectangles] = useState<Rect[]>([]);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setImageObj(img);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }, [file]);

    useEffect(() => {
        drawCanvas();
    }, [imageObj, rectangles, isDrawing, currentPos]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageObj) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        // Draw committed rectangles
        ctx.fillStyle = '#000000';
        rectangles.forEach(rect => {
            const width = rect.end.x - rect.start.x;
            const height = rect.end.y - rect.start.y;
            ctx.fillRect(rect.start.x, rect.start.y, width, height);
        });

        // Draw rectangle currently being dragged
        if (isDrawing) {
            const width = currentPos.x - startPos.x;
            const height = currentPos.y - startPos.y;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // semi-transparent while drawing
            ctx.fillRect(startPos.x, startPos.y, width, height);

            // Draw a red border to show it's active
            ctx.strokeStyle = '#cc0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(startPos.x, startPos.y, width, height);
        }
    };

    // Calculate mouse position relative to canvas taking scaling into account
    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getCoordinates(e);
        setStartPos(pos);
        setCurrentPos(pos);
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setCurrentPos(getCoordinates(e));
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        // Only add if it's an actual rectangle (not a tiny click)
        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);

        if (width > 5 && height > 5) {
            setRectangles([...rectangles, { start: startPos, end: currentPos }]);
        }
    };

    const handleUndo = () => {
        setRectangles(rectangles.slice(0, -1));
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Draw one final time ensuring solid black for the output
        const ctx = canvas.getContext('2d');
        if (ctx && imageObj) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000000';
            rectangles.forEach(rect => {
                const width = rect.end.x - rect.start.x;
                const height = rect.end.y - rect.start.y;
                ctx.fillRect(rect.start.x, rect.start.y, width, height);
            });

            // Add a stamp
            ctx.save();
            ctx.translate(canvas.width - 250, canvas.height - 100);
            ctx.rotate(-10 * Math.PI / 180);
            ctx.font = 'bold 30px Impact';
            ctx.fillStyle = 'rgba(204, 0, 0, 0.8)';
            ctx.strokeStyle = 'rgba(204, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.strokeRect(-10, -35, 220, 45);
            ctx.fillText('EXHIBIT A', 0, 0);
            ctx.restore();
        }

        const link = document.createElement('a');
        link.download = `REDACTED_${file.name}`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Redraw normally
        drawCanvas();
    };


    if (!imageObj) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading image...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>

            <div style={{
                fontFamily: '"Courier Prime", Courier, monospace',
                backgroundColor: '#ffffcc',
                padding: '0.5rem 1rem',
                border: '1px solid #000',
                width: '100%',
                textAlign: 'center',
                fontWeight: 'bold'
            }}>
                INSTRUCTIONS: Click and drag over the image to draw permanent redaction bars.
            </div>

            <div style={{
                position: 'relative',
                border: '4px solid #000',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                maxWidth: '100%',
                maxHeight: '60vh',
                overflow: 'hidden',
                backgroundColor: '#eee'
            }}>
                <canvas
                    ref={canvasRef}
                    width={imageObj.width}
                    height={imageObj.height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '60vh',
                        objectFit: 'contain',
                        cursor: 'crosshair',
                        display: 'block' // removes bottom gap
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                    onClick={onReset}
                    style={{
                        padding: '10px 20px',
                        border: '2px solid #000',
                        background: '#fff',
                        cursor: 'pointer',
                        fontFamily: '"Courier Prime", Courier, monospace',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                    Abandon File
                </button>

                <button
                    onClick={handleUndo}
                    disabled={rectangles.length === 0}
                    style={{
                        padding: '10px 20px',
                        border: '2px solid #000',
                        background: rectangles.length > 0 ? '#fff' : '#eee',
                        color: rectangles.length > 0 ? '#000' : '#888',
                        cursor: rectangles.length > 0 ? 'pointer' : 'not-allowed',
                        fontFamily: '"Courier Prime", Courier, monospace',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}
                >
                    Undo Last Block
                </button>

                <button
                    onClick={handleDownload}
                    style={{
                        padding: '10px 20px',
                        border: '2px solid #ffffff',
                        background: '#000000',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontFamily: '"Courier Prime", Courier, monospace',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        boxShadow: '4px 4px 0px #cc0000'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translate(2px, 2px)';
                        e.currentTarget.style.boxShadow = '2px 2px 0px #cc0000';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translate(0px, 0px)';
                        e.currentTarget.style.boxShadow = '4px 4px 0px #cc0000';
                    }}
                >
                    Export Evidence
                </button>
            </div>
        </div>
    );
};
