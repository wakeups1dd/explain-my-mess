import * as React from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 md:py-20 lg:px-8 relative">
                {/* Floating Elements for Y2K Vibe */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-pastel-pink rounded-full blur-3xl opacity-50 -z-10 animate-pulse pointer-events-none" />
                <div className="absolute top-40 right-10 w-40 h-40 bg-pastel-blue rounded-full blur-3xl opacity-50 -z-10 animate-pulse delay-1000 pointer-events-none" />

                <header className="mb-12 text-center sm:mb-20 space-y-6">
                    <div className="inline-block relative">
                        <h1 className="text-5xl font-black tracking-tight text-slate-800 sm:text-7xl font-display mb-2 relative z-10 drop-shadow-sm">
                            Explain My Mess <span className="text-pastel-lilac">✨</span>
                        </h1>
                        <div className="absolute -bottom-2 left-0 w-full h-4 bg-pastel-mint/50 -rotate-1 rounded-full -z-0" />
                    </div>

                    <div className="inline-block bg-white/40 backdrop-blur-sm border-2 border-dashed border-pastel-lilac rounded-2xl px-6 py-4 max-w-2xl mx-auto rotate-1 hover:rotate-0 transition-transform duration-300">
                        <p className="text-lg sm:text-xl font-medium text-slate-600 font-mono">
                            Turn your chaotic brain dumps 🧠 into clear explanations 💖
                        </p>
                    </div>
                </header>
                <main className="relative z-0">{children}</main>

                <footer className="mt-20 pt-8 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="h-1 w-24 bg-gradient-to-r from-pastel-pink via-pastel-lilac to-pastel-blue rounded-full" />
                    <p className="text-sm font-mono text-slate-400 bg-white/50 px-4 py-1 rounded-full border border-white">
                        Crafted with <span className="text-red-400">♥</span> for the girlies & builders
                    </p>
                </footer>
            </div>
        </div>
    );
}
