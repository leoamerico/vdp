import React from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar({ value, max = 100, className, colorClass = "bg-primary" }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
            <div
                className={cn("h-full transition-all duration-500 ease-in-out", colorClass)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
