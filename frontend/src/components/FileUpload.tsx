import React, { useCallback, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            onFileSelect(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearFile = () => {
        onFileSelect(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-semibold text-text-primary mb-3">
                Image (Optional)
            </label>

            {selectedFile && previewUrl ? (
                <div className="relative rounded-2xl border-2 border-border/30 bg-surface-elevated shadow-luxury p-5 hover-luxury">
                    <div className="flex items-center justify-center mb-4 rounded-xl overflow-hidden border border-border/20">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-56 object-contain"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                                <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 rounded-lg border border-border/30 bg-surface hover:bg-error/10 hover:border-error/50 transition-all duration-300 hover-luxury"
                            title="Remove"
                        >
                            <X className="w-4 h-4 text-text-secondary hover:text-error" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300",
                        isDragging
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-glow"
                            : "border-border/30 bg-surface-elevated hover:border-primary/50 hover:bg-surface hover-luxury"
                    )}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className={cn(
                            "p-4 rounded-2xl transition-all duration-300",
                            isDragging ? "gradient-emerald shadow-luxury" : "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
                        )}>
                            <Upload className={cn(
                                "w-8 h-8 transition-colors duration-300",
                                isDragging ? "text-white" : "text-purple-600 dark:text-purple-400"
                            )} />
                        </div>
                        <div className="text-sm font-semibold text-text-primary">
                            {isDragging ? 'Drop your image here!' : 'Click or drag image'}
                        </div>
                        <div className="text-xs text-text-tertiary">
                            PNG, JPG, GIF up to 10MB
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
