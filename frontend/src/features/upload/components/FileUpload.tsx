import React, { useCallback, useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div className="w-full h-full">
            {selectedFile && previewUrl ? (
                <div className="relative group rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-center">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-50">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <button
                        onClick={clearFile}
                        type="button"
                        className="absolute -top-2 -right-2 p-1.5 bg-white text-slate-500 hover:text-red-500 rounded-full shadow-md border border-slate-100 transition-colors"
                        title="Remove image"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="mt-2 px-2 flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                        <span className="uppercase font-medium">Image</span>
                    </div>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out flex flex-col items-center justify-center h-full min-h-[140px] text-center w-full",
                        isDragging
                            ? "border-indigo-500/50 bg-indigo-50/50 scale-[1.02]"
                            : "border-slate-200 bg-slate-50/50 hover:border-indigo-400/50 hover:bg-white"
                    )}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center py-6 px-4 text-center w-full pointer-events-none">
                        <div className={cn(
                            "mb-3 rounded-full p-3 transition-colors duration-300 mx-auto",
                            isDragging ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 shadow-sm"
                        )}>
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors mx-auto">
                            Attach an image
                        </p>
                        <p className="mt-1 text-xs text-slate-400 group-hover:text-slate-500 mx-auto">
                            Drop it here or click to browse
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

}
