import { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

interface EncryptedImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const EncryptedImage = ({ src, alt, className = '' }: EncryptedImageProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !isHovered) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = src;
        img.crossOrigin = "Anonymous";

        let animationFrameId: number;

        const drawNoise = () => {
            if (!canvas) return;

            // Set canvas size to match container
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;

            // Draw random colored rectangles (glitch effect)
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Draw original image with heavy pixelation/distortion
            // We simulate this by drawing random chunks of the image

            // Fill with static noise
            for (let i = 0; i < 50; i++) {
                ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
                ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 100, Math.random() * 10);
            }

            // Draw random hex codes
            ctx.font = '12px monospace';
            ctx.fillStyle = '#0f0';
            for (let i = 0; i < 20; i++) {
                ctx.fillText(Math.random().toString(16).substring(2, 10), Math.random() * w, Math.random() * h);
            }

            animationFrameId = requestAnimationFrame(drawNoise);
        };

        img.onload = () => {
            drawNoise();
        };

        // If image is already loaded (cached)
        if (img.complete) {
            drawNoise();
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovered, src]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden group cursor-crosshair ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Original Image */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-100 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Glitch Canvas Overlay */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Encryption Badge */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-green-500/50 flex flex-col items-center">
                    <Lock className="w-8 h-8 text-green-500 mb-2 animate-pulse" />
                    <span className="text-green-400 font-mono text-sm tracking-widest">ENCRYPTED_MEDIA</span>
                    <span className="text-green-600/70 font-mono text-xs mt-1">ZK-SNARK PROTECTED</span>
                </div>
            </div>
        </div>
    );
};
