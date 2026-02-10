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

                    // Calculate total width of all bars to determine start position (Right Alignment)
                    // NOTE: The following code snippet appears to be for a canvas-based rendering approach,
                    // which is not currently implemented in this component (it uses div elements).
                    // Variables like 'bars', 'canvas', 'totalBarWidth', 'centerY' are not defined in this scope.
                    // Inserting this code as requested, but it will cause syntax errors or runtime issues
                    // unless the component is refactored to use a canvas and these variables are defined.
                    // const currentTotalWidth = bars.length * totalBarWidth;
                    // const startX = canvas.width - currentTotalWidth;

                    // for (let i = 0; i < bars.length; i++) {
                    //     // Draw array[0] at startX.
                    //     // array[0] is OLDEST. It will be the leftmost bar of the group.
                    //     // As data grows, startX moves left.
                    //     // As data scrolls (shift), bars move left.

                    //     const vol = bars[i];

                    //     // Scale height: 0-255 -> 0-100% canvas height. 
                    //     // Voice often isn't max volume, so let's boost a bit (vol * 2.0)
                    //     let barHeight = (vol / 255) * canvas.height * 2.0;

                    //     // Min height for "silence track" effect
                    //     if (barHeight < 2) barHeight = 2;

                    //     const x = startX + (i * totalBarWidth);
                    //     const y = centerY - (barHeight / 2);
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
