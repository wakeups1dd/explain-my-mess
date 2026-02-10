import { useEffect, useRef } from 'react';

export function VoiceVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);
    // Store history of volume levels for scrolling effect
    const historyRef = useRef<number[]>([]);

    useEffect(() => {
        const initAudio = async () => {
            try {
                // Initialize Audio Context
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

                // Get user media
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Create analyser
                const analyser = audioContextRef.current.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.5; // Smooth out the spikes
                analyserRef.current = analyser;

                // Create source
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyser);
                sourceRef.current = source;

                // Create data array
                const bufferLength = analyser.frequencyBinCount;
                dataArrayRef.current = new Uint8Array(bufferLength);

                visualize();
            } catch (err) {
                console.error("Error accessing microphone:", err);
            }
        };

        const visualize = () => {
            const canvas = canvasRef.current;
            const analyser = analyserRef.current;
            const dataArray = dataArrayRef.current;

            if (!canvas || !analyser || !dataArray) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Update data
            analyser.getByteFrequencyData(dataArray as any);

            // Calculate average volume for this frame to treat as "intensity"
            // We focus on lower frequencies for voice (indices 0-40 mostly coverage for voice)
            let sum = 0;
            const voiceRange = Math.min(dataArray.length, 50); // Typical voice range
            for (let i = 0; i < voiceRange; i++) {
                sum += dataArray[i];
            }
            const average = sum / voiceRange;

            // Push to history (scrolling effect logic)
            // Reverting to Right-to-Left: Add to END (right/newest), Remove from START (left/oldest)
            historyRef.current.push(average);

            // Limit history length to canvas width (assuming bar width + gap)
            // Let's say bar width 3px + gap 2px = 5px (finer detail)
            const barWidth = 3;
            const gap = 2;
            const totalBarWidth = barWidth + gap;

            // Adjust maxBars dynamically based on canvas width
            const maxBars = Math.ceil(canvas.width / totalBarWidth);

            if (historyRef.current.length > maxBars) {
                historyRef.current.shift(); // Remove oldest (left) to scroll
            }

            // Drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const bars = historyRef.current;
            const centerY = canvas.height / 2;

            // Calculate total width of all bars to determine start position (Right Alignment)
            const currentTotalWidth = bars.length * totalBarWidth;
            const startX = canvas.width - currentTotalWidth;

            for (let i = 0; i < bars.length; i++) {
                // Draw array[0] at startX.
                // array[0] is OLDEST. It will be the leftmost bar of the group.
                // As data grows, startX moves left.
                // As data scrolls (shift), bars move left.

                const vol = bars[i];

                // Scale height: 0-255 -> 0-100% canvas height. 
                // Voice often isn't max volume, so let's boost a bit (vol * 2.0)
                let barHeight = (vol / 255) * canvas.height * 2.0;

                // Min height for "silence track" effect
                if (barHeight < 2) barHeight = 2;

                const x = startX + (i * totalBarWidth);
                const y = centerY - (barHeight / 2);

                // Solid Light Grey as requested
                ctx.fillStyle = '#cbd5e1'; // slate-300 - clearly visible but "light grey"

                // Rounded bars
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, [2]);
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(visualize);
        };

        initAudio();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (sourceRef.current) sourceRef.current.disconnect();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
                canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
                // Pre-fill history to avoid jump? No, start empty is fine.
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial sizing

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full h-full flex items-end">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                height={64} // Default internal resolution
            />
        </div>
    );
}
