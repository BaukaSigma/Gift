import React from 'react';

// Direct iframe embed — no scripts, always works
export default function TenorGif({ postId, width = 180, height = 180 }) {
    return (
        <div style={{
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '16px',
            overflow: 'hidden',
            border: '3px solid #D86386',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 0 #D86386',
            flexShrink: 0
        }}>
            <iframe
                src={`https://tenor.com/embed/${postId}`}
                width={width}
                height={height}
                frameBorder="0"
                allowFullScreen
                style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
                title="Tenor GIF"
            />
        </div>
    );
}
