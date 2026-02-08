import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check localStorage
        const stored = localStorage.getItem('theme');
        const shouldBeDark = stored === 'dark';

        setIsDark(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="relative p-3 rounded-xl bg-white/20 border border-white/30 backdrop-luxury hover-luxury group overflow-hidden"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
                {isDark ? (
                    <Moon className="w-5 h-5 text-white" />
                ) : (
                    <Sun className="w-5 h-5 text-white" />
                )}
            </div>
        </button>
    );
}
