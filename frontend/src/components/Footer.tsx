import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2">
          <AppLogo size={28} />
          <span className="font-bold text-base tracking-tight text-foreground">UniParahits</span>
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © 2026 UniParahits
        </p>
      </div>
      <div className="max-w-7xl mx-auto mt-6 text-center">
        <p className="text-xs text-muted-foreground italic opacity-60">
          Rank Up. Get Hired. The Elite Student Task Force.
        </p>
      </div>
    </footer>
  );
}