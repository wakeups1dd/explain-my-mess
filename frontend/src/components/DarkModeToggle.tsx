import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';

export function DarkModeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check system preference or local storage
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
        </Button>
    );
}
