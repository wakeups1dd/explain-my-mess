import React, { useState } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { FileUpload } from '../../upload/components/FileUpload';

interface InputBoxProps {
    onSubmit: (text: string, file: File | null) => void;
    isLoading: boolean;
}

export function InputBox({ onSubmit, isLoading }: InputBoxProps) {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !file) return;
        onSubmit(text, file);
    };

    return (
        <Card className="rotate-1 hover:rotate-0 transition-transform duration-500">
            <CardContent className="p-6 sm:p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="context" className="sr-only">
                            Your Mess
                        </label>
                        <Textarea
                            id="context"
                            placeholder="What's on your mind? dump it here bestie..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="bg-pastel-cream/50 min-h-[220px]"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-stretch">
                        <div className="w-full sm:w-1/2">
                            <FileUpload onFileSelect={setFile} selectedFile={file} />
                        </div>

                        <div className="w-full sm:w-1/2 flex items-end justify-end">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto font-display font-bold text-lg tracking-wide group relative overflow-hidden"
                                disabled={isLoading || (!text.trim() && !file)}
                                isLoading={isLoading}
                            >
                                <span className="relative z-10 flex items-center">
                                    {isLoading ? "Vibing..." : "Make it Make Sense ✨"}
                                </span>
                                {!isLoading && (
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
