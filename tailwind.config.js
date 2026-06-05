/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1600px',
    },
    extend: {
      fontFamily: {
        heading: ['Amiri', 'serif'],
        sans:    ['Tajawal', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        amiri:   ['Amiri', 'serif'],
        cairo:   ['Amiri', 'serif'], // legacy alias
      },
      colors: {
        // ── Brand palette — Royal Champagne ──
        noir:        '#0a0a0a',
        'noir-rich': '#050505',
        onyx:        '#141210',
        'onyx-mid':  '#1f1c17',
        pearl:       '#F5EFE0',
        gold: {
          DEFAULT:   '#C5A059',  // royal gold
          bright:    '#E2C68E',  // champagne
          glow:      '#E2C68E',
          deep:      '#A67C37',  // antique
          bronze:    '#85642E',
          // legacy aliases (kept so existing classNames keep compiling)
          matte:     '#C5A059',
          primary:   '#C5A059',
          highlight: '#E2C68E',
        },
        // legacy aliases — point to current palette
        'luxury-black': '#0a0a0a',
        'gold-matte':   '#C5A059',
        luxury: {
          black:    '#0a0a0a',
          deep:     '#050505',
          rich:     '#050505',
          elevated: '#1f1c17',
        },
        text: {
          primary:   '#F5EFE0',
          secondary: 'rgba(245, 239, 224, 0.85)',
          muted:     'rgba(245, 239, 224, 0.55)',
        },
        // Older "charcoal-*" references (legacy fallback)
        charcoal: {
          DEFAULT: '#141210',
          mid:     '#1f1c17',
          light:   '#2a261f',
        },
      },
      backgroundImage: {
        'royal':      'linear-gradient(135deg, #A67C37 0%, #C5A059 35%, #E2C68E 65%, #C5A059 100%)',
        'gold-shine': 'linear-gradient(90deg, #C5A059 0%, #E2C68E 40%, #A67C37 80%, #C5A059 100%)',
        'onyx':       'linear-gradient(135deg, #141210 0%, #0a0a0a 100%)',
        'gold-matte': 'linear-gradient(135deg, #C5A059 0%, #E2C68E 50%, #A67C37 100%)',
      },
      boxShadow: {
        'royal-card': '0 12px 40px rgba(0, 0, 0, 0.55)',
        'gold-glow':  '0 0 30px rgba(197, 160, 89, 0.35)',
      },
      animation: {
        'shine':       'shine 2.5s linear infinite',
        'floaty':      'floaty 6s ease-in-out infinite',
        'kenburns':    'kenburns 18s ease-out infinite alternate',
        'shimmer':     'shimmer 3s linear infinite',
      },
      keyframes: {
        shine:  { '100%': { backgroundPosition: '200% center' } },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        kenburns: {
          '0%':   { transform: 'scale(1) translate(0,0)' },
          '100%': { transform: 'scale(1.10) translate(-1%, -1.2%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
      },
    },
  },
  plugins: [],
};
