import { Search, Bell, HelpCircle } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center w-96">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-textMuted" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-slate-50 placeholder-textMuted focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                        placeholder="Search projects, tasks, or files..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-textMuted hover:text-text transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/3 -translate-y-1/3"></span>
                </button>
                <button className="text-textMuted hover:text-text transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-border mx-1"></div>
                <button className="text-sm font-medium text-textSecondary hover:text-primary transition-colors">
                    Teams
                </button>
            </div>
        </header>
    );
}
