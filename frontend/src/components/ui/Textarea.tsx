import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[160px] w-full rounded-3xl border-2 border-pastel-blue bg-white/50 px-6 py-5 text-lg font-medium ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pastel-blue/30 focus-visible:border-pastel-blue focus-visible:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-y",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
