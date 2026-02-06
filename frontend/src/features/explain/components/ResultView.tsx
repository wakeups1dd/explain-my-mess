import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '../../../components/ui/Card';
import { AlertCircle, Sparkles } from 'lucide-react';

interface ResultViewProps {
    markdown: string;
    loading: boolean;
    error?: string;
}

export function ResultView({ markdown, loading, error }: ResultViewProps) {
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-40 bg-pastel-lilac/30 rounded-[2rem] w-full border-2 border-white" />
                <div className="space-y-3 px-4">
                    <div className="h-4 bg-pastel-pink/30 rounded-full w-3/4" />
                    <div className="h-4 bg-pastel-blue/30 rounded-full w-1/2" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[2rem] bg-red-50 p-8 border-2 border-red-200 flex flex-col items-center justify-center text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(254,202,202,1)]">
                <div className="p-3 bg-red-100 rounded-full text-red-500">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold font-display text-red-900">Oops, vibe check failed</h3>
                    <p className="text-red-700 font-medium max-w-sm mx-auto">{error}</p>
                </div>
            </div>
        );
    }

    if (!markdown) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center space-x-3 text-pastel-text mb-6 px-4 bg-white/40 w-fit py-2 px-6 rounded-full border border-white backdrop-blur-sm mx-auto sm:mx-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="font-bold font-display text-lg">Here's the tea 🫖</span>
            </div>

            <Card className="overflow-hidden border-2 border-white shadow-[8px_8px_0px_0px_#E2D1F9]">
                <CardContent className="p-8 sm:p-10 prose prose-slate prose-lg max-w-none 
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-pastel-text 
                    prose-p:text-slate-600 prose-p:font-medium
                    prose-a:text-indigo-500 prose-a:font-bold prose-a:no-underline hover:prose-a:text-indigo-600
                    prose-strong:text-indigo-900 prose-strong:bg-pastel-blue/30 prose-strong:px-1 prose-strong:rounded
                    prose-code:text-indigo-600 prose-code:bg-pastel-lilac/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
                    prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:rounded-2xl prose-pre:shadow-lg
                    prose-li:marker:text-pastel-pink">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </CardContent>
            </Card>
        </div>
    );
}
