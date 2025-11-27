import React from 'react';
import { Header } from './Header';

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Header />
            <main className="container py-6 px-4 md:px-8">
                {children}
            </main>
        </div>
    );
}
