import { useState, useRef } from 'react';
import axios from 'axios';
import { Send, AlertCircle, CheckCircle2, Sparkles, Mic, MicOff } from 'lucide-react';
import { Layout } from './components/Layout';
import { FileUpload } from './components/FileUpload';
import { ExplanationDisplay } from './components/ExplanationDisplay';

const MAX_CHARS = 5000;

function App() {
    const [textContext, setTextContext] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Reference for the speech recognition instance
    const recognitionRef = useRef<any>(null);

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
                formData.append('image', selectedFile);
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                        className={`block w-full rounded-xl border-2 bg-surface-elevated font-mono text-sm p-4 pb-12 resize-none transition-all duration-300 focus:shadow-glow ${isOverLimit
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
                                </div>
                            </div>

                            <FileUpload
                                onFileSelect={setSelectedFile}
                                selectedFile={selectedFile}
                            />

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
                        <div className="h-full flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border/30 rounded-2xl shadow-luxury hover-glow transition-all duration-300 group">
                            <div className="relative mb-6 animate-float">
                                {/* Glowing aura */}
                                <div className="absolute inset-0 gradient-rainbow rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                                <div className="relative w-24 h-24 gradient-emerald rounded-3xl flex items-center justify-center shadow-luxury rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <Sparkles className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Ready to Transform
                            </h3>
                            <p className="text-sm text-text-tertiary max-w-xs leading-relaxed">
                                Submit your messy code or thoughts and watch as AI brings clarity and understanding ✨
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default App;
