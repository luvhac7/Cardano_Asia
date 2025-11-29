import { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

interface EncryptedTextProps {
    text: string;
    className?: string;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?';

export const EncryptedText = ({ text, className = '' }: EncryptedTextProps) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isHovered) {
            intervalRef.current = setInterval(() => {
                setDisplayText(prev =>
                    prev.split('').map((char, index) => {
                        if (char === ' ') return ' ';
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    }).join('')
                );
            }, 50);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setDisplayText(text);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered, text]);

    return (
        <div
            className={`relative group cursor-crosshair ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className={`transition-opacity duration-300 ${isHovered ? 'text-green-400 font-mono' : ''}`}>
                {displayText}
            </span>

            {isHovered && (
                <span className="absolute -top-4 -right-4 text-xs text-green-500 bg-black/80 px-1 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Encrypted
                </span>
            )}
        </div>
    );
};
