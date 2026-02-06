import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const logoVariants = cva(
    "flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 shadow-lg",
    {
        variants: {
            size: {
                sm: "w-8 h-8",
                md: "w-10 h-10",
                lg: "w-12 h-12",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

export interface LogoProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> { }

export function Logo({ className, size, ...props }: LogoProps) {
    return (
        <div className={cn(logoVariants({ size, className }))} {...props}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("drop-shadow-sm", size === 'sm' ? "w-4 h-4" : "w-6 h-6")}
            >
                {/* Top face - Lightest */}
                <path
                    d="M12 2.5L21 7L12 11.5L3 7L12 2.5Z"
                    fill="white"
                    fillOpacity="0.95"
                />

                {/* Left face - Medium shadow */}
                <path
                    d="M12 11.5L3 7V17L12 21.5V11.5Z"
                    fill="white"
                    fillOpacity="0.75"
                />

                {/* Right face - Darkest shadow */}
                <path
                    d="M12 11.5V21.5L21 17V7L12 11.5Z"
                    fill="white"
                    fillOpacity="0.55"
                />
            </svg>
        </div>
    );
}
