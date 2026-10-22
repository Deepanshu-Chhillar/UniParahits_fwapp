function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${variableName})`;
  };
}

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        primary: {
          DEFAULT: withOpacity('--primary'),
          foreground: withOpacity('--primary-foreground'),
        },
        secondary: {
          DEFAULT: withOpacity('--secondary'),
          foreground: withOpacity('--secondary-foreground'),
        },
        accent: {
          DEFAULT: withOpacity('--accent'),
          foreground: withOpacity('--accent-foreground'),
        },
        muted: {
          DEFAULT: withOpacity('--muted'),
          foreground: withOpacity('--muted-foreground'),
        },
        card: {
          DEFAULT: withOpacity('--card'),
          foreground: withOpacity('--card-foreground'),
        },
        border: withOpacity('--border'),
        input: withOpacity('--input'),
        ring: withOpacity('--ring'),
        'rank-e': withOpacity('--rank-e'),
        'rank-d': withOpacity('--rank-d'),
        'rank-c': withOpacity('--rank-c'),
        'rank-b': withOpacity('--rank-b'),
        'rank-a': withOpacity('--rank-a'),
        // UniParahits Cyber-Academic Design System Tokens
        'slate-deep': '#07071A',
        'surface-base': '#0B0C24',
        'surface-card': '#111333',
        'surface-elevated': '#171A42',
        'mana-cyan': '#00F0FF',
        'zeni-gold': '#F59E0B',
        'violet-core': '#7C3AED',
        'success-pulse': '#10B981',
        brand: {
          charcoal: '#1e2430',
          sidebar: '#111125',
          canvas: '#07071A',
          card: '#111333',
          elevated: '#171A42',
          cyan: '#00F0FF',
          indigo: '#4f46e5',
          violet: '#7C3AED',
          emerald: '#10B981',
          amber: '#F59E0B',
          ruby: '#b81d42',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) * 1.5)',
        '2xl': 'calc(var(--radius) * 2)',
        '3xl': 'calc(var(--radius) * 3)',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'var(--font-dm-sans)', 'sans-serif'],
        headline: ['var(--font-plus-jakarta)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        code: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'float': '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
        'glow-cyan': '0 0 24px rgba(0, 240, 255, 0.25)',
        'glow-gold': '0 0 24px rgba(245, 158, 11, 0.25)',
        'glow-violet': '0 0 24px rgba(124, 58, 237, 0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};