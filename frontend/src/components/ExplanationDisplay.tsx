import ReactMarkdown from 'react-markdown';
import { Bot, Sparkles } from 'lucide-react';

interface ExplanationDisplayProps {
    markdown: string;
    loading?: boolean;
}

export function ExplanationDisplay({ markdown, loading }: ExplanationDisplayProps) {
    if (loading) {
        return (
            <div className="w-full p-10 rounded-2xl border-2 border-border/30 bg-surface shadow-luxury flex flex-col items-center justify-center min-h-[300px] gap-5">
                <div className="relative">
                    {/* Glowing spinner */}
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin glow-purple" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse" />
                    </div>
                </div>
                <p className="text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Analyzing your mess with AI magic...
                </p>
            </div>
        );
    }

    if (!markdown) {
        return null;
    }

    return (
        <div className="w-full rounded-2xl border-2 border-border/30 bg-surface shadow-luxury overflow-hidden hover-luxury">
            {/* Luxurious Header with Gradient */}
            <div className="relative gradient-rose px-6 py-5 flex items-center gap-4 border-b border-white/20">
                <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-xl blur-md" />
                    <div className="relative w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <Bot className="w-7 h-7 text-pink-600" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">AI Explanation</h2>
                    <p className="text-xs text-white/80 font-medium">Generated with care ✨</p>
                </div>
            </div>

            {/* Elegant Content */}
            <div className="p-8 prose prose-slate prose-lg max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => (
                            <h1 className="text-3xl font-bold mb-4 mt-6 first:mt-0" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                            <h2 className="text-2xl font-bold mt-6 mb-3 first:mt-0" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                            <h3 className="text-xl font-bold mt-5 mb-2 first:mt-0" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                            <p className="text-text-secondary leading-relaxed mb-4" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                            <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-text-secondary" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-text-secondary" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                        ),
                        code: ({ node, inline, className, children, ...props }: any) => {
                            return inline ? (
                                <code className="px-2 py-1 rounded-lg text-sm font-mono font-semibold bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50" {...props}>
                                    {children}
                                </code>
                            ) : (
                                <pre className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-text-primary p-5 rounded-xl border border-border/30 overflow-x-auto mb-4 text-sm font-mono shadow-inner">
                                    <code {...props}>{children}</code>
                                </pre>
                            );
                        },
                        blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 pl-5 py-3 my-4 font-medium text-text-secondary italic rounded-r-lg" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                            <a className="text-purple-600 dark:text-purple-400 font-semibold underline decoration-2 underline-offset-2 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-300" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                            <strong className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" {...props} />
                        ),
                    }}
                >
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    );
}
