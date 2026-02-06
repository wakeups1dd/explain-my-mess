import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pastel-lilac focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 border-2",
    {
        variants: {
            variant: {
                default: "border-indigo-400 bg-indigo-400 text-white shadow-[4px_4px_0px_0px_rgba(129,140,248,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(129,140,248,1)]",
                destructive: "border-red-400 bg-red-400 text-white shadow-[4px_4px_0px_0px_rgba(248,113,113,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(248,113,113,1)]",
                outline: "border-pastel-lilac bg-white text-pastel-text shadow-[4px_4px_0px_0px_#E2D1F9] hover:bg-pastel-lilac/10 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#E2D1F9]",
                secondary: "border-pastel-mint bg-pastel-mint text-pastel-text shadow-[4px_4px_0px_0px_#A7F3D0] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#A7F3D0]",
                ghost: "border-transparent hover:bg-pastel-blue/20 text-pastel-text",
                link: "text-indigo-400 underline-offset-4 hover:underline border-transparent",
            },
            size: {
                default: "h-12 px-8 py-3",
                sm: "h-10 rounded-full px-6",
                lg: "h-16 rounded-full px-12 text-lg",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
