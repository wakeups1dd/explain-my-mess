import React, { useEffect } from 'react';
import { Logo } from './Logo';
import { DarkModeToggle } from './DarkModeToggle';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    useEffect(() => {
        // Track cursor position for dynamic gradient
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;

            // Update CSS custom properties for dynamic gradient
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Dynamic Gradient Background that follows cursor */}
            <div
                className="fixed inset-0 -z-10 transition-all duration-300 ease-out"
                style={{
                    background: `
                        radial-gradient(
                            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                            rgba(147, 51, 234, 0.15) 0%,
                            rgba(219, 39, 119, 0.1) 25%,
                            rgba(251, 191, 36, 0.05) 50%,
                            transparent 70%
                        ),
                        linear-gradient(135deg, rgb(var(--color-background)) 0%, rgb(var(--color-surface-elevated)) 100%)
                    `
                }}
            />

            {/* Luxurious Header with Gradient */}
            <header className="relative gradient-luxury backdrop-luxury border-b border-border/20 z-10">
                <div className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-4">
                        <Logo size="md" className="text-white" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))' }} />
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight" style={{ background: 'none', WebkitTextFillColor: 'white' }}>
                                Explain My Mess
                            </h1>
                            <p className="text-xs text-white/80 font-medium">AI-Powered Clarity</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <DarkModeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10">
                {children}
            </main>

            {/* Elegant Footer */}
            <footer className="border-t border-border/20 bg-surface/80 backdrop-luxury relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Logo size="sm" className="opacity-60" />
                            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Explain My Mess
                            </span>
                            <span className="text-text-tertiary">·</span>
                            <span className="text-text-tertiary">v1.0</span>
                        </div>
                        <p className="text-text-tertiary italic">
                            Transforming complexity into clarity ✨
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
