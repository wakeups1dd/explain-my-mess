import { useEffect, useRef, useState } from 'react';

export function VoiceVisualizer() {
    // Number of bars to render
    const BAR_COUNT = 40;
    const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(BAR_COUNT).fill(0));

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const initAudio = async () => {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContext) return;

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const audioContext = new AudioContext();
                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                // fftSize corresponds to resolution. 
                // 128 fftSize = 64 frequency bins. We'll pick a subset or interpolate.
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.5; // Smooth out the jitter
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                sourceRef.current = source;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const updateWaveform = () => {
                    if (!analyserRef.current) return;

                    analyserRef.current.getByteFrequencyData(dataArray);

                    // We have 'bufferLength' data points (e.g. 128).
                    // We want to map this to 'BAR_COUNT' (e.g. 40).
                    // We'll calculate average for chunks to downsample.
                    const newData = new Uint8Array(BAR_COUNT);
                    const step = Math.floor(bufferLength / BAR_COUNT);

                    for (let i = 0; i < BAR_COUNT; i++) {
                        let sum = 0;
                        // Grab a chunk of frequencies
                        for (let j = 0; j < step; j++) {
                            const index = i * step + j;
                            if (index < bufferLength) {
                                sum += dataArray[index];
                            }
                        }
                        const avg = Math.floor(sum / step);
                        newData[i] = avg;
                    }

                    setFrequencyData(newData);
                    animationFrameRef.current = requestAnimationFrame(updateWaveform);
                };

                updateWaveform();

            } catch (err) {
                console.error("Error accessing microphone for visualizer:", err);
            }
        };

        initAudio();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-center gap-[2px] h-full w-full px-4">
            {Array.from(frequencyData).map((value, index) => {
                // Normalize height: value is 0-255.
                // We want height between maybe 10% and 100%.
                // Add a minimum height so inactive bars are visible dots/lines.
                const heightPercent = Math.max(10, (value / 255) * 100);

                return (
                    <div
                        key={index}
                        className="w-1.5 bg-gradient-to-t from-text-primary to-text-secondary rounded-full transition-all duration-75 ease-out opacity-80"
                        style={{
                            height: `${heightPercent}%`,
                        }}
                    />
                );
            })}
        </div>
    );
}
