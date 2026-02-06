import { Home, Folder, CheckSquare, BarChart2, Settings, LifeBuoy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const navItems = [
        { icon: Home, label: 'Dashboard', active: true },
        { icon: Folder, label: 'Projects', active: false },
        { icon: CheckSquare, label: 'Tasks', active: false },
        { icon: BarChart2, label: 'Reports', active: false },
    ];

    const bottomItems = [
        { icon: LifeBuoy, label: 'Support', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <aside className={cn("w-64 bg-white border-r border-border flex flex-col h-full", className)}>
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-xl font-bold text-text tracking-tight">ExplainApp</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
                    Overview
                </div>
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            item.active
                                ? "bg-primaryLight text-primary"
                                : "text-textSecondary hover:bg-slate-50 hover:text-text"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", item.active ? "text-primary" : "text-textMuted group-hover:text-text")} />
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="p-3 border-t border-border/50 space-y-1">
                {bottomItems.map((item) => (
                    <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-textSecondary hover:bg-slate-50 hover:text-text transition-colors"
                    >
                        <item.icon className="w-5 h-5 text-textMuted" />
                        {item.label}
                    </button>
                ))}

                <div className="mt-4 pt-4 border-t border-border px-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-textSecondary">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">John Doe</p>
                        <p className="text-xs text-textMuted truncate">Product Manager</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
