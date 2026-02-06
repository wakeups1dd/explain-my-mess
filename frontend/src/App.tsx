import { useState, useRef } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2, Sparkles, Mic, MicOff, Plus, X, ImageIcon, FileText, FileCode } from 'lucide-react';
import { Layout } from './components/Layout';
// FileUpload component removed
import { ExplanationDisplay } from './components/ExplanationDisplay';
import { VoiceVisualizer } from './components/VoiceVisualizer';

const MAX_CHARS = 5000;

function App() {
    const [textContext, setTextContext] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [allowedFileTypes, setAllowedFileTypes] = useState<string>('image/*');

    // Reference for the speech recognition instance
    const recognitionRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Simple validation - just set it
            setSelectedFile(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileTypeClick = (type: 'image' | 'doc' | 'pdf') => {
        setShowFileMenu(false);
        let acceptType = '';

        switch (type) {
            case 'image':
                acceptType = 'image/*';
                break;
            case 'doc':
                acceptType = '.txt,.md,.json,.js,.ts,.tsx,.css,.html'; // Text based docs for now
                break;
            case 'pdf':
                acceptType = 'application/pdf';
                break;
        }

        setAllowedFileTypes(acceptType);
        // Timeout to allow state to update before clicking - a bit hacky but works for simple react updates usually, 
        // or we use useEffect. But for file input click, immediate might send old accept or verify check. 
        // Actually, setting state doesn't block, so click might happen before render update of input accept.
        // Better to use a useEffect on allowedFileTypes or just accept all and validate in onChange, 
        // but accept attribute updates file picker filter.
        // Let's rely on standard flush.
        setTimeout(() => fileInputRef.current?.click(), 0);
    };

    const charCount = textContext.length;
    const isNearLimit = charCount > MAX_CHARS * 0.8;
    const isOverLimit = charCount > MAX_CHARS;

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setError('Speech recognition is not supported in this browser.');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    setError('Microphone access denied. Please allow microphone permissions.');
                }
            };

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setTextContext(prev => {
                        const newText = prev + (prev ? ' ' : '') + finalTranscript;
                        // Determine if we exceed max chars with new text - optional safety
                        // For now just append
                        return newText;
                    });
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!textContext.trim() && !selectedFile) {
            setError('Please provide some text context or upload an image.');
            return;
        }

        if (isOverLimit) {
            setError(`Text exceeds maximum length of ${MAX_CHARS} characters.`);
            return;
        }

        setLoading(true);
        setError('');
        setExplanation('');
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('text', textContext);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await axios.post('/api/explain', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.explanation) {
                setExplanation(response.data.explanation);
                setSuccess(true);
            }
        } catch (err) {
            console.error('Explanation request failed', err);
            setError('Failed to get an explanation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-surface border border-border/20 rounded-2xl shadow-luxury p-8 hover-luxury backdrop-luxury">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2">
                                Input
                            </h2>
                            <p className="text-sm text-text-tertiary">
                                Share your messy code or thoughts for AI-powered clarity
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label htmlFor="context" className="block text-sm font-semibold text-text-primary">
                                        Code or Description
                                    </label>
                                    <span
                                        className={`text-xs font-bold ${isOverLimit
                                            ? 'text-error'
                                            : isNearLimit
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent'
                                                : 'text-text-tertiary'
                                            }`}
                                    >
                                        {charCount} / {MAX_CHARS}
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        id="context"
                                        rows={10}
                                        className={`block w-full rounded-xl border-2 bg-surface-elevated font-mono text-sm p-4 pb-12 pl-12 resize-none transition-all duration-300 focus:shadow-glow ${isOverLimit
                                            ? 'border-error focus:border-error'
                                            : 'border-border/30 focus:border-primary'
                                            }`}
                                        placeholder="function example() {
  // paste your messy code here
  return magic;
}"
                                        value={textContext}
                                        onChange={(e) => setTextContext(e.target.value)}
                                    />

                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept={allowedFileTypes}
                                        onChange={handleFileSelect}
                                    />

                                    {/* Plus / Add Image Button */}
                                    <div className="absolute bottom-3 left-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowFileMenu(!showFileMenu)}
                                            className={`p-2 rounded-lg transition-all duration-300 hover-luxury ${showFileMenu
                                                ? 'bg-primary text-white rotate-45'
                                                : 'bg-surface hover:bg-primary/10 text-text-tertiary hover:text-primary'
                                                }`}
                                            title="Add attachment"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>

                                        {/* File Type Menu */}
                                        {showFileMenu && (
                                            <>
                                                {/* Backdrop to close menu */}
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setShowFileMenu(false)}
                                                />
                                                <div className="absolute bottom-14 left-0 z-20 w-48 bg-surface-elevated rounded-xl shadow-luxury border border-border/30 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="p-2 space-y-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileTypeClick('image')}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors text-sm font-medium text-text-primary text-left"
                                                        >
                                                            <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                                <ImageIcon className="w-4 h-4" />
                                                            </div>
                                                            Images
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileTypeClick('doc')}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors text-sm font-medium text-text-primary text-left"
                                                        >
                                                            <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                                <FileText className="w-4 h-4" />
                                                            </div>
                                                            Documents
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileTypeClick('pdf')}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors text-sm font-medium text-text-primary text-left"
                                                        >
                                                            <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                                <FileCode className="w-4 h-4" />
                                                            </div>
                                                            PDF
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {isListening && (
                                        <div className="absolute left-16 right-16 bottom-0 h-16 pointer-events-none">
                                            <VoiceVisualizer />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all duration-300 ${isListening
                                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 animate-pulse'
                                            : 'bg-surface hover:bg-primary/10 text-text-tertiary hover:text-primary'
                                            }`}
                                        title={isListening ? "Stop recording" : "Start recording"}
                                    >
                                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>

                                    {/* File Preview Badge (Floating) */}
                                    {selectedFile && (
                                        <div className="absolute bottom-14 left-3 right-3 mx-auto max-w-fit animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2 p-2 pr-3 rounded-lg bg-surface-elevated border border-border/30 shadow-lg text-xs font-medium text-text-secondary">
                                                <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-900/30">
                                                    {selectedFile.type.startsWith('image/') ? (
                                                        <ImageIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                    ) : selectedFile.type === 'application/pdf' ? (
                                                        <FileCode className="w-3 h-3 text-red-600 dark:text-red-400" />
                                                    ) : (
                                                        <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                    )}
                                                </div>
                                                <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={clearFile}
                                                    className="ml-1 p-0.5 rounded-full hover:bg-error/10 hover:text-error transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Removed FileUpload component */}

                            {error && (
                                <div className="rounded-xl bg-error/10 border-2 border-error/30 px-4 py-3 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                                    <p className="text-sm font-medium text-error">{error}</p>
                                </div>
                            )}

                            {success && !loading && explanation && (
                                <div className="rounded-xl bg-success/10 border-2 border-success/30 px-4 py-3 flex items-start gap-3 glow-purple">
                                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                    <p className="text-sm font-medium text-success">Explanation generated successfully! ✨</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (!textContext && !selectedFile) || isOverLimit}
                                className="w-full group relative flex justify-center items-center gap-3 py-4 px-6 rounded-xl gradient-luxury shadow-luxury text-white text-base font-bold hover-luxury disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            >
                                {/* Animated shimmer effect */}
                                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />

                                <span className="relative flex items-center gap-3">
                                    {loading ? (
                                        <>
                                            <Sparkles className="w-5 h-5 animate-pulse" />
                                            Analyzing your mess...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Explain It!
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    <ExplanationDisplay markdown={explanation} loading={loading} />

                    {!explanation && !loading && (
                        <div className="h-full w-full flex items-center gap-8 p-10 border-2 border-dashed border-border/30 rounded-2xl shadow-luxury hover-glow transition-all duration-300 group bg-surface/50 backdrop-blur-sm">
                            <div className="relative flex-shrink-0 animate-float">
                                {/* Glowing aura */}
                                <div className="absolute inset-0 gradient-rainbow rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                                <div className="relative w-20 h-20 gradient-emerald rounded-2xl flex items-center justify-center shadow-luxury rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            <div className="text-left space-y-2">
                                <h3 className="text-2xl font-bold">
                                    Ready to Transform
                                </h3>
                                <p className="text-base text-text-tertiary leading-relaxed max-w-lg">
                                    Submit your messy code or thoughts and watch as AI brings clarity and understanding ✨
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </Layout >
    );
}

export default App;
