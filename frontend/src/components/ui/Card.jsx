import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
